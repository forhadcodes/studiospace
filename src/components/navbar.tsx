"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Aperture,
  CalendarCheckIcon,
  ChevronDown,
  LayoutDashboardIcon,
  ListIcon,
  LogOutIcon,
  Menu,
  PlusSquareIcon,
  UserIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studio-explore" },
  { label: "Add Studios", href: "/add-studio" },
  { label: "My-Booking", href: "/my-booking" },
  { label: "How It Works", href: "/how-it-work" },
  { label: "About Us", href: "#about" },
]

const menuItems = [
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { label: "Add New Studio", href: "/add-studio", icon: PlusSquareIcon },
  { label: "My Bookings", href: "/my-booking", icon: CalendarCheckIcon },
  { label: "My Studio Listings", href: "/my-listings", icon: ListIcon },
]

function NavLink({ label, href }: (typeof navLinks)[number]) {
  const pathname = usePathname()

  // Exact match for "/", prefix match for section routes so nested pages
  // (e.g. /studio-explore/123) still highlight their parent link.
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={`relative py-1 text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-red-600 after:transition-all after:content-[''] ${
        active
          ? "text-white after:z-10 after:w-full"
          : "text-white/70 after:w-0 hover:text-white hover:after:w-full"
      }`}
    >
      {label}
    </Link>
  )
}

function UserMenu({
  name,
  email,
  avatarSrc,
}: {
  name: string
  email?: string | null
  avatarSrc?: string | null
}) {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex cursor-pointer items-center gap-2 rounded-full p-1 pr-2 outline-none hover:bg-white/10 data-[popup-open]:bg-white/10"
        aria-label="Open user menu"
      >
        <Avatar className="ring-2 ring-red-600/60">
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} alt={name} referrerPolicy="no-referrer" />
          ) : (
            <AvatarFallback className="bg-red-600 text-white">
              {name?.charAt(0)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm font-medium text-white sm:inline">
          {name}
        </span>
        <ChevronDown className="hidden size-4 text-white/70 sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-1.5">
        {/* User identity */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="ring-2 ring-red-600/60">
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt={name} referrerPolicy="no-referrer" />
            ) : (
              <AvatarFallback className="bg-red-600 text-white">
                {name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {name}
            </p>
            {email && (
              <p className="truncate text-xs text-neutral-500">{email}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        {menuItems.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem
            key={label}
            render={<Link href={href} className="w-full" />}
            className="gap-2.5 rounded-md px-3 py-2"
          >
            <Icon className="text-neutral-500" />
            <span className="font-medium">{label}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="gap-2.5 rounded-md px-3 py-2"
        >
          <LogOutIcon />
          <span className="font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Navbar() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [name, email, avatarSrc] = [
    user?.name,
    user?.email,
    user?.image,
  ] as const

  async function handleMobileLogout() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white">
          <Aperture className="size-7" />
          <span className="text-2xl font-bold tracking-tight">StudioSpace</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu name={name ?? "User"} email={email} avatarSrc={avatarSrc} />
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-white hover:bg-white/10 hover:text-white",
                })}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({
                  variant: "default",
                  className:
                    "hidden bg-red-600 text-white hover:bg-red-600/90 sm:inline-flex",
                })}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/10 hover:text-white lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center gap-2 px-2 text-neutral-900">
                <Aperture className="size-6" />
                <span className="text-xl font-bold">StudioSpace</span>
              </div>

              {user && (
                <div className="mx-2 mt-4 flex items-center gap-3 rounded-lg bg-neutral-100 p-3">
                  <Avatar className="ring-2 ring-red-600/60">
                    {avatarSrc ? (
                      <AvatarImage
                        src={avatarSrc}
                        alt={name ?? "User"}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <AvatarFallback className="bg-red-600 text-white">
                        {name?.charAt(0)?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {name}
                    </p>
                    {email && (
                      <p className="truncate text-xs text-neutral-500">
                        {email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-1 px-2 pt-2">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.label}
                    render={<Link href={link.href} />}
                  >
                    <span className="block rounded-md px-2 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100">
                      {link.label}
                    </span>
                  </SheetClose>
                ))}
              </nav>

              {user && (
                <>
                  <nav className="flex flex-col gap-1 px-2 pt-3">
                    {menuItems.map(({ label, href, icon: Icon }) => (
                      <SheetClose
                        key={label}
                        render={<Link href={href} />}
                      >
                        <span className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100">
                          <Icon className="size-4 text-neutral-500" />
                          {label}
                        </span>
                      </SheetClose>
                    ))}
                  </nav>
                  <Button
                    variant="outline"
                    onClick={handleMobileLogout}
                    className="justify-start gap-2 border-red-200 px-4 text-red-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOutIcon className="size-4" />
                    Logout
                  </Button>
                </>
              )}

              {!user && (
                <div className="flex flex-col gap-2 px-2 pt-3">
                  <SheetClose
                    render={
                      <Link
                        href="/login"
                        className={buttonVariants({
                          variant: "outline",
                          className: "w-full",
                        })}
                      />
                    }
                  >
                    Login
                  </SheetClose>
                  <SheetClose
                    render={
                      <Link
                        href="/signup"
                        className={buttonVariants({
                          className: "w-full bg-red-600 text-white hover:bg-red-600/90",
                        })}
                      />
                    }
                  >
                    Sign Up
                  </SheetClose>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export { Navbar }
