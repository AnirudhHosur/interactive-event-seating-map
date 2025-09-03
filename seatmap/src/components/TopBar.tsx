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
        <AppBar position="sticky" elevation={1}>
            <Toolbar>
                {showHomeButton && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        sx={{ mr: 2 }}
                    >
                        <HomeIcon />
                    </IconButton>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {showHeatMapToggle && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={heatMapEnabled}
                                    onChange={handleHeatMapToggle}
                                    color="secondary"
                                    size="small"
                                />
                            }
                            label="Heat Map"
                            labelPlacement="start"
                            sx={{ 
                                color: 'white',
                                '& .MuiFormControlLabel-label': {
                                    color: 'white',
                                    fontSize: '0.875rem'
                                }
                            }}
                        />
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
