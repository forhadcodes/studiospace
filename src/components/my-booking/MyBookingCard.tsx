"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheckIcon,
  CalendarIcon,
  HashIcon,
  LoaderCircleIcon,
  XCircleIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

/* ---------- Types ---------- */

// Lifecycle values stored on a booking document by the Express API.
export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

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
  status?: BookingStatus;
}

interface MyBookingCardProps {
  booking: Booking;
  /** Applies the returned DB patch (e.g. status) to the page list. */
  onUpdate: (id: string, patch: Partial<Booking>) => void;
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

function isUpcoming(departureDate: string): boolean {
  const d = new Date(departureDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

// Badge label + color for each status. Legacy documents have no status
// field, so they are derived from the departure date
// (upcoming = Pending, past = Completed).
function getStatus(
  booking: Booking,
): { label: BookingStatus; className: string } {
  const status: BookingStatus = booking.status
    ? booking.status
    : isUpcoming(booking.departureDate)
      ? "Pending"
      : "Completed";

  const classes: Record<BookingStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Confirmed: "bg-emerald-50 text-emerald-700",
    Completed: "bg-sky-50 text-sky-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return { label: status, className: classes[status] };
}

/* ---------- Component ---------- */

// One row of the My Bookings page: studio image, status badge,
// departure info, price, and actions. "Cancel Booking" is offered
// only while the booking is still Pending, and sets it to Cancelled.
export default function MyBookingCard({
  booking,
  onUpdate,
}: MyBookingCardProps) {
  const [canceling, setCanceling] = useState(false);
  const status = getStatus(booking);
  const cancellable =
    (booking.status ?? status.label) === "Pending" && !canceling;

  async function handleCancel() {
    if (!cancellable) return;

    try {
      setCanceling(true);

      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.matchedCount > 0) {
        toast.success("Booking cancelled.");
        onUpdate(booking._id, { status: "Cancelled" });
      } else if (res.status === 401) {
        toast.error("Please log in to cancel this booking.");
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
          className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
        >
          <BadgeCheckIcon className="h-3.5 w-3.5" />
          {status.label}
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

        <div className="mt-4 flex items-center gap-2 sm:ml-auto sm:mt-auto">
          {/* Cancel is available only while the booking is Pending */}
          {cancellable && (
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-red-600 hover:bg-red-50 hover:text-red-600"
            >
              {canceling ? (
                <LoaderCircleIcon
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : (
                <XCircleIcon data-icon="inline-start" />
              )}
              Cancel Booking
            </Button>
          )}
          <Link
            href={`/studio-explore/${booking.studioId ?? booking._id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
