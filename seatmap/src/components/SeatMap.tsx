"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Venue, FlatSeat } from "@/lib/types";
import { flattenSeats, buildNeighbors } from "@/lib/parseVenue";
import Seat from "./Seat";
import { useFocus } from "@/store/focus";
import { useSelection } from "@/store/selection";
import { select } from "d3-selection";
import { zoom, ZoomTransform, zoomIdentity } from "d3-zoom";

type Props = {
    venueId?: string;
    onLoaded: (venue: Venue, seats: FlatSeat[], byId: Map<string, FlatSeat>) => void;
    heatMapEnabled?: boolean;
    onNeighborsLoaded?: (neighbors: ReturnType<typeof buildNeighbors>) => void;
};

export default function SeatMap({ venueId, onLoaded, heatMapEnabled = false, onNeighborsLoaded }: Props) {
    const [venue, setVenue] = React.useState<Venue | null>(null);
    const [flat, setFlat] = React.useState<FlatSeat[]>([]);
    const [neighbors, setNeighbors] = React.useState<ReturnType<typeof buildNeighbors> | null>(null);

    const svgRef = React.useRef<SVGSVGElement | null>(null);
    const gRef = React.useRef<SVGGElement | null>(null);
    const refMap = React.useRef(new Map<string, SVGCircleElement | null>());

    const { focusId, setFocus } = useFocus();
    const clearSelection = useSelection((s) => s.clear);

    // Load venue data
    React.useEffect(() => {
        if (!venueId) return;
        
        let alive = true;
        fetch("/arenas.json")
            .then((r) => r.json())
            .then((arenas: Venue[]) => {
                if (!alive) return;
                const venue = arenas.find(a => a.venueId === venueId);
                if (!venue) {
                    console.error(`Venue ${venueId} not found`);
                    return;
                }
                setVenue(venue);
                const f = flattenSeats(venue);
                setFlat(f);
                const n = buildNeighbors(venue);
                setNeighbors(n);
                // default focus: first seat (available if possible)
                const first = f.find((s) => s.status === "available") ?? f[0];
                if (first) setFocus(first.id);
                const map = new Map(f.map((s) => [s.id, s]));
                onLoaded(venue, f, map);
                onNeighborsLoaded?.(n);
            })
            .catch((error) => {
                console.error("Failed to load venue:", error);
            });
        return () => { alive = false; };
    }, [venueId, onLoaded, setFocus]);

    // D3 zoom/pan
    React.useEffect(() => {
        if (!svgRef.current || !gRef.current || !venue) return;
        const svgSel = select(svgRef.current);
        const gSel = select(gRef.current);
        const z = zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 6])
            .on("zoom", (ev) => {
                const t: ZoomTransform = ev.transform;
                gSel.attr("transform", t.toString());
            });

        svgSel.call(z as any).call(z.transform as any, zoomIdentity); // reset
        return () => {
            svgSel.on(".zoom", null);
        };
    }, [venue]);

    if (!venue || !neighbors) {
        return (
            <Box display="grid" alignItems="center" justifyContent="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    // roving tabindex: only the current focusId gets tabIndex=0
    const isRoving = (id: string) => focusId === id;

    return (
        <Box sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1, overflow: "hidden" }}>
            <svg
                ref={svgRef}
                width="100%"
                viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
                aria-label="Seating map"
                role="application"
            >
                <g ref={gRef}>
                    {/* Render stage and background elements first */}
                    {venue.sections.map((sec) => {
                        if (sec.type === "stage") {
                            return (
                                <g key={sec.id}>
                                    <rect
                                        x={sec.transform.x}
                                        y={sec.transform.y}
                                        width={sec.width}
                                        height={sec.height}
                                        fill={sec.color || "#2c3e50"}
                                        rx={8}
                                        ry={8}
                                    />
                                    <text
                                        x={sec.transform.x + sec.width / 2}
                                        y={sec.transform.y + sec.height / 2 + 5}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="16"
                                        fontWeight="bold"
                                    >
                                        {sec.label}
                                    </text>
                                </g>
                            );
                        }
                        return null;
                    })}
                    
                    {/* Render seating sections */}
                    {venue.sections.map((sec) => {
                        if (sec.type === "seating" && sec.rows) {
                            return (
                                <g
                                    key={sec.id}
                                    transform={`translate(${sec.transform.x},${sec.transform.y}) scale(${sec.transform.scale})`}
                                    aria-label={`Section ${sec.label}`}
                                >
                                    {/* Section label */}
                                    <text
                                        x={0}
                                        y={-10}
                                        fill="#666"
                                        fontSize="14"
                                        fontWeight="bold"
                                    >
                                        {sec.label}
                                    </text>
                                    
                                    {/* Render seats in this section */}
                                    {sec.rows.map((row) =>
                                        row.seats.map((s) => {
                                            const flatSeat = flat.find((fs) => fs.id === s.id)!;
                                            return (
                                                                                        <Seat
                                            key={s.id}
                                            seat={flatSeat}
                                            neighbors={{
                                                left: neighbors.left.get(s.id) ?? null,
                                                right: neighbors.right.get(s.id) ?? null,
                                                up: neighbors.up.get(s.id) ?? null,
                                                down: neighbors.down.get(s.id) ?? null,
                                            }}
                                            refMap={refMap}
                                            roving={isRoving(s.id)}
                                            heatMapEnabled={heatMapEnabled}
                                        />
                                            );
                                        })
                                    )}
                                </g>
                            );
                        }
                        return null;
                    })}
                </g>
            </svg>
        </Box>
    );
}
