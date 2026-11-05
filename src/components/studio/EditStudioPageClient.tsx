"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { XCircleIcon } from "lucide-react";

import EditStudioExplore, {
  type Studio,
} from "@/components/EditStudioExplore";
import { buttonVariants } from "@/components/ui/button";

/**
 * Client shell for /studio-explore/edit/[id].
 * The server page only renders this when the studio exists; ownership is
 * enforced again by PUT /api/studios/[id] even if the UI is bypassed.
 */
export default function EditStudioPageClient({
  studio,
  viewerEmail,
}: {
  studio: Studio;
  viewerEmail?: string | null;
}) {
  const router = useRouter();

  const isOwner =
    Boolean(viewerEmail) &&
    Boolean(studio.ownerEmail) &&
    studio.ownerEmail!.toLowerCase() === viewerEmail!.toLowerCase();

  if (!isOwner) {
    return (
      <main className="flex-1 bg-section">
        <section className="mx-auto w-full max-w-xl px-6 py-16 text-center">
          <XCircleIcon className="mx-auto size-12 text-red-600 dark:text-red-500" />
          <h1 className="mt-4 text-2xl font-bold">Not your studio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You can only edit studios that you listed yourself.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href={`/studio-explore/${studio._id}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to Studio
            </Link>
            <Link href="/studio-explore" className={buttonVariants()}>
              Explore Studios
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-section">
      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Edit Studio
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Update the details of “{studio.title}”.
            </p>
          </div>
          <Link
            href={`/studio-explore/${studio._id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Back to Studio
          </Link>
        </header>

        <EditStudioExplore
          studio={studio}
          defaultOpen
          onSaved={() => {
            router.push(`/studio-explore/${studio._id}`);
            router.refresh();
          }}
        />
      </section>
    </main>
  );
}
