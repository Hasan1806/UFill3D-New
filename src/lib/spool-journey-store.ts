import { create } from 'zustand';
import { SpoolCanvasHandle } from '@/components/3d/FilamentSpoolCanvas';

interface SpoolJourneyStore {
  color: string;
  finish: 'Matte' | 'Silk' | 'Gloss' | 'Translucent';
  rimColor: string;
  spoolHandle: SpoolCanvasHandle | null;
  setSpoolHandle: (handle: SpoolCanvasHandle | null) => void;
  setColor: (
    color: string,
    finish?: 'Matte' | 'Silk' | 'Gloss' | 'Translucent',
    rimColor?: string
  ) => void;
  triggerEntrance: () => void;
}

export const useSpoolJourneyStore = create<SpoolJourneyStore>((set, get) => ({
  color: '#5401C5',
  finish: 'Silk',
  rimColor: '#5401C5',
  spoolHandle: null,

  setSpoolHandle: (handle) => {
    set({ spoolHandle: handle });
  },

  setColor: (color, finish = 'Silk', rimColor) => {
    const finalRim = rimColor || color;
    set({ color, finish, rimColor: finalRim });
    const handle = get().spoolHandle;
    if (handle) {
      handle.triggerColorSwitch(color, finish, finalRim);
    }
  },

  triggerEntrance: () => {
    const handle = get().spoolHandle;
    if (handle) {
      handle.triggerEntrance();
    }
  },
}));
