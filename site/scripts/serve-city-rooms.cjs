/* Local-only HTTP harness for the real Edge handler. Memory CAS is not a database. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { transformSync } = require('next/dist/build/swc');
const root = path.resolve(__dirname, '..');

function load(file, names, imports = {}) {
  let source = transformSync(fs.readFileSync(path.join(root, file), 'utf8'), {
    jsc: { parser: { syntax: 'typescript' }, target: 'es2022' }, module: { type: 'es6' },
  }).code;
  source = source.replace(/^import\b[\s\S]*?;\s*$/gm, '').replace(/\bexport /g, '');
  return new Function(...Object.keys(imports), source + ';return {' + names.join(',') + '};')(...Object.values(imports));
}
const { quizzes } = load('lib/urban-quiz.ts', ['quizzes']);
const game = load('lib/urban-game.ts', ['configs', 'startCity', 'moveCity', 'actCity', 'answerCity', 'finishQuiz', 'nextCity', 'canAct', 'wonCity', 'animals', 'tiles', 'zones'], { quizzes });
const protocol = load('lib/room-protocol.ts', ['ROOM_POLL_MS', 'ROOM_TTL_MS']);
const backend = load('lib/room-server.ts', ['createRoomService', 'roomError', 'roomHttpStatus', 'sha256'], { ...game, ...protocol });
const { createRoomHttpHandler } = load('supabase/functions/ak-city-room/index.ts', ['createRoomHttpHandler'], backend);
const clone = value => value == null ? value : structuredClone(value);
const rooms = new Map(), buckets = new Map();
const store = {
  async get(code) { return clone(rooms.get(code) ?? null); },
  async findCreated(actorHash, requestId) { return clone([...rooms.values()].find(r => r.hostHash === actorHash && r.createRequestId === requestId) ?? null); },
  async create(room) {
    if (rooms.has(room.roomCode) || [...rooms.values()].some(r => r.hostHash === room.hostHash && r.createRequestId === room.createRequestId)) return false;
    rooms.set(room.roomCode, clone(room)); return true;
  },
  async compareAndSwap(code, version, next) {
    const before = rooms.get(code);
    if (!before || before.version !== version || Date.parse(before.expiresAt) <= Date.now()) return false;
    rooms.set(code, clone(next)); return true;
  },
};
const environment = {
  ROOM_ALLOWED_ORIGINS: [3191,3193,3194,3195,3000].flatMap(port => [`http://127.0.0.1:${port}`, `http://localhost:${port}`]).join(','),
  ROOM_RATE_LIMIT_SALT: crypto.randomBytes(32).toString('hex'),
};
const handle = createRoomHttpHandler({
  env: name => environment[name], store,
  async rateLimit(key, limit, seconds) {
    const slot = Math.floor(Date.now() / (seconds * 1000));
    const bucket = `${key}:${slot}`;
    const entry = buckets.get(bucket) ?? { hits: 0, expires: (slot + 1) * seconds * 1000 + 300000 };
    entry.hits += 1; buckets.set(bucket, entry); return entry.hits <= limit;
  },
});
const server = http.createServer(async (request, response) => {
  try {
    const headers = new Headers();
    for (const [name, value] of Object.entries(request.headers)) {
      if (Array.isArray(value)) value.forEach(item => headers.append(name, item));
      else if (value !== undefined) headers.set(name, value);
    }
    // Only this loopback listener is trusted here; do not accept spoofed forwarded IPs.
    headers.delete('x-forwarded-for');
    const options = { method: request.method, headers };
    if (!['GET', 'HEAD'].includes(request.method)) { options.body = request; options.duplex = 'half'; }
    const result = await handle(new Request('http://127.0.0.1:3192/', options), request.socket.remoteAddress ?? 'loopback');
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(Buffer.from(await result.arrayBuffer()));
  } catch {
    if (!response.headersSent) response.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(backend.roomError('SERVER_ERROR')));
  }
});
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) if (Date.parse(room.expiresAt) <= now) rooms.delete(code);
  for (const [key, bucket] of buckets) if (bucket.expires <= now) buckets.delete(key);
}, 60000);
cleanup.unref();
server.on('error', error => { console.error('Local room server could not start:', error.code ?? 'UNKNOWN'); process.exitCode = 1; });
server.listen(3192, '127.0.0.1', () => console.log('Local room test server: http://127.0.0.1:3192 — memory-only CAS; rooms disappear on restart.'));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { clearInterval(cleanup); server.close(() => process.exit(0)); });
