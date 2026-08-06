import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('OcuSpeak'),
  VITE_USE_MOCKS: z.enum(['true', 'false']).default('true'),
  VITE_API_BASE_URL: z.string().url().default('http://localhost:8080'),
  VITE_FIREBASE_API_KEY: z.string().optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().optional(),
  VITE_FIREBASE_VAPID_KEY: z.string().optional()
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.warn('OcuSpeak environment configuration is incomplete. Mock mode remains available.');
}

export const env = parsed.success
  ? parsed.data
  : {
      VITE_APP_NAME: 'OcuSpeak',
      VITE_USE_MOCKS: 'true' as const,
      VITE_API_BASE_URL: 'http://localhost:8080'
    };

export const useMocks = env.VITE_USE_MOCKS !== 'false';
