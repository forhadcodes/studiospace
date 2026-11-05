"use client"
import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoaderCircleIcon, UserPlusIcon } from "lucide-react"
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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { describeOAuthError } from "@/lib/oauth-errors"

export default function SignUpPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  /**
   * Google OAuth failures: BetterAuth redirects back here with
   * `?error=<code>` — surface it as a toast and clean the URL. Paired with
   * `errorCallbackURL: "/signup"` on the Google sign-in call below.
   */
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    if (!error) return
    toast.error(describeOAuthError(error))
    params.delete("error")
    params.delete("error_description")
    const remaining = params.toString()
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${remaining ? `?${remaining}` : ""}`
    )
  }, [])

  const handleEmailSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)

    const formData = new FormData(e.currentTarget)
    const form = Object.fromEntries(formData.entries()) as {
      name: string
      email: string
      password: string
      image?: string
    }

    // Password policy before hitting the API: 8+ chars (covers the 6+
    // requirement) with both upper and lower case letters.
    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password)
    ) {
      setPending(false)
      toast.error(
        "Password must be 8+ characters with upper and lower case letters."
      )
      return
    }

    const toastId = toast.loading("Creating your account…")

    // image is optional — only send it when the user filled something in.
    const { data, error: signUpError } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      ...(form.image ? { image: form.image } : {}),
    })

    if (signUpError) {
      toast.error(
        signUpError.message ??
          "Could not create your account. Please try again.",
        { id: toastId },
      )
      setPending(false)
      return
    }

    // The account is created, but per spec register hands the user to the
    // login page to sign in explicitly.
    if (data) {
      toast.success("Account created!", {
        id: toastId,
        description: "You can now log in with your new credentials.",
      })
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-6 mx-auto w-full max-w-sm px-6 py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Join StudioSpace to book and host studios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp}>
            <FieldGroup>
              {/* Google only, per product spec. Must be configured
                  server-side (GOOGLE_CLIENT_ID / SECRET). */}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  disabled={googlePending}
                  onClick={async () => {
                    setGooglePending(true)

                    const { error } = await authClient.signIn.social({
                      provider: "google",
                      // New (or newly linked) Google users land on the home
                      // page. `<JwtCookieSync />` in the root layout mints
                      // the HTTPOnly JWT cookie on arrival.
                      callbackURL: "/",
                      // On OAuth failure, come back here (?error=...) so the
                      // user sees an actionable toast instead of BetterAuth's
                      // default error URL.
                      errorCallbackURL: "/signup",
                    })

                    if (error) {
                      setGooglePending(false)
                      toast.error(
                        error.message ??
                          "Google sign-in is unavailable right now. Please try again.",
                      )
                    }
                  }}
                >
                  {googlePending ? (
                    <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {googlePending ? "Redirecting to Google…" : "Sign up with Google"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with email
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Forhad Hussain"
                  required
                  autoComplete="name"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="image">
                  Image URL <span className="text-gray-400">(optional)</span>
                </FieldLabel>
                <Input
                  id="image"
                  type="url"
                  name="image"
                  placeholder="https://example.com/avatar.jpg"
                  autoComplete="url"
                />
              </Field>

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
                  <span className="ml-auto text-xs text-muted-foreground">
                    Min. 8 chars, upper + lower case
                  </span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </Field>
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? (
                    <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
                  ) : (
                    <UserPlusIcon data-icon="inline-start" />
                  )}
                  {pending ? "Creating account…" : "Sign Up"}
                </Button>
                <FieldDescription className="text-center">
                  Have an account? <Link href="/login">Log in</Link>
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
