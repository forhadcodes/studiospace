"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheckIcon,
  CalendarIcon,
  HashIcon,
  LoaderCircleIcon,
  TrashIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

/* ---------- Types ---------- */

// Shape of a booking document stored by POST /booking on the Express server.
// `studioId` points at the original studio; `_id` is the booking's own id.
export interface Booking {
  _id: string;
  studioId?: string;
  image: string;
  title: string;
  city: string;
  hourlyRate: string | number;
  departureDate: string;
  bookingDate: string;
}

interface MyBookingCardProps {
  booking: Booking;
  /** Removes the card from the page list after a successful cancel. */
  onCanceled: (id: string) => void;
}

/* ---------- Helpers ---------- */

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : DATE_FORMAT.format(d);
}

// A booking is upcoming (Confirmed) until its departure date has passed.
function isUpcoming(departureDate: string): boolean {
  const d = new Date(departureDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

/* ---------- Component ---------- */

// One row of the My Bookings page: studio image, departure info, price,
// and cancel/view actions. Cancel hits DELETE /booking/:id.
export default function MyBookingCard({
  booking,
  onCanceled,
}: MyBookingCardProps) {
  const [canceling, setCanceling] = useState(false);
  const upcoming = isUpcoming(booking.departureDate);

  async function handleCancel() {
    try {
      setCanceling(true);

      const res = await fetch(`http://localhost:5000/booking/${booking._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.acknowledged) {
        toast.success("Booking cancelled.");
        onCanceled(booking._id);
      } else {
        toast.error(
          data?.message ??
            `Cancel failed (${res.status}). Please try again.`,
        );
      }
    } catch {
      toast.error("Network error — could not reach the server.");
    } finally {
      setCanceling(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
      {/* Studio image */}
      <div className="overflow-hidden rounded-xl bg-gray-100 sm:w-56 sm:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={booking.image}
          alt={booking.title}
          className="h-40 w-full object-cover sm:h-full"
        />
      </div>

      {/* Details + actions */}
      <div className="flex flex-1 flex-col">
        <span
          className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            upcoming
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <BadgeCheckIcon className="h-3.5 w-3.5" />
          {upcoming ? "Confirmed" : "Completed"}
        </span>

        <h3 className="mt-2 text-xl font-semibold text-gray-900">
          {booking.title}
        </h3>

        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            Departure: {formatDate(booking.departureDate)}
          </p>
          <p className="flex items-center gap-2">
            <HashIcon className="h-4 w-4 text-gray-400" />
            Booking ID: {booking._id}
          </p>
        </div>

        <p className="mt-3 text-2xl font-semibold text-red-600">
          ${Number(booking.hourlyRate)}
        </p>

        <div className="mt-4 flex items-center gap-2 sm:ml-auto sm:mt-auto sm:flex-row">
          <Button
            variant="ghost"
            disabled={canceling}
            onClick={handleCancel}
            className="text-red-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
          >
            {canceling ? (
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
            ) : (
              <TrashIcon data-icon="inline-start" />
            )}
            Cancel
          </Button>
          <Link
            href={`/studio-explore/${booking.studioId ?? booking._id}`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
