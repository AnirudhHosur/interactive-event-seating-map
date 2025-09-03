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
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="subtitle1">Seat details</Typography>
                    <Typography variant="body2" color="text.secondary">Focus or click a seat to see details.</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1">Seat details</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Section: <b>{seat.sectionLabel}</b></Typography>
                <Typography>Row: <b>{seat.rowIndex}</b></Typography>
                <Typography>Seat: <b>{seat.col}</b></Typography>
                <Typography>Status: <b>{seat.status}</b></Typography>
                <Typography>Price: <b>{currency(priceForTier(seat.priceTier))}</b></Typography>
            </CardContent>
        </Card>
    );
}
