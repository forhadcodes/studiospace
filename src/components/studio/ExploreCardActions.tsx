"use client";

import { useRouter } from "next/navigation";

import EditStudioExplore from "@/components/EditStudioExplore";
import DeleteListingDialog from "@/components/my-listings/DeleteListingDialog";
import type { Studio } from "@/lib/studios";

/**
 * Owner-only Edit + Delete controls shown in the top-right corner of every
 * studio card on the explore page. Renders nothing for visitors who are not
 * the listing's owner (the APIs enforce ownership as a backstop).
 */
export default function ExploreCardActions({
  studio,
  viewerEmail,
}: {
  studio: Studio;
  /** Signed-in viewer's e-mail from the server page (null when anonymous). */
  viewerEmail?: string | null;
}) {
  const router = useRouter();

  const isOwner =
    Boolean(viewerEmail) &&
    Boolean(studio.ownerEmail) &&
    studio.ownerEmail?.toLowerCase() === viewerEmail?.toLowerCase();

  if (!isOwner) return null;

  // The lib-Studio shape (nested location) → the flat shape the dialogs use.
  const editStudio = {
    _id: studio.slug,
    title: studio.title,
    category: studio.category,
    city: studio.location.city,
    address: studio.location.address,
    hourlyRate: studio.hourlyRate,
    securityDeposit: studio.securityDeposit,
    maxCapacity: studio.maxCapacity,
    image: studio.image,
    gallery: studio.gallery,
    amenities: studio.amenities,
    overview: studio.overview,
    ownerEmail: studio.ownerEmail,
  };

  function refresh() {
    // Server component re-fetches the list after edit/delete.
    router.refresh();
  }

  return (
    <div className="absolute right-3 top-3 z-10 flex gap-1.5">
      <EditStudioExplore
        studio={editStudio}
        iconTrigger
        onSaved={refresh}
      />
      <DeleteListingDialog
        studioId={studio.slug}
        studioTitle={studio.title}
        iconTrigger
        onDeleted={refresh}
      />
    </div>
  );
}
