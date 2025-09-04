"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TopBar from "@/components/TopBar";
import SeatMap from "@/components/SeatMap";
import SeatDetails from "@/components/SeatDetails";
import SelectionSummary from "@/components/SelectionSummary";
import AdjacentSeatsHelper from "@/components/AdjacentSeatsHelper";
import type { Venue, FlatSeat } from "@/lib/types";
import { useRouter } from "next/navigation";

interface PageProps {
    params: {
        venueId: string;
    };
}

export default function ArenaPage({ params }: PageProps) {
    const router = useRouter();
    const [title, setTitle] = React.useState("Loading...");
    const [byId, setById] = React.useState<Map<string, FlatSeat>>(new Map());
    const [venue, setVenue] = React.useState<Venue | null>(null);
    const [heatMapEnabled, setHeatMapEnabled] = React.useState(false);
    const [neighbors, setNeighbors] = React.useState<{
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    } | null>(null);
    
    // Unwrap params for Next.js 15 compatibility
    const unwrappedParams = React.use(params);

    const onLoaded = React.useCallback((v: Venue, flat: FlatSeat[], map: Map<string, FlatSeat>) => {
        setTitle(`${v.name} — ${v.venueId}`);
        setById(map);
        setVenue(v);
    }, []);

    const onNeighborsLoaded = React.useCallback((neighborsData: {
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    }) => {
        setNeighbors(neighborsData);
    }, []);

    const handleBack = () => {
        router.push("/");
    };

    return (
        <>
            <TopBar 
                title={title} 
                showHomeButton={true} 
                showHeatMapToggle={true}
                heatMapEnabled={heatMapEnabled}
                onHeatMapToggle={setHeatMapEnabled}
            />
            <Container 
                maxWidth="lg" 
                sx={{ 
                    py: 2,
                    backgroundColor: 'var(--background-primary)',
                    minHeight: 'calc(100vh - 64px)',
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)',
                            '&:hover': {
                                borderColor: 'var(--border-secondary)',
                                backgroundColor: 'var(--background-secondary)',
                            }
                        }}
                    >
                        Back to Venues
                    </Button>
                </Box>
                
                {/* Heat Map Legend */}
                {heatMapEnabled && (
                    <Box sx={{ 
                        mb: 2, 
                        p: 2, 
                        backgroundColor: 'var(--background-secondary)', 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'var(--border-primary)'
                    }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                mb: 1, 
                                fontWeight: 'bold',
                                color: 'var(--text-primary)',
                            }}
                        >
                            Price Tier Legend:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    bgcolor: '#d32f2f', 
                                    borderRadius: '50%' 
                                }} />
                                <Typography 
                                    variant="body2"
                                    sx={{ color: 'var(--text-secondary)' }}
                                >
                                    Tier 1: Premium ($150)
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    bgcolor: '#f57c00', 
                                    borderRadius: '50%' 
                                }} />
                                <Typography 
                                    variant="body2"
                                    sx={{ color: 'var(--text-secondary)' }}
                                >
                                    Tier 2: Standard ($110)
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    bgcolor: '#fbc02d', 
                                    borderRadius: '50%' 
                                }} />
                                <Typography 
                                    variant="body2"
                                    sx={{ color: 'var(--text-secondary)' }}
                                >
                                    Tier 3: Economy ($80)
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    bgcolor: '#388e3c', 
                                    borderRadius: '50%' 
                                }} />
                                <Typography 
                                    variant="body2"
                                    sx={{ color: 'var(--text-secondary)' }}
                                >
                                    Tier 4: Budget ($55)
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
                
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <SeatMap 
                            venueId={unwrappedParams.venueId} 
                            onLoaded={onLoaded} 
                            heatMapEnabled={heatMapEnabled}
                            onNeighborsLoaded={onNeighborsLoaded}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            {neighbors && (
                                <AdjacentSeatsHelper 
                                    seats={Array.from(byId.values())}
                                    neighbors={neighbors}
                                />
                            )}
                            <SeatDetails byId={byId} />
                            <SelectionSummary byId={byId} />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
