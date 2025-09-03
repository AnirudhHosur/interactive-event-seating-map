"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import { findAdjacentSeats } from "@/lib/findAdjacentSeats";
import type { FlatSeat } from "@/lib/types";
import { useSelection } from "@/store/selection";
import { useFocus } from "@/store/focus";

interface Props {
    seats: FlatSeat[];
    neighbors: {
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    };
}

export default function AdjacentSeatsHelper({ seats, neighbors }: Props) {
    const [seatCount, setSeatCount] = React.useState<number>(2);
    const [isSearching, setIsSearching] = React.useState(false);
    const [searchResult, setSearchResult] = React.useState<string[] | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    
    const { clear, toggle } = useSelection();
    const { setFocus } = useFocus();

    const handleFindSeats = async () => {
        if (seatCount <= 0) {
            setError("Please enter a valid number of seats");
            return;
        }

        setIsSearching(true);
        setError(null);
        setSearchResult(null);

        try {
            // Simulate a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const result = findAdjacentSeats(seats, seatCount, neighbors);
            
            if (result) {
                setSearchResult(result);
                setError(null);
            } else {
                setError(`No group of ${seatCount} adjacent seats found`);
                setSearchResult(null);
            }
        } catch (err) {
            setError("An error occurred while searching for seats");
            setSearchResult(null);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectFoundSeats = () => {
        if (!searchResult) return;
        
        // Clear current selection and add the found seats
        clear();
        
        // Add each found seat to selection
        searchResult.forEach(seatId => {
            const seat = seats.find(s => s.id === seatId);
            if (seat) {
                toggle(seat);
            }
        });
        
        // Focus on the first seat in the group
        if (searchResult.length > 0) {
            setFocus(searchResult[0]);
        }
    };

    const handleClearSearch = () => {
        setSearchResult(null);
        setError(null);
    };

    return (
        <Box sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
        }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon />
                Find Adjacent Seats
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                    type="number"
                    label="Number of seats"
                    value={seatCount}
                    onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, max: 20 }}
                    size="small"
                    sx={{ width: 150 }}
                />
                <Button
                    variant="contained"
                    onClick={handleFindSeats}
                    disabled={isSearching}
                    startIcon={<SearchIcon />}
                >
                    {isSearching ? "Searching..." : "Find Seats"}
                </Button>
            </Box>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={handleClearSearch}>
                    {error}
                </Alert>
            )}

            {/* Search Results */}
            {searchResult && (
                <Box sx={{ 
                    p: 2, 
                    bgcolor: 'success.light', 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'success.main'
                }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'success.dark' }}>
                        Found {searchResult.length} adjacent seats!
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'success.dark' }}>
                        Seat IDs: {searchResult.join(", ")}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSelectFoundSeats}
                            sx={{ bgcolor: 'success.main' }}
                        >
                            Select These Seats
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleClearSearch}
                            sx={{ borderColor: 'success.main', color: 'success.main' }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
            )}

            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                This helper will find {seatCount} adjacent available seats. It prioritizes horizontal groups, then vertical groups.
            </Typography>
        </Box>
    );
}
