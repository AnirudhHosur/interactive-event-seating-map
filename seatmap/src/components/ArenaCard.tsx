"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

interface ArenaCardProps {
    venueId: string;
    name: string;
    description: string;
    capacity: number;
    location: string;
    image: string;
}

export default function ArenaCard({ venueId, name, description, capacity, location, image }: ArenaCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/arena/${venueId}`);
    };

    return (
        <Card 
            sx={{ 
                maxWidth: 345, 
                cursor: 'pointer',
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-primary)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px var(--shadow)',
                    borderColor: 'var(--border-secondary)',
                },
                '&:focus-visible': {
                    outline: 'var(--focus-ring)',
                    outlineOffset: '2px',
                }
            }}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${name} venue`}
        >
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt={name}
                sx={{ 
                    objectFit: 'cover',
                    backgroundColor: 'var(--background-tertiary)'
                }}
            />
            <CardContent>
                <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                    }}
                >
                    {name}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        mb: 2, 
                        minHeight: 60,
                        color: 'var(--text-secondary)',
                    }}
                >
                    {description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                        label={`${capacity.toLocaleString()} seats`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{
                            borderColor: 'var(--accent-primary)',
                            color: 'var(--accent-primary)',
                            '&:hover': {
                                backgroundColor: 'var(--accent-primary)',
                                color: 'var(--background-primary)',
                            }
                        }}
                    />
                    <Chip 
                        label={location} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                        sx={{
                            borderColor: 'var(--text-secondary)',
                            color: 'var(--text-secondary)',
                            '&:hover': {
                                backgroundColor: 'var(--text-secondary)',
                                color: 'var(--background-primary)',
                            }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
