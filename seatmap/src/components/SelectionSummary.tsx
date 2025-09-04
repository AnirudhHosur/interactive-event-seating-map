"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useSelection } from "@/store/selection";
import type { FlatSeat } from "@/lib/types";
import { currency, priceForTier } from "@/lib/price";

export default function SelectionSummary({ byId }: { byId: Map<string, FlatSeat> }) {
    const selectedIds = useSelection((s) => s.selectedIds);
    const clear = useSelection((s) => s.clear);
    const subtotal = useSelection((s) => s.subtotal);

    const items = selectedIds
        .map((id) => byId.get(id))
        .filter((s): s is FlatSeat => Boolean(s));

    const total = subtotal(byId);

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
                    Your selection ({items.length}/8)
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ my: 1 }}>
                    {items.length === 0 ? (
                        <Typography 
                            variant="body2" 
                            sx={{ color: 'var(--text-secondary)' }}
                        >
                            No seats selected yet.
                        </Typography>
                    ) : (
                        items.map((s) => (
                            <Chip
                                key={s.id}
                                label={`${s.sectionId}-${s.rowIndex}-${s.col} • ${currency(priceForTier(s.priceTier))}`}
                                size="small"
                                sx={{
                                    backgroundColor: 'var(--background-tertiary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-primary)',
                                }}
                            />
                        ))
                    )}
                </Stack>
                <Divider sx={{ my: 1, borderColor: 'var(--border-primary)' }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography 
                        variant="h6"
                        sx={{ color: 'var(--text-primary)' }}
                    >
                        Subtotal: {currency(total)}
                    </Typography>
                    <Button 
                        variant="outlined" 
                        onClick={clear} 
                        disabled={items.length === 0}
                        sx={{
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)',
                            '&:hover': {
                                borderColor: 'var(--border-secondary)',
                                backgroundColor: 'var(--background-tertiary)',
                            },
                            '&:disabled': {
                                borderColor: 'var(--border-primary)',
                                color: 'var(--text-tertiary)',
                            }
                        }}
                    >
                        Clear
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
