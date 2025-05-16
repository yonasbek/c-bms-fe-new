// store/buildings.ts
import { create } from 'zustand';

export interface Modal {
  
  
  isOpen: boolean;
  name: string;
  forceOpen?: boolean;
}

interface ModalState {
  modal: Modal;
  setModal: (modal: Modal) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modal: {
    name: '',
    isOpen: false,
    forceOpen: false,
  },
  setModal: (modal) => set({ modal }),
  setIsOpen: (isOpen) => set((state) => {
    // Only allow closing if not forced open
    if (state.modal.forceOpen && !isOpen) {
      return state;
    }
    return { modal: { ...state.modal, isOpen } };
  }),
}));
