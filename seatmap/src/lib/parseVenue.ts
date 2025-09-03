import { Venue, FlatSeat } from "./types";

export function flattenSeats(venue: Venue): FlatSeat[] {
    const out: FlatSeat[] = [];
    for (const section of venue.sections) {
        if (section.type === "seating" && section.rows) {
            for (const row of section.rows) {
                for (const seat of row.seats) {
                    out.push({
                        ...seat,
                        sectionId: section.id,
                        sectionLabel: section.label,
                        rowIndex: row.index,
                    });
                }
            }
        }
    }
    return out;
}

/** Build neighbor indices for arrow-key navigation using (section,row,col). */
export function buildNeighbors(venue: Venue) {
    const left = new Map<string, string | null>();
    const right = new Map<string, string | null>();
    const up = new Map<string, string | null>();
    const down = new Map<string, string | null>();

    for (const section of venue.sections) {
        if (section.type === "seating" && section.rows) {
            const rows = section.rows.sort((a, b) => a.index - b.index);
            for (let r = 0; r < rows.length; r++) {
                const row = rows[r];
                const seats = row.seats.sort((a, b) => a.col - b.col);
                for (let c = 0; c < seats.length; c++) {
                    const id = seats[c].id;
                    left.set(id, c > 0 ? seats[c - 1].id : null);
                    right.set(id, c < seats.length - 1 ? seats[c + 1].id : null);
                    // up/down: find same col in previous/next row if exists
                    const upRow = r > 0 ? rows[r - 1] : null;
                    const downRow = r < rows.length - 1 ? rows[r + 1] : null;
                    const upSeat = upRow?.seats.find((s) => s.col === seats[c].col) ?? null;
                    const downSeat = downRow?.seats.find((s) => s.col === seats[c].col) ?? null;
                    up.set(id, upSeat?.id ?? null);
                    down.set(id, downSeat?.id ?? null);
                }
            }
        }
    }

    return { left, right, up, down };
}
