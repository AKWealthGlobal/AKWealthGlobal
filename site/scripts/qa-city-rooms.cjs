/* Server-authoritative room checks. Pure module + memory CAS store, not HTTP or WebSocket QA. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
const {transformSync} = require('next/dist/build/swc');
process.chdir(path.resolve(__dirname, '..'));

function load(file, names, imports = {}) {
  let source = transformSync(fs.readFileSync(file, 'utf8'), {jsc: {parser: {syntax: 'typescript'}, target: 'es2022'}, module: {type: 'es6'}}).code;
  source = source.replace(/^import\b[\s\S]*?;\s*$/gm, '').replace(/\bexport /g, '');
  return new Function(...Object.keys(imports), source + ';return {' + names.join(',') + '};')(...Object.values(imports));
}
const {quizzes} = load('lib/urban-quiz.ts', ['quizzes']);
const game = load('lib/urban-game.ts', ['configs', 'startCity', 'moveCity', 'actCity', 'answerCity', 'finishQuiz', 'nextCity', 'canAct', 'wonCity', 'animals', 'tiles', 'zones'], {quizzes});
const protocol = load('lib/room-protocol.ts', ['ROOM_POLL_MS', 'ROOM_TTL_MS']);
const serverModule = load('lib/room-server.ts', ['createRoomService', 'roomError', 'roomHttpStatus', 'sha256'], {...game, ...protocol, ...crypto});
const {createRoomService} = serverModule;
const {createRoomHttpHandler, createRestRoomStore} = load('supabase/functions/ak-city-room/index.ts', ['createRoomHttpHandler', 'createRestRoomStore'], serverModule);

const clone = value => value == null ? value : structuredClone(value);
class MemoryRoomStore {
  rooms = new Map();
  conflicts = 0;
  forcedConflicts = 0;
  async get(code) { return clone(this.rooms.get(code) ?? null); }
  async findCreated(actorHash, requestId) {
    return clone([...this.rooms.values()].find(r => r.hostHash === actorHash && r.createRequestId === requestId) ?? null);
  }
  async create(room) {
    if (this.rooms.has(room.roomCode)) return false;
    this.rooms.set(room.roomCode, clone(room));
    return true;
  }
  async compareAndSwap(code, expectedVersion, next) {
    if (this.forcedConflicts > 0) { this.forcedConflicts--; this.conflicts++; return false; }
    if (this.rooms.get(code)?.version !== expectedVersion) { this.conflicts++; return false; }
    this.rooms.set(code, clone(next));
    return true;
  }
}

let requestNumber = 0, completeGames = 0, completeTurns = 0;
const groups = [];
const requestId = () => 'qa_request_' + String(++requestNumber).padStart(10, '0');
const token = n => n.toString(16).padStart(32, '0');
function fixture() {
  const store = new MemoryRoomStore();
  let now = Date.UTC(2026, 9, 7, 10), seed = 0x0ac2026;
  const service = createRoomService({
    store, now: () => now,
    randomInt: max => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; },
    hashToken: async value => crypto.createHash('sha256').update(value).digest('hex'),
  });
  return {store, send: request => service.handle(request), advance: ms => { now += ms; }};
}
function success(response) {
  assert.equal(response.ok, true, JSON.stringify(response));
  return response.room;
}
function error(response, code) {
  assert.equal(response.ok, false, JSON.stringify(response));
  assert.equal(response.error.code, code, JSON.stringify(response));
}
async function test(name, body) { await body(); groups.push(name); console.log('PASS: ' + name); }
async function create(f, capacity = 2, mode = 'little', seat = 0, actor = token(1)) {
  return success(await f.send({op: 'create', token: actor, requestId: requestId(), expectedVersion: 0, mode, capacity, seat}));
}
async function read(f, code, actor = token(1)) { return success(await f.send({op: 'read', roomCode: code, token: actor})); }
async function join(f, code, seat, actor = token(seat + 1)) {
  return success(await f.send({op: 'join', roomCode: code, token: actor, seat, requestId: requestId(), expectedVersion: null}));
}
function mutation(room, op, actor = token(1), extra = {}) {
  return {op, roomCode: room.roomCode, token: actor, expectedVersion: room.version, requestId: requestId(), ...extra};
}
async function filled(f, capacity = 2, mode = 'little') {
  let room = await create(f, capacity, mode);
  for (let seat = 1; seat < capacity; seat++) await join(f, room.roomCode, seat);
  return read(f, room.roomCode);
}

async function main() {
  await test('2–4 人房間建立／加入／滿房／座位衝突，以及公開 preview 不洩漏 token 或遊戲狀態', async () => {
    for (const capacity of [2, 3, 4]) {
      const f = fixture();
      let room = await create(f, capacity);
      assert.equal(room.capacity, capacity); assert.equal(room.mySeat, 0); assert(room.isHost);
      assert.equal(room.status, 'lobby'); assert.equal(room.game, null);
      const preview = await f.send({op: 'preview', roomCode: room.roomCode});
      assert(preview.ok && preview.preview);
      assert.deepEqual(preview.preview.freeSeats, Array.from({length: capacity - 1}, (_, i) => i + 1));
      const publicText = JSON.stringify(preview);
      for (const privateName of ['tokenHash', 'hostHash', 'receipts', 'game', 'token']) assert(!publicText.includes('"' + privateName + '"'));
      error(await f.send({op: 'start', ...mutation(room, 'start')}), 'NOT_READY');
      error(await f.send({op: 'join', roomCode: room.roomCode, token: token(9), seat: 0, expectedVersion: null, requestId: requestId()}), 'SEAT_TAKEN');
      for (let seat = 1; seat < capacity; seat++) {
        const joined = await join(f, room.roomCode, seat);
        assert.equal(joined.mySeat, seat); assert.equal(joined.isHost, false);
      }
      room = await read(f, room.roomCode);
      assert.equal(room.members.length, capacity);
      const full = await f.send({op: 'join', roomCode: room.roomCode, token: token(9), seat: 1, expectedVersion: null, requestId: requestId()});
      assert(!full.ok && ['ROOM_FULL', 'SEAT_TAKEN'].includes(full.error.code));
      assert.equal((await read(f, room.roomCode)).members.length, capacity);
    }
  });
  await test('非法 room code／token／人數／座位／版本／requestId 在伺服器拒絕', async () => {
    const f = fixture();
    for (const request of [null, {}, {op: 'delete'}, {op: 'read', roomCode: '../../secret', token: token(1)}]) error(await f.send(request), 'INVALID_REQUEST');
    const baseline = {op: 'create', token: token(1), requestId: requestId(), expectedVersion: 0, mode: 'little', capacity: 2, seat: 0};
    for (const patch of [{capacity: 1}, {capacity: 5}, {capacity: 2.5}, {seat: -1}, {seat: 2}, {seat: 0.5}, {mode: 'unknown'}, {token: 'x'}, {requestId: 'short'}, {expectedVersion: 1}]) error(await f.send({...baseline, ...patch}), 'INVALID_REQUEST');
    const room = await create(f);
    error(await f.send({op: 'read', roomCode: room.roomCode, token: token(50)}), 'UNAUTHORIZED');
    error(await f.send(mutation(room, 'roll', token(50))), 'UNAUTHORIZED');
    assert.equal((await read(f, room.roomCode)).status, 'lobby');
  });
  await test('房主／當前玩家／階段權限與無效 action index 均由伺服器執行', async () => {
    const f = fixture(); let room = await filled(f);
    error(await f.send(mutation(room, 'start', token(2))), 'NOT_HOST');
    error(await f.send(mutation(room, 'roll')), 'INVALID_PHASE');
    room = success(await f.send(mutation(room, 'start')));
    error(await f.send(mutation(room, 'roll', token(2))), 'NOT_YOUR_TURN');
    error(await f.send(mutation(room, 'next')), 'INVALID_PHASE');
    room = success(await f.send(mutation(room, 'roll')));
    assert(room.game.dice >= 1 && room.game.dice <= 6); assert.equal(room.game.phase, 'choose');
    for (const index of [-1, 999, 0.5, NaN, null, '0']) {
      const response = await f.send(mutation(room, 'act', token(1), {index}));
      assert(!response.ok && ['INVALID_REQUEST', 'INVALID_ACTION'].includes(response.error.code), JSON.stringify(response));
    }
    error(await f.send(mutation(room, 'act', token(2), {index: 0})), 'NOT_YOUR_TURN');
    assert.equal((await read(f, room.roomCode)).version, room.version);
    const qi = room.game.choices.findIndex(c => c.action === 'quiz');
    room = success(await f.send(mutation(room, 'act', token(1), {index: qi})));
    error(await f.send(mutation(room, 'finishQuiz')), 'INVALID_PHASE');
    for (const index of [-1, 999, 0.5, NaN, null, '0']) {
      const response = await f.send(mutation(room, 'answer', token(1), {index}));
      assert(!response.ok && ['INVALID_REQUEST', 'INVALID_ACTION'].includes(response.error.code), JSON.stringify(response));
    }
    assert.equal((await read(f, room.roomCode)).version, room.version);
  });
  await test('相同 request 重送不重複執行；並發不同 request 只允許一次 CAS 更新', async () => {
    const f = fixture(); let room = await filled(f);
    room = success(await f.send(mutation(room, 'start')));
    const roll = mutation(room, 'roll');
    const first = await f.send(roll); const replay = await f.send(roll);
    assert(first.ok && replay.ok && replay.replayed);
    assert.deepEqual(replay.room.game, first.room.game); assert.equal(replay.room.version, first.room.version);
    error(await f.send(mutation(room, 'roll')), 'VERSION_CONFLICT');
    room = first.room;
    const save = room.game.choices.findIndex(c => c.action === 'save');
    const beforeTotal = room.game.cash + room.game.savings;
    const requests = [mutation(room, 'act', token(1), {index: save}), mutation(room, 'act', token(1), {index: save})];
    const concurrent = await Promise.all(requests.map(r => f.send(r)));
    assert.equal(concurrent.filter(r => r.ok).length, 1, JSON.stringify(concurrent));
    error(concurrent.find(r => !r.ok), 'VERSION_CONFLICT');
    room = await read(f, room.roomCode);
    assert.equal(room.game.savings, 4); assert.equal(room.game.cash + room.game.savings, beforeTotal);
    assert.equal(room.game.phase, 'next');
  });
  await test('並發建房／加入同座／不同座／同一行動重送皆不重複；斷線重連不換座位', async () => {
    const f = fixture();
    const creation = {op: 'create', token: token(1), requestId: requestId(), expectedVersion: 0, mode: 'little', capacity: 4, seat: 0};
    const created = await Promise.all([f.send(creation), f.send(creation)]);
    assert(created.every(r => r.ok)); assert.equal(f.store.rooms.size, 1);
    let room = created[0].room; assert.equal(created[1].room.roomCode, room.roomCode);
    const joins = [2, 3].map(n => ({op: 'join', roomCode: room.roomCode, token: token(n), seat: 1, expectedVersion: null, requestId: requestId()}));
    const raced = await Promise.all(joins.map(r => f.send(r)));
    assert.equal(raced.filter(r => r.ok).length, 1);
    error(raced.find(r => !r.ok), 'SEAT_TAKEN');
    assert(f.store.conflicts > 0, 'The memory test must exercise a genuine CAS race');
    const seatOneToken = raced[0].ok ? token(2) : token(3);
    const reconnect = await f.send({...joins[0], token: seatOneToken, seat: 3, requestId: requestId()});
    assert(reconnect.ok && reconnect.replayed); assert.equal(reconnect.room.mySeat, 1);
    const distinct = await Promise.all([2, 3].map(seat => f.send({op: 'join', roomCode: room.roomCode, token: token(seat + 8), seat, expectedVersion: null, requestId: requestId()})));
    assert(distinct.every(r => r.ok), JSON.stringify(distinct));
    room = await read(f, room.roomCode); assert.deepEqual(room.members.map(m => m.seat), [0, 1, 2, 3]);
    room = success(await f.send(mutation(room, 'start')));
    const roll = mutation(room, 'roll');
    const duplicate = await Promise.all([f.send(roll), f.send(roll)]);
    assert(duplicate.every(r => r.ok)); assert.equal(duplicate.filter(r => r.replayed).length, 1);
    const final = await read(f, room.roomCode);
    assert.equal(final.version, room.version + 1);
    assert.deepEqual(duplicate[0].room.game, duplicate[1].room.game);
    const forced = fixture(); const waiting = await create(forced);
    forced.store.forcedConflicts = 1;
    const joined = await join(forced, waiting.roomCode, 1);
    assert.equal(joined.members.length, 2); assert.equal(forced.store.conflicts, 1);
  });
  await test('房主可選非首位角色；伺服器忽略偽造骰值／資金且作答前遮蔽答案', async () => {
    const f = fixture(); let room = await create(f, 2, 'little', 1, token(1));
    await join(f, room.roomCode, 0, token(2));
    room = await read(f, room.roomCode);
    room = success(await f.send(mutation(room, 'start', token(1))));
    assert.equal(room.mySeat, 1); assert.equal(room.game.turn, 0);
    error(await f.send(mutation(room, 'roll', token(1))), 'NOT_YOUR_TURN');
    room = success(await f.send(mutation(room, 'roll', token(2), {dice: 0, cash: 999999, knowledge: 999999})));
    assert(room.game.dice >= 1 && room.game.dice <= 6);
    assert.equal(room.game.cash, game.configs.little.cash); assert.equal(room.game.knowledge, 0);
    const index = room.game.choices.findIndex(c => c.action === 'quiz');
    room = success(await f.send(mutation(room, 'act', token(2), {index, action: 'work', amount: 999999})));
    assert.equal(room.game.phase, 'quiz'); assert.equal(room.game.cash, game.configs.little.cash);
    assert.equal(room.game.quiz.answer, -1); assert.equal(room.game.quiz.why, '');
    const hostView = await read(f, room.roomCode, token(1));
    assert.equal(hostView.game.quiz.answer, -1); assert.equal(hostView.game.quiz.why, '');
    const unauthorized = await f.send({op: 'read', roomCode: room.roomCode, token: token(99)});
    error(unauthorized, 'UNAUTHORIZED'); assert.equal(unauthorized.room, undefined);
    const q = quizzes.find(q => q.id === room.game.quiz.id);
    room = success(await f.send(mutation(room, 'answer', token(2), {index: q.answer})));
    assert.equal(room.game.phase, 'feedback'); assert.equal(room.game.quiz.answer, q.answer); assert.equal(room.game.quiz.why, q.why);
  });
  await test('房主才能 reset／close；確認欄位必要；關閉與過期房間無法繼續操作', async () => {
    const f = fixture(); let room = await filled(f);
    room = success(await f.send(mutation(room, 'start')));
    error(await f.send(mutation(room, 'reset', token(2), {confirm: true})), 'NOT_HOST');
    error(await f.send(mutation(room, 'reset')), 'INVALID_REQUEST');
    room = success(await f.send(mutation(room, 'reset', token(1), {confirm: true})));
    assert.equal(room.status, 'lobby'); assert.equal(room.game, null); assert.equal(room.members.length, 2);
    error(await f.send(mutation(room, 'close', token(2), {confirm: true})), 'NOT_HOST');
    room = success(await f.send(mutation(room, 'close', token(1), {confirm: true})));
    assert.equal(room.status, 'closed');
    error(await f.send(mutation(room, 'start')), 'ROOM_CLOSED');
    const expired = fixture(), old = await create(expired);
    expired.advance(protocol.ROOM_TTL_MS + 1);
    error(await expired.send({op: 'read', roomCode: old.roomCode, token: token(1)}), 'EXPIRED');
    error(await expired.send({op: 'join', roomCode: old.roomCode, token: token(2), seat: 1, expectedVersion: null, requestId: requestId()}), 'EXPIRED');
  });
  await test('所有九種分齡／人數組合完成共同目標，每輪後可用原 token 重連讀取一致狀態', async () => {
    for (const mode of ['little', 'junior', 'advanced']) for (const capacity of [2, 3, 4]) {
      const f = fixture(); let room = await filled(f, capacity, mode);
      room = success(await f.send(mutation(room, 'start')));
      let turns = 0;
      while (room.game.phase !== 'done') {
        assert(++turns <= game.configs[mode].rounds * capacity);
        const actor = token(room.game.turn + 1);
        room = success(await f.send(mutation(room, 'roll', actor)));
        const s = room.game, cfg = game.configs[mode];
        const action = s.knowledge < cfg.knowledge ? 'quiz' : s.savings < cfg.reserve ? 'save' : s.projects.length < 2 ? 'project' : 'rest';
        let index = s.choices.findIndex(c => c.action === action && game.canAct(s, c));
        if (index < 0) index = s.choices.findIndex(c => c.action === 'rest');
        room = success(await f.send(mutation(room, 'act', actor, {index})));
        if (room.game.phase === 'quiz') {
          const q = quizzes.find(q => q.id === room.game.quiz.id), before = room.game.knowledge;
          room = success(await f.send(mutation(room, 'answer', actor, {index: (q.answer + 1) % q.options.length})));
          assert.equal(room.game.knowledge, before); assert.equal(room.game.phase, 'quiz');
          room = success(await f.send(mutation(room, 'answer', actor, {index: q.answer})));
          assert.equal(room.game.knowledge, before + 1);
          room = success(await f.send(mutation(room, 'finishQuiz', actor)));
        }
        room = success(await f.send(mutation(room, 'next', actor)));
        if (room.game.turn === 0) for (let seat = 0; seat < capacity; seat++) {
          const reconnected = await read(f, room.roomCode, token(seat + 1));
          assert.equal(reconnected.mySeat, seat); assert.equal(reconnected.version, room.version);
          assert.deepEqual(reconnected.game, room.game);
        }
        assert(room.game.cash >= 0 && room.game.savings >= 0); completeTurns++;
      }
      assert(game.wonCity(room.game)); assert.equal(turns, game.configs[mode].rounds * capacity);
      assert.equal(room.game.log.filter(l => l.includes('輪結算')).length, game.configs[mode].rounds);
      completeGames++;
    }
  });
  const moduleGroups = groups.length;
  await test('localhost HTTP 整合：CORS／格式大小／限速與建房加入開局讀取，使用記憶體 store', async () => {
    const store = new MemoryRoomStore(), limits = [];
    let allow = true;
    const env = name => ({ROOM_RATE_LIMIT_SALT: 'qa-local-only-salt', ROOM_ALLOWED_ORIGINS: 'http://localhost:3000'}[name]);
    const handler = createRoomHttpHandler({env, store, rateLimit: async (...args) => { limits.push(args); return allow; }});
    const server = http.createServer(async (request, response) => {
      try {
        const chunks = []; for await (const chunk of request) chunks.push(chunk);
        const body = Buffer.concat(chunks);
        const forwarded = new Request('http://127.0.0.1' + request.url, {method: request.method, headers: request.headers, ...(['GET', 'HEAD'].includes(request.method) ? {} : {body})});
        const result = await handler(forwarded, request.socket.remoteAddress ?? '127.0.0.1');
        response.writeHead(result.status, Object.fromEntries(result.headers));
        response.end(Buffer.from(await result.arrayBuffer()));
      } catch (error) { response.writeHead(500); response.end(String(error)); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = 'http://127.0.0.1:' + server.address().port + '/functions/v1/ak-city-room';
    const post = (body, options = {}) => fetch(url, {method: 'POST', headers: {'content-type': 'application/json', origin: 'http://localhost:3000', ...options.headers}, body: JSON.stringify(body)});
    try {
      const preflight = await fetch(url, {method: 'OPTIONS', headers: {origin: 'http://localhost:3000'}});
      assert.equal(preflight.status, 204); assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:3000');
      const denied = await post({}, {headers: {origin: 'http://localhost:3000.evil.example'}});
      assert.equal(denied.status, 403); assert.equal(denied.headers.get('access-control-allow-origin'), null);
      assert.equal((await fetch(url)).status, 405);
      assert.equal((await fetch(url, {method: 'POST', headers: {'content-type': 'text/plain'}, body: '{}'})).status, 400);
      assert.equal((await fetch(url, {method: 'POST', headers: {'content-type': 'application/json'}, body: '{bad'})).status, 400);
      assert.equal((await post({padding: 'x'.repeat(4200)})).status, 413);
      const creation = {op: 'create', token: token(1), requestId: requestId(), expectedVersion: 0, mode: 'little', capacity: 2, seat: 0};
      const created = await post(creation);
      assert.equal(created.status, 200); assert.equal(created.headers.get('cache-control'), 'no-store');
      let room = success(await created.json());
      assert(limits.at(-1)[0].startsWith('create:')); assert.equal(limits.at(-1)[1], 12); assert.equal(limits.at(-1)[2], 3600);
      assert(!limits.at(-1)[0].includes('127.0.0.1'));
      const joined = await post({op: 'join', roomCode: room.roomCode, token: token(2), seat: 1, requestId: requestId(), expectedVersion: null});
      assert.equal(joined.status, 200); assert.equal(success(await joined.json()).mySeat, 1);
      assert.equal(limits.at(-1)[1], 60);
      room = success(await (await post({op: 'read', roomCode: room.roomCode, token: token(1)})).json());
      assert.equal(limits.at(-1)[1], 360);
      room = success(await (await post(mutation(room, 'start'))).json());
      assert.equal(room.status, 'playing');
      const wrongPlayer = await post(mutation(room, 'roll', token(2)));
      assert.equal(wrongPlayer.status, 403); error(await wrongPlayer.json(), 'NOT_YOUR_TURN');
      const readBack = success(await (await post({op: 'read', roomCode: room.roomCode, token: token(2)})).json());
      assert.deepEqual(readBack.game, room.game);
      allow = false;
      const limited = await post({op: 'read', roomCode: room.roomCode, token: token(1)});
      assert.equal(limited.status, 429); error(await limited.json(), 'RATE_LIMITED');
      const unavailable = createRoomHttpHandler({env: () => undefined, rateLimit: async () => true});
      const failed = await unavailable(new Request(url, {method: 'POST', headers: {'content-type': 'application/json'}, body: '{}'}));
      assert.equal(failed.status, 503); error(await failed.json(), 'SERVER_ERROR');
    } finally { await new Promise(resolve => server.close(resolve)); }
  });
  await test('REST store fetch 模擬：版本 CAS 過濾與 payload／row version 一起更新', async () => {
    const f = fixture(); const publicView = await create(f);
    const record = await f.store.get(publicView.roomCode);
    const calls = [], replies = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, options = {}) => {
      calls.push({url: String(url), ...options});
      assert(replies.length, 'Unexpected REST request');
      const [status, body] = replies.shift();
      return new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json'}});
    };
    try {
      const store = createRestRoomStore('https://test-only.example/', 'test-only-service-key');
      replies.push([200, [{payload: record}]]);
      assert.deepEqual(await store.get(record.roomCode), record);
      assert.equal(new URL(calls.at(-1).url).searchParams.get('code'), 'eq.' + record.roomCode);
      replies.push([200, [{payload: record}]]);
      assert.deepEqual(await store.findCreated(record.hostHash, record.createRequestId), record);
      assert.equal(new URL(calls.at(-1).url).searchParams.get('creator_hash'), 'eq.' + record.hostHash);
      replies.push([201, []]); assert.equal(await store.create(record), true);
      const created = JSON.parse(calls.at(-1).body);
      assert.equal(created.version, record.version); assert.deepEqual(created.payload, record);
      replies.push([409, []]); assert.equal(await store.create(record), false);
      const next = {...record, version: record.version + 1};
      replies.push([200, [{payload: next}]]); assert.equal(await store.compareAndSwap(record.roomCode, record.version, next), true);
      const cas = calls.at(-1), filter = new URL(cas.url).searchParams;
      assert.equal(cas.method, 'PATCH'); assert.equal(filter.get('version'), 'eq.' + record.version);
      assert(filter.get('expires_at').startsWith('gt.'));
      assert.deepEqual(JSON.parse(cas.body), {version: next.version, payload: next});
      replies.push([200, []]); assert.equal(await store.compareAndSwap(record.roomCode, record.version, next), false);
      replies.push([503, {}]); await assert.rejects(() => store.get(record.roomCode), /unavailable/);
      assert.equal(replies.length, 0);
    } finally { globalThis.fetch = originalFetch; }
  });
  console.log(JSON.stringify({moduleGroups, integrationGroups: groups.length - moduleGroups, completeGames, completeTurns, mutationRequestIds: requestNumber, httpIntegration: 'localhost-http-with-memory-store', restAdapter: 'fetch-mock-only', deployedDatabase: 'not-tested', realDevices: 'not-run', webSockets: 'not-tested'}, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
