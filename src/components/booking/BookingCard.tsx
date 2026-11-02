"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ClockIcon,
  LoaderCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

/* ---------- Types ---------- */

// Only the studio fields this card renders — anything else is ignored,
// so it accepts the full Studio object from the studio details page too.
interface BookingStudio {
  _id: string;
  city: string;
  hourlyRate: string | number;
  securityDeposit: string | number;
  maxCapacity: string | number;
}

interface BookingCardProps {
  studio: BookingStudio;
}

/* ---------- Component ---------- */

// Booking summary card (price, key details, date picker, CTA, benefits)
// shown beside the studio details. Submits the booking to the Express API.
export default function BookingCard({ studio }: BookingCardProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  async function handleBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const departureDate = new FormData(e.currentTarget).get(
      "departureDate",
    ) as string;
    if (!departureDate) return;

    // Remove the studio's own _id (Mongo would store the booking under it,
    // causing duplicate-key errors) and keep the studio reference separately.
    const { _id: studioId, ...studioFields } = studio;

    const data = {
      username: user?.name,
      email: user?.email,
      ...studioFields,
      studioId,
      bookingDate: new Date().toISOString(),
      departureDate,
    };

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const bookingData = await res.json();

      if (res.ok && bookingData.acknowledged) {
        toast.success("Booking successful!");
        router.push("/my-booking");
      } else {
        toast.error(
          bookingData?.message ??
            `Booking failed (${res.status}). Please try again.`,
        );
      }
    } catch {
      toast.error("Network error — could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <p className="text-xs font-medium text-gray-500">Starting from</p>
        <p className="mt-1 text-4xl font-semibold text-gray-900">
          ${Number(studio.hourlyRate)}
          <span className="ml-1 text-sm font-normal text-gray-500">
            / hour
          </span>
        </p>

        {Number(studio.securityDeposit) > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            + ${Number(studio.securityDeposit)} refundable security deposit
          </p>
        )}

        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <UsersIcon className="h-4 w-4 text-red-600" />
            Max capacity {Number(studio.maxCapacity)} guests
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 text-red-600" />
            {studio.city}
          </p>
        </div>

        <form onSubmit={handleBooking}>
          <Input
            type="date"
            name="departureDate"
            aria-label="Departure Date"
            required
            className="mt-6 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 sm:text-base"
          />

          <Button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-red-600 text-white hover:bg-red-600/90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
                Booking…
              </>
            ) : (
              "Book Now"
            )}
          </Button>
        </form>

        {/* Booking benefits */}
        <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            Free cancellation for 24 hours
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-gray-400" />
            Secure payment &amp; deposit protection
          </li>
          <li className="flex items-center gap-2">
            <ZapIcon className="h-4 w-4 text-gray-400" />
            Instant confirmation
          </li>
        </ul>
      </div>
    </aside>
  );
}
