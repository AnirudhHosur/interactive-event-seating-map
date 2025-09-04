"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "../components/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CssBaseline />
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </>
    );
}
