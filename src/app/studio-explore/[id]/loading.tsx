import { LoaderCircleIcon } from "lucide-react";

export default function StudioDetailsLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <span className="flex items-center gap-3 text-sm text-gray-500">
        <LoaderCircleIcon className="size-5 animate-spin text-red-600" />
        Loading studio…
      </span>
    </main>
  );
}
