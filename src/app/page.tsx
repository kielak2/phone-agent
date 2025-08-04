"use client"

import Link from "next/link"
import { useState } from "react"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Headphones, PlayCircle, ArrowRight, PhoneCall, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const data = Object.fromEntries(new FormData(form).entries())
    setLoading(true)
    try {
      // TODO: send to your API or webhook
      await new Promise((r) => setTimeout(r, 700))
      setSubmitted(true)
      form.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl border border-teal-200 bg-teal-600 p-2 shadow-sm">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              AI Phone Hub
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-slate-700 hover:text-teal-700">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-teal-600 text-white hover:bg-teal-700">
                  Create account
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline" className="border-slate-300 text-slate-800 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">
                  Go to dashboard
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "ml-2 h-9 w-9 ring-2 ring-teal-100 border border-white shadow-sm",
                  },
                }}
              />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="mx-auto grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              For e‑commerce teams
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
              Turn your store’s phone number into a 24/7 AI agent
            </h1>
            <p className="mt-3 text-slate-700">
              Answers calls, helps customers, and can take orders. Fast setup. No missed calls.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button className="h-11 bg-teal-600 px-6 text-white hover:bg-teal-700">
                    Start pilot
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" className="h-11 border-slate-300 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">
                    Sign in
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard">
                  <Button className="h-11 bg-teal-600 px-6 text-white hover:bg-teal-700">
                    Open dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </SignedIn>

              <a href="#contact" className="text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900 sm:self-center">
                Talk to us
              </a>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              If you discovered us via outreach or referral, use the contact form below to coordinate a pilot.
            </p>
          </div>

          {/* AI Call Example card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-2">
                  <Headphones className="h-5 w-5 text-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">AI Call Example</p>
                  <p className="text-xs text-slate-600">Support + Order capture</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm text-slate-700">
                  “Hello! I can track your order or place a new one. What can I help you with today?”
                </p>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <MiniStat icon={<CheckCircle2 className="h-4 w-4 text-teal-700" />} label="Pickup" value="~1s" />
                <MiniStat icon={<PhoneCall className="h-4 w-4 text-slate-700" />} label="Handled" value="Tier‑1" />
                <MiniStat icon={<Phone className="h-4 w-4 text-teal-700" />} label="Orders" value="+20%" />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href="/demo">
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Listen to example
                  </Button>
                </Link>
                {/* Option 1: link to a tel: demo number */}
                <a href="tel:+15551234567" className="w-full">
                  <Button variant="outline" className="w-full border-slate-300 text-slate-800 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">
                    <Phone className="mr-2 h-5 w-5" />
                    Call the agent
                  </Button>
                </a>
                {/* Option 2: if you have a web call widget, trigger it here instead */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick value props (kept minimal) */}
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="grid gap-5 md:grid-cols-3">
          <ValueCard title="No missed calls" desc="Instant pickup 24/7—capture support and sales reliably." />
          <ValueCard title="Order by phone" desc="Take orders, verify info, and send confirmations automatically." />
          <ValueCard title="Simple to adopt" desc="Fast setup. View transcripts and metrics in your dashboard." />
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="mx-auto max-w-6xl px-5 pb-16">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Partner or have questions?</h2>
              <p className="mt-2 text-slate-600">
                If you want to explore a pilot, integrations, or co‑selling—send a quick note.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• 2‑week pilot available</li>
                <li>• Dashboard with transcripts and metrics</li>
                <li>• Call recording controls and PII redaction</li>
              </ul>
            </div>
            <form onSubmit={onSubmit} className="grid gap-3">
              {submitted ? (
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
                  Thanks—We’ll get back to you shortly.
                </div>
              ) : (
                <>
                  <Input name="name" placeholder="Your name" className="bg-white" required />
                  <Input name="email" type="email" placeholder="Work email" className="bg-white" required />
                  <Input name="company" placeholder="Company" className="bg-white" />
                  <Textarea name="message" placeholder="How can we help?" className="min-h-[100px] bg-white" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">We’ll reply within 1–2 business days.</span>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-teal-600 text-white hover:bg-teal-700"
                    >
                      {loading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-sm text-slate-600">
          <span>© {new Date().getFullYear()} AI Phone Hub</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* Small components */

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">{label}</span>
        {icon}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  )
}