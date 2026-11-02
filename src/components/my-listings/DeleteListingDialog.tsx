"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";

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
import { Button } from "@/components/ui/button";

interface DeleteListingDialogProps {
  studioId: string;
  studioTitle: string;
  /** Called after the studio was deleted so the page can drop the row. */
  onDeleted: (id: string) => void;
}

// Confirmation modal for deleting one of the user's OWN studios.
// Only fires DELETE /api/studios/:id after the user confirms.
export default function DeleteListingDialog({
  studioId,
  studioTitle,
  onDeleted,
}: DeleteListingDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);

      const res = await fetch(`/api/studios/${studioId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(
          `"${studioTitle}" was deleted from your listings.`,
        );
        onDeleted(studioId);
        return;
      }

      const data = await res.json().catch(() => null);
      toast.error(
        data?.message ?? `Delete failed (${res.status}). Please try again.`,
      );
    } catch {
      toast.error("Network error — could not reach the server.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon data-icon="inline-start" />
            Delete
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{studioTitle}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The studio listing will be
            permanently removed from MongoDB.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Keep it</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white hover:bg-red-600/90"
          >
            {deleting ? (
              <LoaderCircleIcon
                data-icon="inline-start"
                className="animate-spin"
              />
            ) : (
              <Trash2Icon data-icon="inline-start" />
            )}
            {deleting ? "Deleting…" : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
