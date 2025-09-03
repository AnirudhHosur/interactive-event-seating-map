"use client";

import * as React from "react";
import { useSelection } from "@/store/selection";
import { useFocus } from "@/store/focus";
import type { FlatSeat } from "@/lib/types";
import { priceForTier } from "@/lib/price";
import { getHeatMapColor, getHeatMapColorWithOpacity } from "@/lib/heatMap";

const STATUS_FILL: Record<string, string> = {
    available: "#4caf50",
    reserved: "#ffb300",
    held: "#ab47bc",
    sold: "#e53935",
};

const RADIUS = 8;

type Props = {
    seat: FlatSeat;
    neighbors: {
        left: string | null;
        right: string | null;
        up: string | null;
        down: string | null;
    };
    refMap: React.MutableRefObject<Map<string, SVGCircleElement | null>>;
    roving: boolean; // true if this seat currently has roving tabIndex=0
    heatMapEnabled?: boolean; // Enable heat-map coloring by price tier
};

export default function Seat({ seat, neighbors, refMap, roving, heatMapEnabled = false }: Props) {
    const toggle = useSelection((s) => s.toggle);
    const isSelected = useSelection((s) => s.isSelected);
    const canSelectMore = useSelection((s) => s.canSelectMore);
    const { focusId, setFocus } = useFocus();

    const selected = isSelected(seat.id);
    const disabled = seat.status !== "available";
    const isFocused = focusId === seat.id;

    const handleToggle = () => {
        if (!disabled && (selected || canSelectMore())) {
            toggle(seat);
        }
    };

    const onKeyDown: React.KeyboardEventHandler<SVGCircleElement> = (e) => {
        switch (e.key) {
            case "Enter":
            case " ":
                e.preventDefault();
                handleToggle();
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (neighbors.left) setFocus(neighbors.left);
                break;
            case "ArrowRight":
                e.preventDefault();
                if (neighbors.right) setFocus(neighbors.right);
                break;
            case "ArrowUp":
                e.preventDefault();
                if (neighbors.up) setFocus(neighbors.up);
                break;
            case "ArrowDown":
                e.preventDefault();
                if (neighbors.down) setFocus(neighbors.down);
                break;
        }
    };

    const refCb = React.useCallback((el: SVGCircleElement | null) => {
        refMap.current.set(seat.id, el);
    }, [seat.id, refMap]);

    // When focusId changes to this seat, move DOM focus (roving tabindex)
    React.useEffect(() => {
        if (isFocused) {
            const el = refMap.current.get(seat.id);
            el?.focus();
        }
    }, [isFocused, seat.id, refMap]);

    const aria = `Section ${seat.sectionLabel}, Row ${seat.rowIndex}, Seat ${seat.col}, Price ${priceForTier(seat.priceTier)}, Status ${seat.status}`;

    const fill = selected 
        ? "#1976d2" 
        : heatMapEnabled 
            ? getHeatMapColorWithOpacity(seat.priceTier, 0.7)
            : STATUS_FILL[seat.status] ?? "#90a4ae";
    const stroke = isFocused ? "#1976d2" : selected ? "#0d47a1" : "white";
    const strokeWidth = isFocused || selected ? 2 : 1;
    const tabIndex = roving ? 0 : -1;

    return (
        <circle
            ref={refCb}
            cx={seat.x}
            cy={seat.y}
            r={RADIUS}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            tabIndex={tabIndex}
            role="button"
            aria-label={aria}
            onClick={handleToggle}
            onFocus={() => setFocus(seat.id)}
            onKeyDown={onKeyDown}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        />
    );
}
