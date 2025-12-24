"use client";
import { useEffect } from "react";
import { preloadAirports } from "@/lib/amadeus";

export default function AirportsPreloader() {
  useEffect(() => {
    // Preload airports data on app mount
    preloadAirports().catch((error) => {
      console.error("Failed to preload airports:", error);
    });
  }, []);

  return null; // This component doesn't render anything
}
