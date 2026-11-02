import { Suspense } from "react";

import { Banner } from "@/components/banner";
import { CategoryGrid } from "@/components/category-grid";
import {
  FeaturedStudios,
  FeaturedStudiosSkeleton,
} from "@/components/featured-studios";
import { HostGuarantee } from "@/components/host-guarantee";
import { BookingSteps } from "@/components/booking-steps";

export default function Home() {
  return (
    <>
      <main>
        <Suspense
          fallback={
            <div className="h-[92vh] min-h-[640px] w-full bg-[#150402]" />
          }
        >
          <Banner />
        </Suspense>
        <Suspense fallback={<FeaturedStudiosSkeleton />}>
          <FeaturedStudios />
        </Suspense>
        <CategoryGrid />
        <BookingSteps />
        <HostGuarantee />
      </main>
    </>
  );
}
