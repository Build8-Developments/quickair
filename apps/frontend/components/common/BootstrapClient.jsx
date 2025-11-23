"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Import bootstrap only on client-side
    import("bootstrap");
  }, []);

  return null;
}
