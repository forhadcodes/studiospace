"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    value: "booking",
    question: "How do I book a studio?",
    answer:
      "Head to Explore Studios, find a space that fits your production, open the listing, and choose your shoot date. Sign in, confirm the booking, and it lands in My Bookings straight away — no quotes and no waiting for approval.",
  },
  {
    value: "pricing",
    question: "How does hourly pricing work?",
    answer:
      "Every listing shows a clear hourly rate. You pay that rate for your booked time plus the refundable security deposit shown on the listing. The full amount is visible before you confirm, so there are no surprise fees at checkout.",
  },
  {
    value: "cancellation",
    question: "Can I cancel or change a booking?",
    answer:
      "Yes — cancellations are free within 24 hours of booking. After that, the host’s cancellation terms apply, so check the listing details before you confirm. You can review every booking from My Bookings.",
  },
  {
    value: "deposit",
    question: "What is the security deposit for?",
    answer:
      "The deposit covers unexpected damage during your session. It is fully refundable and is released after the shoot once the space has been checked by the host.",
  },
  {
    value: "trust",
    question: "How do I know the studios are legitimate?",
    answer:
      "Hosts and creators are identity-verified, and every listing includes real photos, amenities, capacity, location and a clear description. Reviews come only from completed bookings, so the feedback you read is genuine.",
  },
  {
    value: "hosts",
    question: "How do hosts get paid?",
    answer:
      "Hosts set their own hourly rate and security deposit, publish the listing from their dashboard, and receive payouts after each completed booking. Listing a space on StudioSpace is free.",
  },
  {
    value: "support",
    question: "What happens if something goes wrong on set?",
    answer:
      "Our support team is available around the clock. Every booking includes liability protection, and if equipment arrives faulty or missing, the booking is backed by full refund support.",
  },
]

function HowItWorksFaq() {
  return (
    <Accordion defaultValue={["booking"]} className="gap-3">
      {faqs.map(({ value, question, answer }) => (
        <AccordionItem
          key={value}
          value={value}
          className="rounded-xl border border-neutral-200 bg-white px-1 not-last:border-b"
        >
          <AccordionTrigger className="px-5 py-4 text-base font-bold text-neutral-900 hover:no-underline aria-expanded:text-red-600">
            {question}
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4 text-sm leading-relaxed text-neutral-600">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export { HowItWorksFaq }
