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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    Confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    Completed: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    Cancelled: "bg-red-600/10 text-red-700 dark:text-red-400",
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
        // Explicit per spec: sends the HTTPOnly JWT cookie with the request.
        credentials: "include",
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
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row">
      {/* Studio image */}
      <div className="overflow-hidden rounded-xl bg-muted sm:w-56 sm:shrink-0">
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

        <h3 className="mt-2 text-xl font-semibold text-foreground">
          {booking.title}
        </h3>

        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            Departure: {formatDate(booking.departureDate)}
          </p>
          <p className="flex items-center gap-2">
            <HashIcon className="h-4 w-4 text-gray-400" />
            Booking ID: {booking._id}
          </p>
        </div>

        <p className="mt-3 text-2xl font-semibold text-red-600 dark:text-red-500">
          ${Number(booking.hourlyRate)}
        </p>

        <div className="mt-4 flex items-center gap-2 sm:ml-auto sm:mt-auto">
          {/* Cancel is available only while the booking is Pending, and asks
              for confirmation in a modal first (no native confirm()). */}
          {cancellable && (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    disabled={canceling}
                    className="text-red-600 dark:text-red-500 hover:bg-red-600/10 hover:text-red-600"
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
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your reservation for “{booking.title}” on{" "}
                    {formatDate(booking.departureDate)} will be cancelled. This
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={canceling}>
                    Keep Booking
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={canceling}
                    className="bg-red-600 text-white hover:bg-red-600/90"
                  >
                    {canceling ? (
                      <LoaderCircleIcon
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                    ) : (
                      <XCircleIcon data-icon="inline-start" />
                    )}
                    {canceling ? "Cancelling…" : "Yes, Cancel Booking"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
