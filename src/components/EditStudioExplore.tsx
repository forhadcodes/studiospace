"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { LoaderCircleIcon, PencilIcon, SaveIcon, XIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  isCategorySlug,
  type CategorySlug,
} from "@/lib/constants";

/* ---------- types ---------- */

// Shape of the studio coming from your API
// (numbers may arrive as strings from Mongo, gallery/amenities as arrays or comma strings).
export type Studio = {
  _id: string;
  title: string;
  category: string;
  city: string;
  hourlyRate: number | string;
  securityDeposit: number | string;
  address: string;
  maxCapacity: number | string;
  image: string;
  gallery?: string[] | string;
  amenities?: string[] | string;
  overview: string;
};

// Form values are kept as strings so inputs stay controlled.
type FormValues = {
  title: string;
  category: CategorySlug;
  city: string;
  hourlyRate: string;
  securityDeposit: string;
  address: string;
  maxCapacity: string;
  image: string;
  gallery: string;
  amenities: string;
  overview: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

// Payload you will send to your API.
export type UpdateStudioPayload = {
  title: string;
  category: CategorySlug;
  city: string;
  hourlyRate: number;
  securityDeposit: number;
  address: string;
  maxCapacity: number;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
};

type EditStudioExploreProps = {
  studio: Studio;
  /** Optional: called after a successful save (e.g. router.refresh()). */
  onSaved?: () => void;
};

/* ---------- helpers ---------- */

const FIELD_CLASS = "h-10 text-sm";
const SELECT_FIELD_CLASS = "h-10 w-full text-sm";

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

// The API may return gallery/amenities as an array OR a comma-separated string.
const listToText = (value: unknown): string => {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return "";
};

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const studioToValues = (studio: Studio): FormValues => ({
  title: studio.title ?? "",
  category: isCategorySlug(studio.category) ? studio.category : CATEGORY_SLUGS[0],
  city: studio.city ?? "",
  hourlyRate: String(studio.hourlyRate ?? ""),
  securityDeposit: String(studio.securityDeposit ?? ""),
  address: studio.address ?? "",
  maxCapacity: String(studio.maxCapacity ?? ""),
  image: studio.image ?? "",
  gallery: listToText(studio.gallery),
  amenities: listToText(studio.amenities),
  overview: studio.overview ?? "",
});

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.title.trim()) errors.title = "Studio name is required.";
  if (!values.category) errors.category = "Please choose a category.";
  if (!values.city.trim()) errors.city = "City is required.";

  const rate = Number(values.hourlyRate);
  if (values.hourlyRate === "" || Number.isNaN(rate) || rate < 0)
    errors.hourlyRate = "Enter a valid hourly rate.";

  const deposit = Number(values.securityDeposit);
  if (
    values.securityDeposit === "" ||
    Number.isNaN(deposit) ||
    deposit < 0
  )
    errors.securityDeposit = "Enter a valid security deposit.";

  if (!values.address.trim()) errors.address = "Street address is required.";

  const capacity = Number(values.maxCapacity);
  if (
    values.maxCapacity === "" ||
    !Number.isInteger(capacity) ||
    capacity < 1
  )
    errors.maxCapacity = "Capacity must be a whole number of at least 1.";

  if (!values.image.trim()) errors.image = "Cover image URL is required.";
  else if (!isValidUrl(values.image.trim()))
    errors.image = "Enter a valid URL.";

  const gallery = toList(values.gallery);
  if (gallery.length > 4) errors.gallery = "You can add up to 4 gallery URLs.";
  else if (gallery.some((url) => !isValidUrl(url)))
    errors.gallery = "Every gallery entry must be a valid URL.";

  if (toList(values.amenities).length === 0)
    errors.amenities = "Add at least one amenity.";

  if (!values.overview.trim()) errors.overview = "Description is required.";

  return errors;
};

/* ---------- field wrapper ---------- */

type ReviewFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

const ReviewField = ({
  label,
  htmlFor,
  error,
  hint,
  children,
}: ReviewFieldProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {hint && !error ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
    {error ? (
      <p role="alert" className="text-xs text-red-600 dark:text-red-500">
        {error}
      </p>
    ) : null}
  </div>
);

/* ---------- component ---------- */

const EditStudioExplore = ({ studio, onSaved }: EditStudioExploreProps) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(() => studioToValues(studio));
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // clear that field's error as the user fixes it
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleOpenChange = (next: boolean) => {
    if (submitting) return; // don't close mid-request
    setOpen(next);
    if (next) {
      // Always start the form fresh from the latest studio data
      // (the prop is refreshed by the page after a successful save).
      setValues(studioToValues(studio));
      setErrors({});
      setFormError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: UpdateStudioPayload = {
      title: values.title.trim(),
      category: values.category,
      city: values.city.trim(),
      hourlyRate: Number(values.hourlyRate),
      securityDeposit: Number(values.securityDeposit),
      address: values.address.trim(),
      maxCapacity: Number(values.maxCapacity),
      image: values.image.trim(),
      // Backend stores these as arrays (validated by src/lib/studios.ts).
      gallery: toList(values.gallery),
      amenities: toList(values.amenities),
      overview: values.overview.trim(),
    };

    setSubmitting(true);
    try {
      // PUT /api/studios/:id — _id goes only in the URL; the body has every other field.
      const res = await fetch(`/api/studios/${studio._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        // Zod failures (400) come back as { message, errors: { field: [msg] } }
        // — surface them on the matching inputs instead of one blob.
        if (data?.errors && typeof data.errors === "object") {
          const serverErrors: FormErrors = {};
          for (const [field, messages] of Object.entries(data.errors)) {
            const first = Array.isArray(messages) ? messages[0] : messages;
            if (first) serverErrors[field as keyof FormValues] = String(first);
          }
          if (Object.keys(serverErrors).length > 0) {
            setErrors(serverErrors);
            throw new Error(
              "Please fix the highlighted fields and try again.",
            );
          }
        }
        throw new Error(data?.message ?? "Failed to update studio.");
      }

      toast.success("Studio updated successfully.");
      setOpen(false);
      onSaved?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" className="text-foreground">
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Studio</DialogTitle>
          <DialogDescription>
            Update your studio details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-5">
            {formError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
              >
                {formError}
              </div>
            ) : null}

            {/* Studio name */}
            <ReviewField
              label="Studio Name"
              htmlFor="title"
              error={errors.title}
            >
              <Input
                id="title"
                name="title"
                placeholder="e.g. Golden Hour Photo Loft"
                value={values.title}
                onChange={(e) => setField("title", e.target.value)}
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
                  onChange={(e) =>
                    setField("category", e.target.value as CategorySlug)
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
                  onChange={(e) => setField("city", e.target.value)}
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
                  onChange={(e) => setField("hourlyRate", e.target.value)}
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
                  onChange={(e) => setField("securityDeposit", e.target.value)}
                  className={FIELD_CLASS}
                  aria-invalid={Boolean(errors.securityDeposit)}
                />
              </ReviewField>
            </div>

            {/* Street address */}
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
                onChange={(e) => setField("address", e.target.value)}
                className={FIELD_CLASS}
                aria-invalid={Boolean(errors.address)}
              />
            </ReviewField>

            {/* Max capacity */}
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
                onChange={(e) => setField("maxCapacity", e.target.value)}
                className={FIELD_CLASS}
                aria-invalid={Boolean(errors.maxCapacity)}
              />
            </ReviewField>

            {/* Cover image */}
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
                onChange={(e) => setField("image", e.target.value)}
                className={FIELD_CLASS}
                aria-invalid={Boolean(errors.image)}
              />
            </ReviewField>

            {/* Gallery */}
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
                onChange={(e) => setField("gallery", e.target.value)}
                className={FIELD_CLASS}
                aria-invalid={Boolean(errors.gallery)}
              />
            </ReviewField>

            {/* Amenities */}
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
                onChange={(e) => setField("amenities", e.target.value)}
                className={FIELD_CLASS}
                aria-invalid={Boolean(errors.amenities)}
              />
            </ReviewField>

            {/* Description */}
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
                onChange={(e) => setField("overview", e.target.value)}
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
              onClick={() => handleOpenChange(false)}
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
                <SaveIcon data-icon="inline-start" />
              )}
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudioExplore;
