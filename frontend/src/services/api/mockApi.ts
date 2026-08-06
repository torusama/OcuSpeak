import { aacItems, communications, patientProfile } from '@/data/mockData';
import type { CommunicationEvent } from '@/types';
import { createEventId } from '@/utils/id';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function verifyPairCode(code: string) {
  await wait(650);
  if (code.trim().toUpperCase() === 'EXPIRED') {
    throw new Error('PAIR_CODE_EXPIRED');
  }
  if (code.trim().length !== 6) {
    throw new Error('PAIR_CODE_INVALID');
  }
  return patientProfile;
}

export async function generateSentence(itemIds: string[]) {
  await wait(900);
  const items = itemIds.map((id) => aacItems.find((item) => item.id === id)).filter(Boolean);
  if (!items.length) throw new Error('NO_ITEMS');

  const sentence = items.length === 1
    ? items[0]!.quickSentence
    : `${items.map((item) => item!.label).join(', ')}. ${items[items.length - 1]!.quickSentence}`;

  return {
    sentence,
    intent: items[0]!.categoryId,
    tone: 'clear',
    fallback: false
  };
}

export async function submitCommunication(itemIds: string[], sentence: string): Promise<CommunicationEvent> {
  await wait(650);
  const event: CommunicationEvent = {
    id: createEventId('comm'),
    patientId: patientProfile.id,
    itemIds,
    sentence,
    category: 'AAC',
    createdAt: 'Vừa xong',
    updatedAt: 'Vừa xong',
    status: navigator.onLine ? 'SENT' : 'QUEUED_LOCAL',
    unread: true
  };
  communications.unshift(event);
  return event;
}

export async function fakeLogin(email: string, password: string) {
  await wait(700);
  if (!email.includes('@') || password.length < 6) throw new Error('INVALID_CREDENTIAL');
  return { userId: 'caregiver-demo', displayName: 'Võ Tấn An', email };
}
