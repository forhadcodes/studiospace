"use client";

import Link from "next/link";
import { toast } from "sonner"
import { useState } from "react";
import {
  CheckCircle2Icon,
  LoaderCircleIcon,
  PlusSquareIcon,
  XIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORY_FORM_LABELS,
  CATEGORY_SLUGS,
  type CategorySlug,
} from "@/lib/constants";
import { API_URL } from "@/lib/api-url";


// The backend must share the page's host (localhost vs 127.0.0.1 counts as a
// different host), otherwise the browser won't send the HTTPOnly JWT cookie
// that it verifies. Configure the origin via NEXT_PUBLIC_API_URL.

const FIELD_CLASS = "h-10 text-sm";
const SELECT_FIELD_CLASS = "h-10 w-full";

type FormValues = {
  title: string
  category: CategorySlug
  address: string
  city: string
  hourlyRate: string
  securityDeposit: string
  maxCapacity: string
  image: string
  gallery: string
  amenities: string
  overview: string
};

type FieldErrors =
  Partial<Record<keyof FormValues, string>> & Record<string, string | undefined>;

const EMPTY_FORM: FormValues = {
  title: "",
  category: "photo-studio",
  address: "",
  city: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  image: "",
  gallery: "",
  amenities: "",
  overview: "",
};

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}

  if (values.title.trim().length < 5) errors.title = "Title must be at least 5 characters."
  if (values.address.trim().length < 5) errors.address = "Address looks too short."
  if (values.city.trim().length < 2) errors.city = "City looks too short."

  const hourlyRate = Number(values.hourlyRate)
  if (!values.hourlyRate || !Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    errors.hourlyRate = "Hourly rate must be a positive number."
  }

  const securityDeposit = Number(values.securityDeposit)
  if (
    !values.securityDeposit ||
    !Number.isFinite(securityDeposit) ||
    securityDeposit < 0
  ) {
    errors.securityDeposit = "Security deposit cannot be negative."
  }

  const maxCapacity = Number(values.maxCapacity)
  if (
    !values.maxCapacity ||
    !Number.isInteger(maxCapacity) ||
    maxCapacity <= 0
  ) {
    errors.maxCapacity = "Max capacity must be a whole number above 0."
  }

  if (!isValidUrl(values.image.trim())) {
    errors.image = "Image URL must be a valid URL."
  }

  const gallery = parseList(values.gallery)
  if (gallery.length > 4) {
    errors.gallery = "Up to 4 gallery URLs are allowed."
  } else if (values.gallery.trim() && !gallery.every(isValidUrl)) {
    errors.gallery = "Every gallery URL must be a valid URL."
  }

  const amenities = parseList(values.amenities)
  if (amenities.length === 0) errors.amenities = "Add at least one amenity."

  if (values.overview.trim().length < 20) {
    errors.overview = "Overview must be at least 20 characters."
  }

  return errors
}

function ReviewField({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="font-bold">
        {label}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-red-600 dark:text-red-500">{error}</p> : null}
    </div>
  )
}

export default function AddStudioPage() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<{ slug: string; title: string } | null>(
    null
  )

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function reset() {
    setValues(EMPTY_FORM)
    setErrors({})
    setFormError(null)
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const clientErrors = validate(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    setSubmitting(true)
    try {
      // Single submit to the backend — payload typed properly.
      const response = await fetch(`${API_URL}/add-studio`, {
        method: "POST",
        // Sends the HTTPOnly `studiospace_jwt` cookie that the server verifies.
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          category: values.category,
          address: values.address.trim(),
          city: values.city.trim(),
          hourlyRate: Number(values.hourlyRate),
          securityDeposit: Number(values.securityDeposit),
          maxCapacity: Number(values.maxCapacity),
          image: values.image.trim(),
          // backend keeps these as comma-separated strings
          gallery: values.gallery.trim(),
          amenities: values.amenities.trim(),
          overview: values.overview.trim(),
        }),
      })

      const data = await response.json().catch(() => null)

      if (response.ok) {
        const title = data?.studio?.title ?? values.title
        setCreated({ slug: data?.studio?.slug ?? data?.studio?._id ?? "", title })
        toast.success("Studio added successfully!", {
          description: `“${title}” is now live.`,
        })
        return
      }

      if (response.status === 400 && data?.errors) {
        const fieldErrors: FieldErrors = {}
        for (const [field, messages] of Object.entries<string[]>(
          data.errors as Record<string, string[]>
        )) {
          fieldErrors[field] = messages[0]
        }
        setErrors(fieldErrors)
        setFormError("Please fix the highlighted fields and try again.")
        toast.error("Please fix the highlighted fields.", {
          description: "A few details are missing or invalid.",
        })
        return
      }

      const message =
        data?.message ?? "Something went wrong. Please try again."
      setFormError(message)
      toast.error(message)
    } catch {
      const message =
        "Network error — could not reach the server. Please try again."
      setFormError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <main className="flex-1 bg-section">
      <section className="mx-auto w-full max-w-5xl px-6 py-14 md:py-20">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Add New Studio
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            List your creative space in under two minutes — renters only see
            completed listings, so fill out every field carefully.
          </p>
        </header>

        {created ? (
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-sm md:p-12">
            <CheckCircle2Icon className="mx-auto size-12 text-red-600 dark:text-red-500" />
            <h2 className="mt-4 text-2xl font-bold">
              Studio added successfully!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              “{created.title}” is now live and ready to take bookings.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="outline" size="lg" onClick={reset}>
                Add Another Studio
              </Button>
              <Link
                href="/"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-red-600 text-white hover:bg-red-600/90",
                })}
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-sm md:p-10"
          >
            <div className="flex flex-col gap-5">
              {formError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                >
                  {formError}
                </div>
              ) : null}

              {/* Studio name — full width */}
              <ReviewField label="Studio Name" htmlFor="title" error={errors.title}>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Golden Hour Photo Loft"
                  value={values.title}
                  onChange={(event) => setField("title", event.target.value)}
                  className={FIELD_CLASS}
                  aria-invalid={Boolean(errors.title)}
                />
              </ReviewField>

              {/* Category | City */}
              <div className="grid gap-5 sm:grid-cols-2">
                <ReviewField
                  label="Category"
                  htmlFor="category"
                  error={errors.category}
                >
                  <NativeSelect
                    id="category"
                    name="category"
                    value={values.category}
                    onChange={(event) =>
                      setField("category", event.target.value as CategorySlug)
                    }
                    className={SELECT_FIELD_CLASS}
                    aria-invalid={Boolean(errors.category)}
                  >
                    {CATEGORY_SLUGS.map((slug) => (
                      <NativeSelectOption key={slug} value={slug}>
                        {CATEGORY_FORM_LABELS[slug]}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </ReviewField>

                <ReviewField label="City" htmlFor="city" error={errors.city}>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g. Brooklyn, NY"
                    value={values.city}
                    onChange={(event) => setField("city", event.target.value)}
                    className={FIELD_CLASS}
                    aria-invalid={Boolean(errors.city)}
                  />
                </ReviewField>
              </div>

              {/* Hourly rate | Security deposit */}
              <div className="grid gap-5 sm:grid-cols-2">
                <ReviewField
                  label="Hourly Rate (USD)"
                  htmlFor="hourlyRate"
                  error={errors.hourlyRate}
                >
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 45"
                    value={values.hourlyRate}
                    onChange={(event) =>
                      setField("hourlyRate", event.target.value)
                    }
                    className={FIELD_CLASS}
                    aria-invalid={Boolean(errors.hourlyRate)}
                  />
                </ReviewField>

                <ReviewField
                  label="Security Deposit (USD)"
                  htmlFor="securityDeposit"
                  error={errors.securityDeposit}
                >
                  <Input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 100"
                    value={values.securityDeposit}
                    onChange={(event) =>
                      setField("securityDeposit", event.target.value)
                    }
                    className={FIELD_CLASS}
                    aria-invalid={Boolean(errors.securityDeposit)}
                  />
                </ReviewField>
              </div>

              {/* Street address — full width */}
              <ReviewField
                label="Street Address"
                htmlFor="address"
                error={errors.address}
              >
                <Input
                  id="address"
                  name="address"
                  placeholder="e.g. 214 Rapid Street"
                  value={values.address}
                  onChange={(event) => setField("address", event.target.value)}
                  className={FIELD_CLASS}
                  aria-invalid={Boolean(errors.address)}
                />
              </ReviewField>

              {/* Max capacity — full width */}
              <ReviewField
                label="Max Capacity"
                htmlFor="maxCapacity"
                error={errors.maxCapacity}
              >
                <Input
                  id="maxCapacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 12"
                  value={values.maxCapacity}
                  onChange={(event) =>
                    setField("maxCapacity", event.target.value)
                  }
                  className={FIELD_CLASS}
                  aria-invalid={Boolean(errors.maxCapacity)}
                />
              </ReviewField>

              {/* Cover image — full width */}
              <ReviewField
                label="Cover Image URL"
                htmlFor="image"
                error={errors.image}
              >
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/studio.jpg"
                  value={values.image}
                  onChange={(event) => setField("image", event.target.value)}
                  className={FIELD_CLASS}
                  aria-invalid={Boolean(errors.image)}
                />
              </ReviewField>

              {/* Gallery — full width */}
              <ReviewField
                label="Gallery Image URLs"
                htmlFor="gallery"
                error={errors.gallery}
                hint="Optional — separate up to 4 URLs with commas."
              >
                <Input
                  id="gallery"
                  name="gallery"
                  placeholder="https://…/shot-one.jpg, https://…/shot-two.jpg"
                  value={values.gallery}
                  onChange={(event) => setField("gallery", event.target.value)}
                  className={FIELD_CLASS}
                  aria-invalid={Boolean(errors.gallery)}
                />
              </ReviewField>

              {/* Amenities — full width */}
              <ReviewField
                label="Amenities"
                htmlFor="amenities"
                error={errors.amenities}
                hint="Separate with commas, e.g. Softbox lighting, Cyc wall, Dressing room."
              >
                <Input
                  id="amenities"
                  name="amenities"
                  placeholder="Softbox lighting, Cyc wall, Dressing room"
                  value={values.amenities}
                  onChange={(event) =>
                    setField("amenities", event.target.value)
                  }
                  className={FIELD_CLASS}
                  aria-invalid={Boolean(errors.amenities)}
                />
              </ReviewField>

              {/* Overview — full width */}
              <ReviewField
                label="Description"
                htmlFor="overview"
                error={errors.overview}
              >
                <Textarea
                  id="overview"
                  name="overview"
                  rows={5}
                  placeholder="Describe the studio, its gear and what it is best for…"
                  value={values.overview}
                  onChange={(event) =>
                    setField("overview", event.target.value)
                  }
                  className="min-h-32 text-sm"
                  aria-invalid={Boolean(errors.overview)}
                />
              </ReviewField>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={submitting}
                className="text-red-600 dark:text-red-500 hover:text-red-600"
                onClick={reset}
              >
                <XIcon data-icon="inline-start" />
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="bg-red-600 text-white hover:bg-red-600/90"
              >
                {submitting ? (
                  <LoaderCircleIcon
                    data-icon="inline-start"
                    className="animate-spin"
                  />
                ) : (
                  <PlusSquareIcon data-icon="inline-start" />
                )}
                {submitting ? "Adding Studio…" : "Add Studio"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
