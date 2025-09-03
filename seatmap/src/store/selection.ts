import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FlatSeat } from "@/lib/types";
import { priceForTier } from "@/lib/price";

type SelectionState = {
    selectedIds: string[];
    toggle: (seat: FlatSeat) => void;
    clear: () => void;
    subtotal: (seatsById: Map<string, FlatSeat>) => number;
    isSelected: (id: string) => boolean;
    canSelectMore: () => boolean;
    limit: number;
};

export const useSelection = create<SelectionState>()(
    persist(
        (set, get) => ({
            selectedIds: [],
            limit: 8,
            toggle: (seat) =>
                set((state) => {
                    const exists = state.selectedIds.includes(seat.id);
                    if (exists) {
                        return { selectedIds: state.selectedIds.filter((s) => s !== seat.id) };
                    }
                    if (seat.status !== "available") return state;
                    if (state.selectedIds.length >= state.limit) return state;
                    return { selectedIds: [...state.selectedIds, seat.id] };
                }),
            clear: () => set({ selectedIds: [] }),
            subtotal: (seatsById) =>
                get().selectedIds.reduce((sum, id) => {
                    const s = seatsById.get(id);
                    return s ? sum + priceForTier(s.priceTier) : sum;
                }, 0),
            isSelected: (id) => get().selectedIds.includes(id),
            canSelectMore: () => get().selectedIds.length < get().limit,
        }),
        { name: "selection_v1" }
    )
);
