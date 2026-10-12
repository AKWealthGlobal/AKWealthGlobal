import { actCity, answerCity, canAct, finishQuiz, moveCity, nextCity, startCity } from './urban-game';
import type { AgeMode } from './urban-quiz';
import type { UrbanState } from './urban-game';
import { ROOM_TTL_MS, type PublicRoom, type RoomErrorCode, type RoomRequest, type RoomResponse, type RoomStatus } from './room-protocol';

export type RoomRecord = {
  roomCode: string; version: number; mode: AgeMode; capacity: number; status: RoomStatus;
  createdAt: string; expiresAt: string; hostHash: string; createRequestId: string;
  members: { seat: number; tokenHash: string }[]; game: UrbanState | null;
  receipts: { actorHash: string; requestId: string }[];
};
export interface RoomStore {
  get(code: string): Promise<RoomRecord | null>;
  findCreated(actorHash: string, requestId: string): Promise<RoomRecord | null>;
  create(room: RoomRecord): Promise<boolean>;
  compareAndSwap(code: string, expectedVersion: number, next: RoomRecord): Promise<boolean>;
}
export type RoomDependencies = {
  store: RoomStore; now?: () => number; randomInt?: (exclusiveMax: number) => number;
  hashToken?: (token: string) => Promise<string>;
};
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const mutations = new Set(['create', 'join', 'start', 'roll', 'act', 'answer', 'finishQuiz', 'next', 'reset', 'close']);
const messages: Record<RoomErrorCode, string> = {
  INVALID_REQUEST: '請求格式不正確，請重新操作。', UNAUTHORIZED: '此裝置沒有這個房間的角色憑證。',
  NOT_FOUND: '找不到這個房間，請確認房號。', EXPIRED: '房間已到期，請建立新房間。',
  ROOM_CLOSED: '房主已關閉房間，請建立新房間。', ROOM_FULL: '房間已滿。', SEAT_TAKEN: '這個角色已被選走，請選其他角色。',
  NOT_HOST: '這個操作需要由房主執行。', NOT_YOUR_TURN: '現在輪到另一位家人。', NOT_READY: '所有角色到齊後，房主才能開始。',
  INVALID_PHASE: '遊戲進度已改變，請依目前畫面操作。', INVALID_ACTION: '這個選擇目前無法執行。',
  VERSION_CONFLICT: '另一個操作已更新房間，已取得最新進度，請再確認選擇。',
  RATE_LIMITED: '操作稍快，請稍候再試。', LIMIT_REACHED: '此房間操作次數已達上限，請另開新房間。', SERVER_ERROR: '房間暫時無法連線，請稍後重試。',
};
class RoomFault extends Error { constructor(readonly code: RoomErrorCode, readonly room?: PublicRoom) { super(messages[code]); } }
const fail = (code: RoomErrorCode, room?: PublicRoom): never => { throw new RoomFault(code, room); };
export function roomError(code: RoomErrorCode): RoomResponse { return { ok: false, error: { code, message: messages[code] } }; }
export function roomHttpStatus(response: RoomResponse): number {
  if (response.ok) return 200;
  const code = response.error.code;
  if (code === 'UNAUTHORIZED' || code === 'NOT_HOST' || code === 'NOT_YOUR_TURN') return 403;
  if (code === 'NOT_FOUND') return 404;
  if (code === 'EXPIRED' || code === 'ROOM_CLOSED') return 410;
  if (code === 'RATE_LIMITED') return 429;
  if (code === 'SERVER_ERROR') return 503;
  if (code === 'INVALID_REQUEST') return 400;
  return 409;
}
export async function sha256(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
export function secureRandomInt(max: number): number {
  if (!Number.isSafeInteger(max) || max < 1 || max > 0x100000000) throw new Error('Invalid random range');
  const ceiling = Math.floor(0x100000000 / max) * max;
  const bytes = new Uint32Array(1);
  do { crypto.getRandomValues(bytes); } while (bytes[0] >= ceiling);
  return bytes[0] % max;
}
function validate(raw: unknown): RoomRequest {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fail('INVALID_REQUEST');
  const r = raw as Record<string, unknown>;
  if (typeof r.op !== 'string' || (!mutations.has(r.op) && r.op !== 'read' && r.op !== 'preview')) return fail('INVALID_REQUEST');
  if (r.op !== 'create' && (typeof r.roomCode !== 'string' || r.roomCode.length !== 12 || !Array.from(r.roomCode).every(c => alphabet.includes(c)))) return fail('INVALID_REQUEST');
  if (r.op !== 'preview' && (typeof r.token !== 'string' || !/^[a-f0-9]{32}$/.test(r.token))) return fail('INVALID_REQUEST');
  if (mutations.has(r.op) && (typeof r.requestId !== 'string' || !/^[A-Za-z0-9_-]{16,80}$/.test(r.requestId))) return fail('INVALID_REQUEST');
  if (r.op === 'create') {
    if (!['little', 'junior', 'advanced'].includes(String(r.mode)) || typeof r.mode !== 'string' ||
      !Number.isInteger(r.capacity) || Number(r.capacity) < 2 || Number(r.capacity) > 4 ||
      !Number.isInteger(r.seat) || Number(r.seat) < 0 || Number(r.seat) >= Number(r.capacity) || r.expectedVersion !== 0) return fail('INVALID_REQUEST');
  } else if (r.op === 'join') {
    if (r.expectedVersion !== null || !Number.isInteger(r.seat) || Number(r.seat) < 0 || Number(r.seat) > 3) return fail('INVALID_REQUEST');
  } else if (mutations.has(r.op) && (!Number.isSafeInteger(r.expectedVersion) || Number(r.expectedVersion) < 1)) return fail('INVALID_REQUEST');
  if ((r.op === 'act' || r.op === 'answer') && (!Number.isInteger(r.index) || Number(r.index) < 0 || Number(r.index) > 100)) return fail('INVALID_REQUEST');
  if ((r.op === 'reset' || r.op === 'close') && r.confirm !== true) return fail('INVALID_REQUEST');
  return r as RoomRequest;
}
export function publicRoom(room: RoomRecord, actorHash: string): PublicRoom {
  const member = room.members.find(m => m.tokenHash === actorHash);
  if (!member) return fail('UNAUTHORIZED');
  const game = room.game ? structuredClone(room.game) : null;
  // The server checks answers; do not disclose the answer key before discussion succeeds.
  if (game?.phase === 'quiz' && game.quiz) game.quiz = { ...game.quiz, answer: -1, why: '' };
  return { roomCode: room.roomCode, version: room.version, mode: room.mode, capacity: room.capacity,
    status: room.status, expiresAt: room.expiresAt, mySeat: member.seat, isHost: room.hostHash === actorHash,
    members: room.members.map(m => ({ seat: m.seat })).sort((a, b) => a.seat - b.seat), game };
}
/** Authoritative service: the store must commit payload + version atomically with CAS. */
export function createRoomService({ store, now = Date.now, randomInt = secureRandomInt, hashToken = sha256 }: RoomDependencies) {
  const alive = (room: RoomRecord) => { if (Date.parse(room.expiresAt) <= now()) fail('EXPIRED'); };
  const read = async (code: string) => { const room = await store.get(code); if (!room) return fail('NOT_FOUND'); alive(room); return room; };
  const replayed = (room: RoomRecord, actor: string, id: string) => room.receipts.some(r => r.actorHash === actor && r.requestId === id);
  const response = (room: RoomRecord, actor: string, replay = false): RoomResponse => ({ ok: true, room: publicRoom(room, actor), ...(replay ? { replayed: true as const } : {}) });
  const append = (room: RoomRecord, actor: string, id: string) => {
    if (room.receipts.length >= 2048) return fail('LIMIT_REACHED');
    return { ...room, version: room.version + 1, receipts: [...room.receipts, { actorHash: actor, requestId: id }] };
  };
  return { async handle(raw: unknown): Promise<RoomResponse> {
    try {
      const request = validate(raw);
      if (request.op === 'preview') {
        const room = await read(request.roomCode);
        return { ok: true, preview: { roomCode: room.roomCode, status: room.status, mode: room.mode,
          capacity: room.capacity, expiresAt: room.expiresAt,
          freeSeats: room.status === 'lobby' ? Array.from({ length: room.capacity }, (_, i) => i).filter(i => !room.members.some(m => m.seat === i)) : [] } };
      }
      const actor = await hashToken(request.token);
      if (request.op === 'create') {
        const previous = await store.findCreated(actor, request.requestId);
        if (previous) { alive(previous); return response(previous, actor, true); }
        // A secret, client-generated 128-bit token makes this deterministic retry key unpredictable.
        const digest = await sha256(`ak-city-room:${actor}:${request.requestId}`);
        let bits = BigInt('0x' + digest.slice(0, 15)), roomCode = '';
        for (let i = 0; i < 12; i++) { roomCode += alphabet[Number(bits & BigInt(31))]; bits >>= BigInt(5); }
        const record: RoomRecord = { roomCode, version: 1, mode: request.mode, capacity: request.capacity,
          status: 'lobby', createdAt: new Date(now()).toISOString(), expiresAt: new Date(now() + ROOM_TTL_MS).toISOString(),
          hostHash: actor, createRequestId: request.requestId, members: [{ seat: request.seat, tokenHash: actor }], game: null,
          receipts: [{ actorHash: actor, requestId: request.requestId }] };
        if (await store.create(record)) return response(record, actor);
        const raced = await store.findCreated(actor, request.requestId);
        if (raced) { alive(raced); return response(raced, actor, true); }
        return fail('SERVER_ERROR');
      }
      let room = await read(request.roomCode);
      if (request.op === 'join') {
        for (let attempt = 0; attempt < 4; attempt++) {
          // Reconnection never changes a token's original seat, even when another seat is requested.
          if (room.members.some(m => m.tokenHash === actor)) return response(room, actor, true);
          if (room.status === 'closed') return fail('ROOM_CLOSED');
          if (room.status !== 'lobby') return fail('INVALID_PHASE');
          if (request.seat >= room.capacity) return fail('INVALID_REQUEST');
          if (room.members.length >= room.capacity) return fail('ROOM_FULL');
          if (room.members.some(m => m.seat === request.seat)) return fail('SEAT_TAKEN');
          const next = append({ ...room, members: [...room.members, { seat: request.seat, tokenHash: actor }] }, actor, request.requestId);
          if (await store.compareAndSwap(room.roomCode, room.version, next)) return response(next, actor);
          room = await read(request.roomCode);
        }
        return fail('VERSION_CONFLICT');
      }
      const member = room.members.find(m => m.tokenHash === actor);
      if (!member) return fail('UNAUTHORIZED');
      if (request.op === 'read') return response(room, actor);
      if (replayed(room, actor, request.requestId)) return response(room, actor, true);
      if (request.expectedVersion !== room.version) return fail('VERSION_CONFLICT', publicRoom(room, actor));
      if (room.status === 'closed') return fail('ROOM_CLOSED');
      let next = { ...room };
      if (request.op === 'start' || request.op === 'reset' || request.op === 'close') {
        if (room.hostHash !== actor) return fail('NOT_HOST');
        if (request.op === 'start') {
          if (room.status !== 'lobby') return fail('INVALID_PHASE');
          if (room.members.length !== room.capacity || Array.from({ length: room.capacity }, (_, i) => i).some(i => !room.members.some(m => m.seat === i))) return fail('NOT_READY');
          next = { ...room, status: 'playing', game: startCity(room.mode, room.capacity) };
        } else if (request.op === 'reset') next = { ...room, status: 'lobby', game: null };
        else next = { ...room, status: 'closed' };
      } else {
        if (room.status !== 'playing' || !room.game) return fail('INVALID_PHASE');
        const game = room.game;
        if (member.seat !== game.turn) return fail('NOT_YOUR_TURN');
        let changed: UrbanState = game;
        switch (request.op) {
          case 'roll': if (game.phase !== 'roll') return fail('INVALID_PHASE'); changed = moveCity(game, randomInt(6) + 1); break;
          case 'act': {
            if (game.phase !== 'choose') return fail('INVALID_PHASE');
            const choice = game.choices[request.index];
            if (!choice || !canAct(game, choice)) return fail('INVALID_ACTION');
            changed = actCity(game, request.index, choice.action === 'risk' && randomInt(2) === 0); break;
          }
          case 'answer': if (game.phase !== 'quiz') return fail('INVALID_PHASE');
            if (!game.quiz || request.index >= game.quiz.options.length) return fail('INVALID_ACTION');
            changed = answerCity(game, request.index); break;
          case 'finishQuiz': if (game.phase !== 'feedback') return fail('INVALID_PHASE'); changed = finishQuiz(game); break;
          case 'next': if (game.phase !== 'next') return fail('INVALID_PHASE'); changed = nextCity(game); break;
        }
        if (changed === game) return fail('INVALID_ACTION');
        next = { ...room, game: changed };
      }
      next = append(next, actor, request.requestId);
      if (await store.compareAndSwap(room.roomCode, room.version, next)) return response(next, actor);
      room = await read(request.roomCode);
      if (replayed(room, actor, request.requestId)) return response(room, actor, true);
      return fail('VERSION_CONFLICT', publicRoom(room, actor));
    } catch (error) {
      if (error instanceof RoomFault) return { ok: false, error: { code: error.code, message: error.message }, ...(error.room ? { room: error.room } : {}) };
      return roomError('SERVER_ERROR');
    }
  } };
}
