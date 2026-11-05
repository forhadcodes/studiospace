"use client"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogInIcon, LoaderCircleIcon, KeyRoundIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

/** Google logo (public domain mark, same asset shadcn uses). */
function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Where the user should land after signing in.
 *
 * "Desired route": pages that bounce here for auth can pass
 * `?redirect=/somewhere`, and it is honored for both email and Google sign-in
 * (falls back to "/"). Read from `window.location` instead of
 * `useSearchParams` so the page can be statically prerendered without a
 * Suspense boundary.
 */
function getRedirectTarget(): string {
  if (typeof window === "undefined") return "/"
  const params = new URLSearchParams(window.location.search)
  const redirect = params.get("redirect")
  // Only allow same-origin relative paths — never follow absolute URLs.
  if (redirect?.startsWith("/") && !redirect.startsWith("//")) return redirect
  return "/"
}

export default function LogInPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  // Forgot-password dialog state.
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotPending, setForgotPending] = useState(false)

  const handleEmailLogIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)

    const formData = new FormData(e.currentTarget)
    const user = Object.fromEntries(formData.entries()) as {
      email: string
      password: string
    }

    const toastId = toast.loading("Signing you in…")
    const { data, error: signInError } = await authClient.signIn.email({
      ...user,
    })

    if (signInError) {
      toast.error(
        signInError.message ?? "Could not sign you in. Please try again.",
        { id: toastId },
      )
      setPending(false)
      return
    }

    if (data) {
      // Mirror the new session into the HTTPOnly JWT cookie the write APIs
      // verify. Navigation waits for it so the first protected call carries it.
      await fetch("/api/auth/jwt", { method: "POST" }).catch(() => {})

      toast.success("Welcome back!", {
        id: toastId,
        description: "You're signed in — taking you there now.",
      })
      router.push(getRedirectTarget())
      router.refresh()
    }
  }

  const handleGoogleLogIn = async () => {
    setGooglePending(true)

    const { error } = await authClient.signIn.social({
      provider: "google",
      // After the Google round-trip better-auth lands the user here
      // directly — their desired route, or the home page.
      callbackURL: getRedirectTarget(),
    })

    if (error) {
      setGooglePending(false)
      toast.error(
        error.message ??
          "Google sign-in is unavailable right now. Please try again.",
      )
    }
    // On success the browser navigates to Google, so no state reset needed.
  }

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setForgotPending(true)

    const formData = new FormData(e.currentTarget)
    const { email } = Object.fromEntries(formData.entries()) as {
      email: string
    }

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/login",
    })
    setForgotPending(false)

    if (error) {
      toast.error(
        error.message ?? "Could not start the password reset. Try again."
      )
      return
    }

    // Same message for known and unknown accounts — never leak which
    // addresses are registered.
    toast.success("If that account exists, a reset link has been sent.", {
      description: "Check the email account linked to your StudioSpace login.",
    })
    setForgotOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 mx-auto w-full max-w-sm px-6 py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Log in to your StudioSpace account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogIn}>
            <FieldGroup>
              {/* Google only, per product spec. The provider must be
                  configured server-side (GOOGLE_CLIENT_ID / SECRET); if it is
                  missing, the API returns an error shown as a toast. */}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  disabled={googlePending}
                  onClick={handleGoogleLogIn}
                >
                  {googlePending ? (
                    <LoaderCircleIcon
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                  ) : (
                    <GoogleIcon />
                  )}
                  {googlePending ? "Redirecting to Google…" : "Login with Google"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with email
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                    <DialogTrigger
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                      title="Forgot your password?"
                    >
                      Forgot Password?
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Forgot your password?</DialogTitle>
                        <DialogDescription>
                          Enter the email you registered with and we&apos;ll
                          send you a reset link.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleForgotPassword}>
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="forgot-email">
                              Email
                            </FieldLabel>
                            <Input
                              id="forgot-email"
                              type="email"
                              name="email"
                              placeholder="m@example.com"
                              required
                              autoComplete="email"
                            />
                          </Field>
                          <Button type="submit" disabled={forgotPending}>
                            {forgotPending ? (
                              <LoaderCircleIcon
                                data-icon="inline-start"
                                className="animate-spin"
                              />
                            ) : (
                              <KeyRoundIcon data-icon="inline-start" />
                            )}
                            {forgotPending ? "Sending…" : "Send reset link"}
                          </Button>
                        </FieldGroup>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </Field>
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? (
                    <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
                  ) : (
                    <LogInIcon data-icon="inline-start" />
                  )}
                  {pending ? "Signing in…" : "Sign In"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign Up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
