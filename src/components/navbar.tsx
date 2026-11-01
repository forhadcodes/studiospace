"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Aperture,
  CalendarCheckIcon,
  ChevronDown,
  LayoutDashboardIcon,
  ListIcon,
  LogOutIcon,
  Menu,
  PlusSquareIcon,
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

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studio-explore" },
  { label: "Add Studios", href: "/add-studio" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
]

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "Add New Studio", href: "/studios/new", icon: PlusSquareIcon },
  { label: "My Studio Listings", href: "/my-studios", icon: ListIcon },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarCheckIcon },
]

/** Mock current user — replace with real auth state (e.g. useSession) when available. */
const currentUser: { name: string; avatarSrc: string } | null = null

function NavLink({ label, href }: (typeof navLinks)[number]) {
  const pathname = usePathname()
  const active = pathname === href

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

function UserMenu({ name, avatarSrc }: { name: string; avatarSrc?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full p-1 pr-2 outline-none hover:bg-white/10">
        <Avatar className="ring-2 ring-red-600/60">
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} alt={name} />
          ) : (
            <AvatarFallback className="bg-red-600 text-white">
              {name[0]?.toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="hidden text-sm font-medium text-white sm:inline">
          {name}
        </span>
        <ChevronDown className="hidden size-4 text-white/70 sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">Studio owner</p>
        </div>
        <DropdownMenuSeparator />
        {menuItems.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem key={label} className="gap-2.5 rounded-md px-3 py-2">
            <Icon className="text-neutral-500" />
            <Link href={href} className="font-medium">
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="gap-2.5 rounded-md px-3 py-2">
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Navbar() {
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
          {currentUser ? (
            <UserMenu
              name={currentUser.name}
              avatarSrc={currentUser.avatarSrc}
            />
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
                href="/register"
                className={buttonVariants({
                  variant: "default",
                  className:
                    "hidden bg-red-600 text-white hover:bg-red-600/90 sm:inline-flex",
                })}
              >
                Register
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
              <nav className="flex flex-col gap-1 px-2">
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
              <div className="flex flex-col gap-2 px-2">
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
                      href="/register"
                      className={buttonVariants({
                        className: "w-full bg-red-600 text-white hover:bg-red-600/90",
                      })}
                    />
                  }
                >
                  Register
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export { Navbar }
