export type SeatStatus = "available" | "reserved" | "sold" | "held";

export interface Seat {
    id: string;
    col: number;
    x: number;
    y: number;
    priceTier: number;
    status: SeatStatus;
}

export interface Row {
    index: number;
    seats: Seat[];
}

export interface BaseSection {
    id: string;
    label: string;
    transform: { x: number; y: number; scale: number };
}

export interface SeatingSection extends BaseSection {
    type: "seating";
    rows: Row[];
}

export interface StageSection extends BaseSection {
    type: "stage";
    width: number;
    height: number;
    color?: string;
}

export type Section = SeatingSection | StageSection;

export interface Venue {
    venueId: string;
    name: string;
    map: { width: number; height: number };
    sections: Section[];
}

export interface FlatSeat extends Seat {
    sectionId: string;
    sectionLabel: string;
    rowIndex: number;
}
