import { create } from 'zustand';

interface DragStore {
  isDraggingIcon: boolean;
  setDraggingIcon: (v: boolean) => void;
}

export const useDragStore = create<DragStore>()((set) => ({
  isDraggingIcon: false,
  setDraggingIcon: (v) => set({ isDraggingIcon: v }),
}));
