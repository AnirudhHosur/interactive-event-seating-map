"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

interface TopBarProps {
    title: string;
    showHomeButton?: boolean;
    showHeatMapToggle?: boolean;
    heatMapEnabled?: boolean;
    onHeatMapToggle?: (enabled: boolean) => void;
}

export default function TopBar({ 
    title, 
    showHomeButton = false, 
    showHeatMapToggle = false,
    heatMapEnabled = false,
    onHeatMapToggle 
}: TopBarProps) {
    const router = useRouter();

    const handleHomeClick = () => {
        router.push("/");
    };

    const handleHeatMapToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        onHeatMapToggle?.(event.target.checked);
    };

    return (
        <AppBar 
            position="sticky" 
            elevation={1}
            sx={{
                backgroundColor: 'var(--background-secondary)',
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-primary)',
            }}
        >
            <Toolbar>
                {showHomeButton && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        sx={{ 
                            mr: 2,
                            color: 'var(--text-primary)',
                            '&:hover': {
                                backgroundColor: 'var(--background-tertiary)',
                            }
                        }}
                    >
                        <HomeIcon />
                    </IconButton>
                )}
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1,
                        color: 'var(--text-primary)',
                    }}
                >
                    {title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {showHeatMapToggle && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={heatMapEnabled}
                                    onChange={handleHeatMapToggle}
                                    color="primary"
                                    size="small"
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: 'var(--accent-primary)',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: 'var(--accent-primary)',
                                        },
                                    }}
                                />
                            }
                            label="Heat Map"
                            labelPlacement="start"
                            sx={{ 
                                color: 'var(--text-primary)',
                                '& .MuiFormControlLabel-label': {
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem'
                                }
                            }}
                        />
                    )}
                    <ThemeToggle />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
