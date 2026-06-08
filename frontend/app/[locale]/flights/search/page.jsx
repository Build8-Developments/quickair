import { Suspense } from "react";
import FlightSearchRedirect from "./FlightSearchRedirect";

export default function FlightSearchPage() {
  return (
    <Suspense fallback={null}>
      <FlightSearchRedirect />
    </Suspense>
  );
}
