"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import MyBookingCard, {
  type Booking,
} from "@/components/my-booking/MyBookingCard";

/* ---------- Page ---------- */

export default function MyBookingsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /* ---------- GET /booking?email=... ---------- */
  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `http://localhost:5000/booking?email=${encodeURIComponent(email!)}`,
          { cache: "no-store" },
        );
        const data: Booking[] = res.ok ? await res.json() : [];
        if (!cancelled) {
          setBookings(Array.isArray(data) ? data : []);
          setFailed(!res.ok);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [email]);

  function removeBooking(id: string) {
    setBookings((prev) => prev.filter((b) => b._id !== id));
  }

  /* ---------- Loading state ---------- */
  if (loading || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <span className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircleIcon className="size-5 animate-spin text-red-600" />
          Loading bookings…
        </span>
      </main>
    );
  }

  /* ---------- Error state ---------- */
  if (failed) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Couldn&apos;t load bookings
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            The booking server may be down. Please try again later.
          </p>
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

        <div className="mt-8 border-t border-gray-200 pt-8">
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
            <div className="space-y-5">
              {bookings.map((booking) => (
                <MyBookingCard
                  key={booking._id}
                  booking={booking}
                  onCanceled={removeBooking}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
