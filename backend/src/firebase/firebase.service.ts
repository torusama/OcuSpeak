import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

/**
 * Thin wrapper around firebase-admin (Auth, Firestore, Storage, Cloud
 * Messaging). When no service-account credentials are configured (e.g. in
 * local/dev before a real Firebase project exists) the service falls back to
 * a "mock mode": every call is logged and resolves with a fake result instead
 * of throwing, so the rest of the backend can be developed and tested without
 * a live Firebase project. Once real FIREBASE_* env vars are provided the
 * exact same service starts talking to the real project — no code changes
 * needed elsewhere.
 */
@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger('FirebaseService');
  private app: App | null = null;
  private mockMode = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('firebase.projectId');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const privateKey = this.configService.get<string>('firebase.privateKey');

    if (!projectId || !clientEmail || !privateKey) {
      this.mockMode = true;
      this.logger.warn(
        'Firebase credentials not found (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY). ' +
          'Running in MOCK mode: Auth/FCM/Storage calls will be logged, not sent.',
      );
      return;
    }

    try {
      this.app = getApps().length
        ? getApps()[0]
        : initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
            storageBucket: `${projectId}.appspot.com`,
          });
      this.logger.log(`Firebase Admin initialized for project "${projectId}"`);
    } catch (error) {
      this.mockMode = true;
      this.logger.error('Failed to initialize Firebase Admin, falling back to MOCK mode', error as Error);
    }
  }

  isMockMode() {
    return this.mockMode;
  }

  /** Verify a Firebase Auth ID token (used if the client also authenticates via Firebase Auth). */
  async verifyIdToken(idToken: string) {
    if (this.mockMode || !this.app) {
      this.logger.debug(`[mock] verifyIdToken(${idToken.slice(0, 12)}...)`);
      return { uid: 'mock-uid', email: 'mock@ocuspeak.dev' };
    }
    return getAuth(this.app).verifyIdToken(idToken);
  }

  /** Send a push notification via Firebase Cloud Messaging. */
  async sendPushNotification(
    token: string,
    notification: { title: string; body: string },
    data: Record<string, string> = {},
  ) {
    if (this.mockMode || !this.app || !token) {
      this.logger.debug(`[mock] FCM -> ${token || 'no-token'}: ${notification.title}`);
      return { mock: true, messageId: `mock-${Date.now()}` };
    }
    const messageId = await getMessaging(this.app).send({ token, notification, data });
    return { mock: false, messageId };
  }

  /** Access Firestore (returns null in mock mode). */
  firestore(): Firestore | null {
    if (this.mockMode || !this.app) {
      this.logger.debug('[mock] firestore() called without live credentials');
      return null;
    }
    return getFirestore(this.app);
  }

  /** Access Cloud Storage bucket (returns null in mock mode). */
  storageBucket() {
    if (this.mockMode || !this.app) {
      this.logger.debug('[mock] storageBucket() called without live credentials');
      return null;
    }
    return getStorage(this.app).bucket();
  }
}
