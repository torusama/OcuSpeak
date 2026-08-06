import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AacItem, CommunicationStatus } from '@/types';

export type ChildProfileSummary = {
  id: string;
  displayName: string;
  age: number;
  avatarInitials: string;
  gridSize: 4 | 6 | 9;
  dwellTime: 1 | 1.5 | 2 | 3;
  calibrationMode: 5 | 9;
  ttsEnabled: boolean;
  realImageMode: boolean;
};

const demoChild: ChildProfileSummary = {
  id: 'patient-an',
  displayName: 'Bé An',
  age: 11,
  avatarInitials: 'AN',
  gridSize: 4,
  dwellTime: 1.5,
  calibrationMode: 5,
  ttsEnabled: true,
  realImageMode: false
};

export type AppStore = {
  // ---- Caregiver (OcuSpeak Care) auth — backed by the real backend ----
  caregiverLoggedIn: boolean;
  caregiverName: string;
  /** Real backend caregiver UUID, set after a successful /auth/login or /auth/register call. */
  caregiverId: string | null;
  /** JWT returned by the backend; also mirrored to localStorage for the axios interceptor. */
  authToken: string | null;

  childProfiles: ChildProfileSummary[];
  activeChildId: string | null;
  selectedItems: AacItem[];
  pageByCategory: Record<string, number>;
  lastRequestId: string | null;
  requestStatus: CommunicationStatus;

  // ---- Patient Web (child's device) session ----
  patientLoggedIn: boolean;
  patientName: string;
  patientPaired: boolean;
  /** Real backend child UUID this device is paired to. */
  patientChildId: string | null;
  /** Real backend device UUID assigned during pairing. */
  patientDeviceId: string | null;

  setCaregiverLoggedIn: (value: boolean) => void;
  setCaregiverName: (value: string) => void;
  setCaregiverAuth: (auth: { caregiverId: string; authToken: string; caregiverName: string }) => void;
  clearCaregiverAuth: () => void;

  addChildProfile: (profile: ChildProfileSummary) => void;
  updateChildProfile: (id: string, profile: Partial<ChildProfileSummary>) => void;
  setActiveChildId: (id: string | null) => void;
  addSelectedItem: (item: AacItem) => void;
  removeLastSelectedItem: () => void;
  clearSelectedItems: () => void;
  setCategoryPage: (categoryId: string, page: number) => void;
  setLastRequest: (id: string, status: CommunicationStatus) => void;
  setRequestStatus: (status: CommunicationStatus) => void;

  setPatientLoggedIn: (value: boolean) => void;
  setPatientName: (value: string) => void;
  setPatientPaired: (value: boolean) => void;
  setPatientDevice: (childId: string, deviceId: string) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      caregiverLoggedIn: false,
      caregiverName: 'Võ Tấn An',
      caregiverId: null,
      authToken: null,

      childProfiles: [demoChild],
      activeChildId: demoChild.id,
      selectedItems: [],
      pageByCategory: {},
      lastRequestId: null,
      requestStatus: 'SENT',

      patientLoggedIn: false,
      patientName: 'Bé An',
      patientPaired: false,
      patientChildId: null,
      patientDeviceId: null,

      setCaregiverLoggedIn: (value) => set({ caregiverLoggedIn: value }),
      setCaregiverName: (value) => set({ caregiverName: value }),
      setCaregiverAuth: ({ caregiverId, authToken, caregiverName }) => {
        localStorage.setItem('ocuspeak_token', authToken);
        set({ caregiverId, authToken, caregiverName, caregiverLoggedIn: true });
      },
      clearCaregiverAuth: () => {
        localStorage.removeItem('ocuspeak_token');
        set({ caregiverId: null, authToken: null, caregiverLoggedIn: false });
      },

      addChildProfile: (profile) =>
        set((state) => ({
          childProfiles: [...state.childProfiles, profile],
          activeChildId: profile.id
        })),
      updateChildProfile: (id, profile) =>
        set((state) => ({
          childProfiles: state.childProfiles.map((item) => (item.id === id ? { ...item, ...profile } : item))
        })),
      setActiveChildId: (id) => set({ activeChildId: id }),
      addSelectedItem: (item) =>
        set((state) => ({
          selectedItems: [...state.selectedItems, item].slice(-8)
        })),
      removeLastSelectedItem: () =>
        set((state) => ({ selectedItems: state.selectedItems.slice(0, -1) })),
      clearSelectedItems: () => set({ selectedItems: [] }),
      setCategoryPage: (categoryId, page) =>
        set((state) => ({ pageByCategory: { ...state.pageByCategory, [categoryId]: page } })),
      setLastRequest: (id, status) => set({ lastRequestId: id, requestStatus: status }),
      setRequestStatus: (status) => set({ requestStatus: status }),

      setPatientLoggedIn: (value) => set({ patientLoggedIn: value }),
      setPatientName: (value) => set({ patientName: value }),
      setPatientPaired: (value) => set({ patientPaired: value }),
      setPatientDevice: (childId, deviceId) =>
        set({ patientChildId: childId, patientDeviceId: deviceId, patientPaired: true })
    }),
    {
      name: 'ocuspeak-ui-state',
      version: 12,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<AppStore>;
        return {
          ...state,
          childProfiles: state.childProfiles?.length ? state.childProfiles : [demoChild],
          activeChildId: state.activeChildId ?? demoChild.id,
          patientLoggedIn: state.patientLoggedIn ?? false,
          patientName: state.patientName ?? demoChild.displayName,
          patientPaired: state.patientPaired ?? false,
          patientChildId: state.patientChildId ?? null,
          patientDeviceId: state.patientDeviceId ?? null,
          caregiverId: state.caregiverId ?? null,
          authToken: state.authToken ?? null
        } as AppStore;
      },
      partialize: (state) => ({
        caregiverLoggedIn: state.caregiverLoggedIn,
        caregiverName: state.caregiverName,
        caregiverId: state.caregiverId,
        authToken: state.authToken,
        childProfiles: state.childProfiles,
        activeChildId: state.activeChildId,
        selectedItems: state.selectedItems,
        pageByCategory: state.pageByCategory,
        lastRequestId: state.lastRequestId,
        requestStatus: state.requestStatus,
        patientLoggedIn: state.patientLoggedIn,
        patientName: state.patientName,
        patientPaired: state.patientPaired,
        patientChildId: state.patientChildId,
        patientDeviceId: state.patientDeviceId
      })
    }
  )
);
