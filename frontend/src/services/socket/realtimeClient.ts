import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000';

let socket: Socket | null = null;

/** Lazily create (or reuse) the single realtime socket connection. */
function getSocket(): Socket {
  if (!socket) {
    socket = io(`${SOCKET_URL}/realtime`, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
}

/** Join the room for a given child so this tab receives its live events. */
export function joinChildRoom(childId: string, role: 'PATIENT' | 'CAREGIVER') {
  const s = getSocket();
  if (s.connected) {
    s.emit('join:child', { childId, role });
  } else {
    s.once('connect', () => s.emit('join:child', { childId, role }));
  }
  return s;
}

export function leaveChildRoom(childId: string) {
  getSocket().emit('leave:child', { childId });
}

export function onCommunicationNew(handler: (event: unknown) => void) {
  getSocket().on('communication:new', handler);
  return () => { getSocket().off("communication:new", handler); };
}

export function onCommunicationResponse(handler: (response: unknown) => void) {
  getSocket().on('communication:response', handler);
  return () => { getSocket().off("communication:response", handler); };
}

export function onSosAlert(handler: (alert: unknown) => void) {
  getSocket().on('sos:alert', handler);
  return () => { getSocket().off("sos:alert", handler); };
}

export function onSosUpdate(handler: (alert: unknown) => void) {
  getSocket().on('sos:update', handler);
  return () => { getSocket().off("sos:update", handler); };
}

export function onDeviceStatus(handler: (device: unknown) => void) {
  getSocket().on('device:status', handler);
  return () => { getSocket().off("device:status", handler); };
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
