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
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                }
            }}
            onClick={handleClick}
        >
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt={name}
                sx={{ 
                    objectFit: 'cover',
                    backgroundColor: '#f5f5f5'
                }}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                    {description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                        label={`${capacity.toLocaleString()} seats`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                    />
                    <Chip 
                        label={location} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
