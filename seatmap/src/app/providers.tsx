"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
        <CssBaseline />
      { children }
    </>
  );
}
