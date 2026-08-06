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
  caregiverLoggedIn: boolean;
  caregiverName: string;
  childProfiles: ChildProfileSummary[];
  activeChildId: string | null;
  selectedItems: AacItem[];
  pageByCategory: Record<string, number>;
  lastRequestId: string | null;
  requestStatus: CommunicationStatus;
  setCaregiverLoggedIn: (value: boolean) => void;
  setCaregiverName: (value: string) => void;
  addChildProfile: (profile: ChildProfileSummary) => void;
  updateChildProfile: (id: string, profile: Partial<ChildProfileSummary>) => void;
  setActiveChildId: (id: string | null) => void;
  addSelectedItem: (item: AacItem) => void;
  removeLastSelectedItem: () => void;
  clearSelectedItems: () => void;
  setCategoryPage: (categoryId: string, page: number) => void;
  setLastRequest: (id: string, status: CommunicationStatus) => void;
  setRequestStatus: (status: CommunicationStatus) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      caregiverLoggedIn: false,
      caregiverName: 'Võ Tấn An',
      childProfiles: [demoChild],
      activeChildId: demoChild.id,
      selectedItems: [],
      pageByCategory: {},
      lastRequestId: null,
      requestStatus: 'SENT',
      setCaregiverLoggedIn: (value) => set({ caregiverLoggedIn: value }),
      setCaregiverName: (value) => set({ caregiverName: value }),
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
      setRequestStatus: (status) => set({ requestStatus: status })
    }),
    {
      name: 'ocuspeak-ui-state',
      version: 11,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<AppStore>;
        return {
          ...state,
          childProfiles: state.childProfiles?.length ? state.childProfiles : [demoChild],
          activeChildId: state.activeChildId ?? demoChild.id
        } as AppStore;
      },
      partialize: (state) => ({
        caregiverLoggedIn: state.caregiverLoggedIn,
        caregiverName: state.caregiverName,
        childProfiles: state.childProfiles,
        activeChildId: state.activeChildId,
        selectedItems: state.selectedItems,
        pageByCategory: state.pageByCategory,
        lastRequestId: state.lastRequestId,
        requestStatus: state.requestStatus
      })
    }
  )
);
