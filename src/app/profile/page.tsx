import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  IdCardIcon,
  MailIcon,
} from "lucide-react"

import { auth } from "@/lib/auth"
import { buttonVariants } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

export default async function ProfilePage() {
  // Reading headers makes this request dynamic — no need to connect explicitly.
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  const { user } = session
  const initials = user.name?.charAt(0)?.toUpperCase() ?? "U"

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Avatar header */}
          <div className="flex items-center gap-5">
            <Avatar className="size-20 ring-4 ring-red-600/30">
              {user.image ? (
                <AvatarImage
                  src={user.image}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <AvatarFallback className="bg-red-600 text-xl text-white">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-3xl font-semibold tracking-tight text-gray-900">
                {user.name}
              </h1>
              <p className="mt-1 truncate text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Account details */}
          <dl className="mt-8 divide-y divide-gray-200 border-t border-gray-200 text-sm">
            <div className="flex items-center gap-3 py-4">
              <MailIcon className="h-4 w-4 shrink-0 text-red-600" />
              <dt className="w-32 shrink-0 text-gray-500">Email</dt>
              <dd className="min-w-0 flex-1 truncate text-gray-900">
                {user.email}
              </dd>
            </div>
            <div className="flex items-center gap-3 py-4">
              <IdCardIcon className="h-4 w-4 shrink-0 text-red-600" />
              <dt className="w-32 shrink-0 text-gray-500">User ID</dt>
              <dd className="min-w-0 flex-1 truncate font-mono text-xs text-gray-900">
                {user.id}
              </dd>
            </div>
            <div className="flex items-center gap-3 py-4">
              <CalendarDaysIcon className="h-4 w-4 shrink-0 text-red-600" />
              <dt className="w-32 shrink-0 text-gray-500">Member since</dt>
              <dd className="min-w-0 flex-1 truncate text-gray-900">
                {user.createdAt ? formatDateTime(user.createdAt) : "—"}
              </dd>
            </div>
          </dl>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studio-explore"
              className={buttonVariants({
                className: "bg-red-600 text-white hover:bg-red-600/90",
              })}
            >
              Explore Studios
            </Link>
            <Link
              href="/add-studio"
              className={buttonVariants({ variant: "outline" })}
            >
              List Your Studio
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Manage your account details from here. More profile options are coming
          soon.
        </p>
      </section>
    </main>
  )
}
