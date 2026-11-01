"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault()
        // TODO: POST to the real newsletter endpoint when the API is available.
        setSubscribed(true)
        setEmail("")
      }}
    >
      <div className="flex gap-2">
        <Input
          type="email"
          required
          aria-label="Email address"
          placeholder="Your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-9 border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500"
        />
        <Button
          type="submit"
          className="h-9 shrink-0 bg-red-600 text-white hover:bg-red-600/90"
        >
          Subscribe
        </Button>
      </div>
      {subscribed && (
        <p className="mt-2 text-xs text-red-400" role="status">
          Thanks for subscribing — see you in your inbox!
        </p>
      )}
    </form>
  )
}

export { NewsletterForm }
