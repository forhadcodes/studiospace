"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarX2Icon, RefreshCwIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { RowListSkeleton } from "@/components/loading/skeletons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

const LOAD_ATTEMPTS = 3;
const RETRY_DELAY_MS = 700;

// Same-origin fetch with a couple of retries. In development a restarted or
// still-compiling dev server can reject the first request with "Failed to
// fetch"; retrying recovers without showing an error screen.
async function fetchBookings(signal: AbortSignal): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= LOAD_ATTEMPTS; attempt++) {
    try {
      return await fetch("/api/bookings", { cache: "no-store", signal });
    } catch (err) {
      lastError = err;
      if (signal.aborted) throw err;
      if (attempt < LOAD_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * attempt),
        );
      }
    }
  }

  throw lastError;
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

  /* ---------- GET /api/bookings ---------- */
  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetchBookings(controller.signal);
        const data = (await res.json().catch(() => null)) as {
          bookings?: Booking[];
        } | null;

        if (controller.signal.aborted) return;

        if (!res.ok) {
          setFailed(true);
          return;
        }

        setBookings(
          Array.isArray(data?.bookings)
            ? [...data.bookings].sort(sortByNewest)
            : [],
        );
        setFailed(false);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.warn("Could not load bookings:", err);
        setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [email, refreshToken]);

  function retry() {
    setLoading(true);
    setFailed(false);
    setRefreshToken((token) => token + 1);
  }

  function updateBooking(id: string, patch: Partial<Booking>) {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...patch } : b)),
    );
  }

  /* ---------- Loading state (session resolving, or bookings fetching) ---------- */
  if (sessionPending || (!!email && loading)) {
    return (
      <main className="min-h-screen bg-section">
        <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3 h-4 w-80" />
          <div className="mt-8 border-t border-border pt-8">
            <RowListSkeleton count={3} />
          </div>
        </section>
      </main>
    );
  }

  /* ---------- Not logged in ---------- */
  if (!user) {
    return (
      <main className="min-h-screen bg-section">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Please log in
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
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
      <main className="min-h-screen bg-section">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Couldn&apos;t load bookings
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We couldn&apos;t reach the bookings service. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={retry}
            className="mt-8 text-red-600 dark:text-red-500 hover:bg-red-600/10 hover:text-red-600"
          >
            <RefreshCwIcon data-icon="inline-start" />
            Try again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-section">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage and view your upcoming studio sessions
        </p>

        <div className="mt-8 space-y-5 border-t border-border pt-8">
          {bookings.length === 0 ? (
            <EmptyState
              icon={CalendarX2Icon}
              title="No bookings yet"
              description="Your call sheet is empty. Find a space, pick your hours and your first booking will show up here."
            >
              <Link
                href="/studio-explore"
                className={buttonVariants({
                  className: "bg-red-600 text-white hover:bg-red-600/90",
                })}
              >
                Browse Studios
              </Link>
              <Link
                href="/how-it-work"
                className={buttonVariants({ variant: "outline" })}
              >
                How It Works
              </Link>
            </EmptyState>
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
