"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import TopBar from "@/components/TopBar";
import ArenaList from "@/components/ArenaList";

export default function Page() {
  return (
    <>
      <TopBar title="Venue Selection" />
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          backgroundColor: 'var(--background-primary)',
          minHeight: 'calc(100vh - 64px)', // Account for TopBar height
        }}
      >
        <ArenaList />
      </Container>
    </>
  );
}
