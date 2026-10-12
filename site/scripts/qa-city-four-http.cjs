/* Four independent tokens over REAL localhost HTTP, not browser/storage-engine QA.
 * The server uses the actual Edge handler and authority engine with memory CAS.
 * Run: node scripts/serve-city-rooms.cjs, then node scripts/qa-city-four-http.cjs.
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { transformSync } = require('next/dist/build/swc');
const root = path.resolve(__dirname, '..');
const source = transformSync(fs.readFileSync(path.join(root, 'lib/urban-quiz.ts'), 'utf8'), {
  jsc: { parser: { syntax: 'typescript' }, target: 'es2022' }, module: { type: 'es6' },
}).code.replace(/\bexport /g, '');
const { quizzes } = new Function(source + ';return {quizzes};')();
const answerKey = new Map(quizzes.map(quiz => [quiz.id, quiz.answer]));
const api = process.env.CITY_ROOM_TEST_URL?.trim() || 'http://127.0.0.1:3192';
const remote = api !== 'http://127.0.0.1:3192';
if (remote && !/^https:\/\/[a-z0-9]+\.supabase\.co\/functions\/v1\/ak-city-room\/?$/.test(api)) throw new Error('Use the explicit HTTPS Supabase ak-city-room endpoint, without secrets or query parameters');
const testOrigin = process.env.CITY_ROOM_TEST_ORIGIN?.trim();
const origins = [3191,3193,3194,3195].map(port => testOrigin || `http://127.0.0.1:${port}`);
const configs = {
  little: { rounds: 6, reserve: 4, knowledge: 2 },
  junior: { rounds: 8, reserve: 8, knowledge: 3 },
  advanced: { rounds: 10, reserve: 12, knowledge: 4 },
};
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
let requests = 0, lastRequest = 0;
async function post(client, body) {
  // Leave capacity for the simultaneously running four browser clients. Keep
  // the production rate limiter enabled; this test is intentionally paced.
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(Math.max(0, 400 - (Date.now() - lastRequest)));
    lastRequest = Date.now();
    const response = await fetch(api, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: client.origin },
      body: JSON.stringify(body), signal: AbortSignal.timeout(10000),
    });
    requests++;
    assert.equal(response.headers.get('access-control-allow-origin'), client.origin);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const result = await response.json();
    if (response.status === 429) { await sleep(1500); continue; }
    return { status: response.status, result };
  }
  throw new Error('Rate limiter stayed busy beyond the bounded test retry window');
}
function roomOf(reply) {
  assert.equal(reply.status, 200, `Unexpected HTTP ${reply.status}: ${reply.result.error?.code}`);
  assert.equal(reply.result.ok, true);
  assert(reply.result.room);
  return reply.result.room;
}
function shared(room) {
  const { mySeat, isHost, ...state } = room;
  return state;
}
async function synchronize(clients, room, stats) {
  for (const client of clients) {
    const received = roomOf(await post(client, { op: 'read', token: client.token, roomCode: room.roomCode }));
    assert.equal(received.mySeat, client.seat);
    assert.equal(received.isHost, client.seat === 0);
    assert.equal(received.version, room.version);
    assert.deepEqual(shared(received), shared(room));
    assert.equal(received.members.length, 4);
    assert(!JSON.stringify(received).includes('tokenHash'));
    stats.synchronizedSnapshots++;
  }
}
async function mutate(clients, room, op, extra = {}) {
  const seat = ['start', 'reset', 'close'].includes(op) ? 0 : room.game.turn;
  return roomOf(await post(clients[seat], { op, roomCode: room.roomCode, token: clients[seat].token,
    expectedVersion: room.version, requestId: crypto.randomUUID(), ...extra }));
}
async function play(mode) {
  const cfg = configs[mode], stats = { mode, players: 4, turns: 0, turnsPerPlayer: [0,0,0,0], synchronizedSnapshots: 0, wrongPlayerRejected: 0, restoredTokens: 0, won: false };
  // These objects represent four independently saved credentials. No token is
  // printed or written to disk; actual browser isolation is tested separately.
  const clients = origins.map((origin, seat) => ({ origin, seat, token: crypto.randomBytes(16).toString('hex') }));
  assert.equal(new Set(clients.map(client => client.token)).size, 4);
  let room = roomOf(await post(clients[0], { op: 'create', token: clients[0].token, requestId: crypto.randomUUID(), expectedVersion: 0, mode, capacity: 4, seat: 0 }));
  for (let seat = 1; seat < 4; seat++) room = roomOf(await post(clients[seat], {
    op: 'join', token: clients[seat].token, roomCode: room.roomCode, requestId: crypto.randomUUID(), expectedVersion: null, seat,
  }));
  await synchronize(clients, room, stats);
  room = await mutate(clients, room, 'start');
  assert.equal(room.game.players, 4);
  let restored = false;
  while (room.game.phase !== 'done') {
    assert.equal(room.game.phase, 'roll');
    const activeSeat = room.game.turn;
    const other = clients[(activeSeat + 1) % 4];
    const denied = await post(other, { op: 'roll', token: other.token, roomCode: room.roomCode,
      expectedVersion: room.version, requestId: crypto.randomUUID() });
    assert.equal(denied.status, 403); assert.equal(denied.result.error.code, 'NOT_YOUR_TURN');
    stats.wrongPlayerRejected++;
    room = await mutate(clients, room, 'roll');
    assert(room.game.dice >= 1 && room.game.dice <= 6);
    assert.equal(room.game.phase, 'choose');
    const state = room.game;
    const goal = state.knowledge < cfg.knowledge ? 'quiz' : state.savings < cfg.reserve ? 'save' : state.projects.length < 2 ? 'project' : 'rest';
    const preferred = state.choices.findIndex(choice => choice.action === goal && (goal !== 'project' || !state.projects.includes(choice.amount)));
    const index = preferred >= 0 ? preferred : state.choices.findIndex(choice => choice.action === 'rest');
    assert(index >= 0, 'Expected an available cooperative goal action');
    room = await mutate(clients, room, 'act', { index });
    if (room.game.phase === 'quiz') {
      assert.equal(room.game.quiz.answer, -1, 'Answer key must be hidden in the public question');
      const answer = answerKey.get(room.game.quiz.id); assert(Number.isInteger(answer));
      room = await mutate(clients, room, 'answer', { index: answer });
      assert.equal(room.game.phase, 'feedback');
      room = await mutate(clients, room, 'finishQuiz');
    }
    assert.equal(room.game.phase, 'next');
    stats.turns++; stats.turnsPerPlayer[activeSeat]++;
    room = await mutate(clients, room, 'next');
    await synchronize(clients, room, stats);
    if (!restored && room.game.round >= Math.ceil(cfg.rounds / 2)) {
      // Reconstruct all four client identities from serialized saved credentials.
      // This exercises token recovery on HTTP, not an actual browser reload.
      for (let seat = 0; seat < 4; seat++) {
        clients[seat] = JSON.parse(JSON.stringify(clients[seat]));
        const recovered = roomOf(await post(clients[seat], { op: 'join', token: clients[seat].token,
          roomCode: room.roomCode, requestId: crypto.randomUUID(), expectedVersion: null, seat: (seat + 1) % 4 }));
        assert.equal(recovered.mySeat, seat, 'Reconnect may not change the originally claimed seat');
        assert.equal(recovered.version, room.version);
        assert.deepEqual(shared(recovered), shared(room)); stats.restoredTokens++;
      }
      restored = true;
    }
    if (activeSeat === 3) console.log(`PROGRESS ${mode}: round ${stats.turns / 4}/${cfg.rounds}, all four snapshots agree`);
    assert(stats.turns <= cfg.rounds * 4, 'Game failed to finish');
  }
  assert.equal(stats.turns, cfg.rounds * 4);
  assert.deepEqual(stats.turnsPerPlayer, [cfg.rounds,cfg.rounds,cfg.rounds,cfg.rounds]);
  assert.equal(room.game.positions.length, 4);
  assert.equal(room.game.log.filter(line => line.includes('輪結算')).length, cfg.rounds);
  assert(room.game.projects.length >= 2 && room.game.savings >= cfg.reserve && room.game.knowledge >= cfg.knowledge);
  assert(room.game.cash >= 0 && room.game.savings >= 0);
  stats.won = true; stats.finalVersion = room.version;
  console.log('PASS '+JSON.stringify(stats));
  return stats;
}
(async () => {
  const results = [];
  for (const mode of Object.keys(configs)) results.push(await play(mode));
  console.log(JSON.stringify({ suite: 'four-token-real-http', browserTest: false, endpoint: api,
    database: remote ? 'Supabase-PostgreSQL-via-Edge' : 'memory-CAS', requests, results }, null, 2));
})().catch(error => { console.error('FAIL four-token HTTP:', error.message); process.exitCode = 1; });
