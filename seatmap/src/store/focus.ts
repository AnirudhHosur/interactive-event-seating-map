import { create } from "zustand";

type FocusState = {
    focusId: string | null;
    setFocus: (id: string | null) => void;
};

export const useFocus = create<FocusState>()((set) => ({
    focusId: null,
    setFocus: (id) => set({ focusId: id }),
}));
