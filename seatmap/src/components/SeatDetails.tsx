"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useFocus } from "@/store/focus";
import type { FlatSeat } from "@/lib/types";
import { currency, priceForTier } from "@/lib/price";

export default function SeatDetails({ byId }: { byId: Map<string, FlatSeat> }) {
    const { focusId } = useFocus();
    const seat = focusId ? byId.get(focusId) : null;

    if (!seat) {
        return (
            <Card 
                variant="outlined"
                sx={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border-primary)',
                }}
            >
                <CardContent>
                    <Typography 
                        variant="subtitle1"
                        sx={{ color: 'var(--text-primary)' }}
                    >
                        Seat details
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ color: 'var(--text-secondary)' }}
                    >
                        Focus or click a seat to see details.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card 
            variant="outlined"
            sx={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-primary)',
            }}
        >
            <CardContent>
                <Typography 
                    variant="subtitle1"
                    sx={{ color: 'var(--text-primary)' }}
                >
                    Seat details
                </Typography>
                <Divider sx={{ my: 1, borderColor: 'var(--border-primary)' }} />
                <Typography sx={{ color: 'var(--text-primary)' }}>
                    Section: <b>{seat.sectionLabel}</b>
                </Typography>
                <Typography sx={{ color: 'var(--text-primary)' }}>
                    Row: <b>{seat.rowIndex}</b>
                </Typography>
                <Typography sx={{ color: 'var(--text-primary)' }}>
                    Seat: <b>{seat.col}</b>
                </Typography>
                <Typography sx={{ color: 'var(--text-primary)' }}>
                    Status: <b>{seat.status}</b>
                </Typography>
                <Typography sx={{ color: 'var(--text-primary)' }}>
                    Price: <b>{currency(priceForTier(seat.priceTier))}</b>
                </Typography>
            </CardContent>
        </Card>
    );
}
