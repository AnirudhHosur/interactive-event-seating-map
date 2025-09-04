"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import ArenaCard from "./ArenaCard";

interface Arena {
    venueId: string;
    name: string;
    description: string;
    capacity: number;
    location: string;
    image: string;
}

export default function ArenaList() {
    const [arenas, setArenas] = React.useState<Arena[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");

    React.useEffect(() => {
        fetch("/arenas.json")
            .then((r) => r.json())
            .then((data: Arena[]) => {
                setArenas(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to load arenas:", error);
                setLoading(false);
            });
    }, []);

    const filteredArenas = arenas.filter((arena) =>
        arena.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arena.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arena.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="grid" alignItems="center" justifyContent="center" minHeight={400}>
                <CircularProgress sx={{ color: 'var(--accent-primary)' }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                    }}
                >
                    Choose Your Venue
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 3,
                        color: 'var(--text-secondary)',
                    }}
                >
                    Select from our premium selection of venues and start your booking experience
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Search arenas by name, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                        maxWidth: 600,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'var(--background-secondary)',
                            color: 'var(--text-primary)',
                            '& fieldset': {
                                borderColor: 'var(--border-primary)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--border-secondary)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--accent-primary)',
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: 'var(--text-primary)',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'var(--text-tertiary)',
                            opacity: 1,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                🔍
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {filteredArenas.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <Typography 
                        variant="h6" 
                        sx={{
                            color: 'var(--text-secondary)',
                        }}
                    >
                        No arenas found matching "{searchTerm}"
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {filteredArenas.map((arena) => (
                        <Grid item key={arena.venueId}>
                            <ArenaCard {...arena} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
