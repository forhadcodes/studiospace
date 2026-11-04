"use client";

import Link from "next/link";
import {
  BadgeCheckIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import EditStudioExplore from "@/components/EditStudioExplore";
import DeleteListingDialog from "@/components/my-listings/DeleteListingDialog";

/* ---------- Types ---------- */

// Flat shape shared with EditStudioExplore (which needs `_id` for its PUT).
export interface ListingStudio {
  _id: string;
  title: string;
  category: string;
  address: string;
  city: string;
  hourlyRate: string | number;
  securityDeposit: string | number;
  maxCapacity: string | number;
  image: string;
  gallery?: string[];
  amenities?: string[];
  overview: string;
  ownerEmail?: string;
}

// "photo-studio" -> "Photo Studio"
function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface MyListingCardProps {
  studio: ListingStudio;
  /** Drops the deleted studio from the page list. */
  onDeleted: (id: string) => void;
  /** Propagates the refreshed studio after a successful edit. */
  onUpdated: (id: string, studio: ListingStudio) => void;
}

/* ---------- Component ---------- */

// One row of the My Studio Listings page: studio image, key details,
// price, and Update (edit dialog) / Delete (confirmation dialog) actions.
export default function MyListingCard({
  studio,
  onDeleted,
  onUpdated,
}: MyListingCardProps) {
  // EditStudioExplore gets the refreshed studio from the page on save.
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row">
      {/* Studio image */}
      <div className="overflow-hidden rounded-xl bg-muted sm:w-56 sm:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          className="h-40 w-full object-cover sm:h-full"
        />
      </div>

      {/* Details + actions */}
      <div className="flex flex-1 flex-col">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <BadgeCheckIcon className="h-3.5 w-3.5 text-red-600 dark:text-red-500" />
          {formatCategory(studio.category)}
        </span>

        <h3 className="mt-2 text-xl font-semibold text-foreground">
          {studio.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            {studio.city}
          </p>
          <p className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-gray-400" />
            Up to {Number(studio.maxCapacity)} guests
          </p>
        </div>

        <p className="mt-3 text-2xl font-semibold text-red-600 dark:text-red-500">
          ${Number(studio.hourlyRate)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">/ hour</span>
        </p>

        <div className="mt-4 flex items-center gap-2 sm:ml-auto sm:mt-auto">
          <EditStudioExplore
            studio={studio}
            onSaved={() => onUpdated(studio._id, studio)}
          />
          <DeleteListingDialog
            studioId={studio._id}
            studioTitle={studio.title}
            onDeleted={onDeleted}
          />
          <Link
            href={`/studio-explore/${studio._id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
