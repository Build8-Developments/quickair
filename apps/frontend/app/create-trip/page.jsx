import CreateTripFlow from "@/components/pages/createTrip/CreateTripFlow";
import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";

export const metadata = {
  title: "Create Your Dream Trip - QuickAir",
  description: "Plan your perfect journey with our interactive trip builder. Get visa assistance, choose packages, set your budget, and explore amazing destinations.",
};

export default function CreateTripPage() {
  return (
    <>
      <Header3 />
      <CreateTripFlow />
      <FooterTwo />
    </>
  );
}
