import type { UrbanState } from './urban-game';
import type { AgeMode } from './urban-quiz';

export type RoomStatus = 'lobby' | 'playing' | 'closed';
export type PublicRoom = {
  roomCode: string; version: number; mode: AgeMode; capacity: number;
  status: RoomStatus; expiresAt: string; mySeat: number; isHost: boolean;
  members: { seat: number }[]; game: UrbanState | null;
};
export type RoomPreview = Pick<PublicRoom, 'roomCode' | 'status' | 'mode' | 'capacity' | 'expiresAt'> & { freeSeats: number[] };
export type RoomMutation = { token: string; roomCode: string; expectedVersion: number; requestId: string };
/** Generate token with crypto.getRandomValues(new Uint8Array(16)), encoded as 32 lowercase hex characters.
 * Keep it in localStorage for refresh recovery; never put it in a URL or analytics event. */
export type RoomRequest =
  | { op: 'preview'; roomCode: string }
  | { op: 'create'; token: string; requestId: string; expectedVersion: 0; mode: AgeMode; capacity: number; seat: number }
  | { op: 'join'; token: string; roomCode: string; requestId: string; expectedVersion: null; seat: number }
  | { op: 'read'; token: string; roomCode: string }
  | (RoomMutation & { op: 'start' | 'roll' | 'finishQuiz' | 'next' })
  | (RoomMutation & { op: 'act' | 'answer'; index: number })
  | (RoomMutation & { op: 'reset' | 'close'; confirm: true });
export type RoomErrorCode = 'INVALID_REQUEST' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'EXPIRED' | 'ROOM_CLOSED' | 'ROOM_FULL' | 'SEAT_TAKEN' | 'NOT_HOST' | 'NOT_YOUR_TURN' | 'NOT_READY' | 'INVALID_PHASE' | 'INVALID_ACTION' | 'VERSION_CONFLICT' | 'RATE_LIMITED' | 'LIMIT_REACHED' | 'SERVER_ERROR';
export type RoomResponse =
  | { ok: true; room: PublicRoom; replayed?: true }
  | { ok: true; preview: RoomPreview }
  | { ok: false; error: { code: RoomErrorCode; message: string }; room?: PublicRoom };
export const ROOM_POLL_MS = 1800;
export const ROOM_TTL_MS = 6 * 60 * 60 * 1000;
