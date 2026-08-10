import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the caregiver JWT (if present) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ocuspeak_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function unwrapError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return new Error(message ?? error.message);
  }
  return error instanceof Error ? error : new Error('Đã có lỗi xảy ra');
}

// ---------- Auth (Caregiver) ----------

export type AuthResponse = {
  accessToken: string;
  caregiver: { id: string; fullName: string; email: string; role: string; avatar?: string | null };
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export async function register(fullName: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', { fullName, email, password });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

// ---------- Children ----------

export type ApiChildConfig = {
  id: string;
  gridSize: '2x2' | '3x3' | '4x4';
  dwellTimeMs: number;
  imageStyle: 'PHOTO' | 'ICON' | 'SYMBOL';
  responseType: 'EYE_GAZE' | 'DWELL_CLICK' | 'SWITCH' | 'TOUCH';
  voiceOutputEnabled: boolean;
  speechRate: number;
};

export type ApiChild = {
  id: string;
  fullName: string;
  birthday: string;
  gender: string;
  diagnosis?: string | null;
  language: string;
  config?: ApiChildConfig;
};

export async function getChildrenByCaregiver(caregiverId: string): Promise<ApiChild[]> {
  try {
    const { data } = await apiClient.get<ApiChild[]>('/children', { params: { caregiverId } });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export async function createChild(payload: {
  fullName: string;
  birthday: string;
  gender: string;
  caregiverId: string;
  diagnosis?: string;
}): Promise<ApiChild> {
  try {
    const { data } = await apiClient.post<ApiChild>('/children', payload);
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

// ---------- Devices (pairing) ----------

export type ApiDevice = {
  id: string;
  deviceName: string;
  pairingCode: string;
  pairingCodeExpiresAt: string;
  paired: boolean;
  online: boolean;
  child?: ApiChild;
};

export async function registerDevice(childId: string, deviceName: string): Promise<ApiDevice> {
  try {
    const { data } = await apiClient.post<ApiDevice>('/devices', { childId, deviceName });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export async function regenerateDeviceCode(deviceId: string): Promise<ApiDevice> {
  try {
    const { data } = await apiClient.post<ApiDevice>(`/devices/${deviceId}/regenerate-code`);
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

/** Called from the Patient Web device — no caregiver login required. */
export async function pairDevice(code: string): Promise<ApiDevice> {
  try {
    const { data } = await apiClient.post<ApiDevice>('/devices/pair', { code });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

// ---------- AAC items ----------

export type ApiAacItem = {
  id: string;
  label: string;
  category: string;
  imageUrl?: string | null;
  quickSentence: string;
  sortOrder: number;
};

export async function getAacItems(childId: string): Promise<ApiAacItem[]> {
  try {
    const { data } = await apiClient.get<ApiAacItem[]>('/aac', { params: { childId } });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

// ---------- Communication ----------

export type ApiCommunicationEvent = {
  id: string;
  itemIds: string[];
  sentence: string;
  status: string;
  unread: boolean;
  createdAt: string;
};

/** Called from Patient Web — no caregiver login required. */
export async function submitCommunicationEvent(
  childId: string,
  itemIds: string[],
  sentence: string,
): Promise<ApiCommunicationEvent> {
  try {
    const { data } = await apiClient.post<ApiCommunicationEvent>('/communication/events', {
      childId,
      itemIds,
      sentence,
    });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export async function getCommunicationEvents(childId: string): Promise<ApiCommunicationEvent[]> {
  try {
    const { data } = await apiClient.get<ApiCommunicationEvent[]>('/communication/events', {
      params: { childId },
    });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export async function respondToCommunicationEvent(eventId: string, content: string) {
  try {
    const { data } = await apiClient.post(`/communication/events/${eventId}/responses`, { content });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

// ---------- Monitoring ----------

export type ApiMonitoringType =
  | 'DEVICE_ONLINE'
  | 'DEVICE_OFFLINE'
  | 'CALIBRATION'
  | 'BATTERY_LOW'
  | 'INACTIVITY'
  | 'HEARTBEAT';

/** Called from Patient Web / Eye Tracking Engine bridge — no caregiver login required. */
export async function createMonitoringRecord(
  childId: string,
  type: ApiMonitoringType,
  metadata?: Record<string, unknown>,
) {
  try {
    const { data } = await apiClient.post('/monitoring/records', { childId, type, metadata });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

// ---------- SOS ----------

/** Called from Patient Web — no caregiver login required. */
export async function triggerSos(childId: string, note?: string) {
  try {
    const { data } = await apiClient.post('/sos/alerts', { childId, note });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export async function getSosAlerts(childId: string) {
  try {
    const { data } = await apiClient.get('/sos/alerts', { params: { childId } });
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}
