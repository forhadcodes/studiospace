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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// Booking summary card (price, key details, benefits) shown beside the studio
// details. "Book Now" opens a custom modal where the date is picked and the
// booking is submitted.
export default function BookingCard({ studio }: BookingCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  async function handleBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isPending) return;
    if (!user) {
      setOpen(false);
      toast.error("Please log in to book a studio.");
      router.push("/login");
      return;
    }

    const departureDate = new FormData(e.currentTarget).get(
      "departureDate",
    ) as string;
    if (!departureDate) {
      toast.error("Please choose a shoot date.");
      return;
    }

    // Remove the studio's own _id (Mongo would store the booking under it,
    // causing duplicate-key errors) and keep the studio reference separately.
    const { _id: studioId, ...studioFields } = studio;

    try {
      setSubmitting(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        // Explicit per spec: sends the HTTPOnly JWT cookie with the request.
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...studioFields,
          studioId,
          departureDate,
        }),
      });
      const bookingData = await res.json().catch(() => null);

      if (res.ok) {
        setOpen(false);
        toast.success("Booking confirmed!", {
          description: "Opening your bookings…",
        });
        router.push("/my-booking");
      } else if (res.status === 401) {
        setOpen(false);
        toast.error("Please log in to book a studio.");
        router.push("/login");
      } else {
        // 409 double-booking and other server errors surface here as toasts.
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
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
        <p className="text-xs font-medium text-muted-foreground">Starting from</p>
        <p className="mt-1 text-4xl font-semibold text-foreground">
          ${Number(studio.hourlyRate)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / hour
          </span>
        </p>

        {Number(studio.securityDeposit) > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            + ${Number(studio.securityDeposit)} refundable security deposit
          </p>
        )}

        <div className="mt-6 border-t border-border pt-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <UsersIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
            Max capacity {Number(studio.maxCapacity)} guests
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
            {studio.city}
          </p>
        </div>

        {/* Book Now opens the booking modal */}
        <Dialog open={open} onOpenChange={(next) => !submitting && setOpen(next)}>
          <DialogTrigger
            render={
              <Button
                disabled={submitting || isPending}
                className="mt-6 w-full bg-red-600 text-white hover:bg-red-600/90 disabled:opacity-60"
              >
                Book Now
              </Button>
            }
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book this studio</DialogTitle>
              <DialogDescription>
                Pick your shoot date — the studio holds one confirmed booking
                per date.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBooking} noValidate>
              <Input
                type="date"
                name="departureDate"
                aria-label="Departure Date"
                required
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 sm:text-base"
              />

              <Button
                type="submit"
                disabled={submitting || isPending}
                className="mt-5 w-full bg-red-600 text-white hover:bg-red-600/90 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircleIcon
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                    Booking…
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Booking benefits */}
        <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
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
