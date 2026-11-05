"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type DeleteStudioDialogProps = {
  /** Backing studio id/slug the parent knows about; falls back to URL param. */
  studioId?: string;
};

const DeleteStudioDialog = ({ studioId }: DeleteStudioDialogProps) => {
  const params = useParams<{ id: string }>();
  // Prefer the explicit prop — StudioDetails hands us the studio's id/slug;
  // dropping to the route param keeps older call sites working.
  const id = studioId ?? params.id;
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  /* ---------- DELETE /api/studios/:id ---------- */
  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/studios/${id}`, {
        method: "DELETE",
        // Explicit per spec: sends the HTTPOnly JWT cookie with the request.
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Studio deleted successfully.");
        router.push("/studio-explore");
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => null);
      toast.error(data?.message ?? `Delete failed (${res.status}). Please try again.`);
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
            disabled={deleting}
            className="border-red-600/30 text-red-600 dark:text-red-500 hover:bg-red-600/10 hover:text-red-600"
          >
            {deleting ? (
              <LoaderCircleIcon
                data-icon="inline-start"
                className="animate-spin"
              />
            ) : (
              <Trash2Icon data-icon="inline-start" />
            )}
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            studio listing from your backend.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
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
};

export default DeleteStudioDialog;
