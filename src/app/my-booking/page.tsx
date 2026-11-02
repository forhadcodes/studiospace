"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircleIcon, RefreshCwIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import MyBookingCard, {
  type Booking,
} from "@/components/my-booking/MyBookingCard";

/* ---------- Helpers ---------- */

const DATE_KEY = "bookingDate";

// Newest bookings first.
function sortByNewest(a: Booking, b: Booking): number {
  return (
    new Date(b[DATE_KEY] ?? 0).getTime() - new Date(a[DATE_KEY] ?? 0).getTime()
  );
}

/* ---------- Page ---------- */

export default function MyBookingsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  // Bumped by the retry button on the error screen to re-run the fetch.
  const [refreshToken, setRefreshToken] = useState(0);

  /* ---------- GET /booking?email=... ---------- */
  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/booking?email=${encodeURIComponent(email)}`,
          { cache: "no-store" },
        );
        const data: Booking[] = res.ok ? await res.json() : [];

        if (cancelled) return;

        setBookings(Array.isArray(data) ? data.sort(sortByNewest) : []);
        setFailed(!res.ok);
      } catch (err) {
        console.error(err);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [email, refreshToken]);

  function retry() {
    setRefreshToken((token) => token + 1);
  }

  function updateBooking(id: string, patch: Partial<Booking>) {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...patch } : b)),
    );
  }

  /* ---------- Loading state (session resolving, or bookings fetching) ---------- */
  if (sessionPending || (!!user && loading)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <span className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircleIcon className="size-5 animate-spin text-red-600" />
          Loading bookings…
        </span>
      </main>
    );
  }

  /* ---------- Not logged in ---------- */
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Please log in
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            You need an account to view your bookings.
          </p>
          <Link
            href="/login"
            className={`${buttonVariants({
              className: "mt-8",
            })} bg-red-600 text-white hover:bg-red-600/90`}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  /* ---------- API error state ---------- */
  if (failed) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Couldn&apos;t load bookings
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            The booking server may be down. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={retry}
            className="mt-8 text-red-600 hover:bg-red-50 hover:text-red-600"
          >
            <RefreshCwIcon data-icon="inline-start" />
            Try again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage and view your upcoming studio sessions
        </p>

        <div className="mt-8 space-y-5 border-t border-gray-200 pt-8">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                No bookings yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                When you book a studio, it will show up here.
              </p>
              <Link
                href="/studio-explore"
                className={`${buttonVariants({
                  variant: "outline",
                  className: "mt-6",
                })} text-red-600 hover:text-red-600`}
              >
                Browse Studios
              </Link>
            </div>
          ) : (
            bookings.map((booking) => (
              <MyBookingCard
                key={booking._id}
                booking={booking}
                onUpdate={updateBooking}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
