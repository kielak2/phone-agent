"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, ArrowRight } from "lucide-react"
import { tryCatch } from "@/lib/tryCatch"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const submitContactMessage = useMutation(api.contactMessage.submitContactMessage)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    setLoading(true)
    const formData = new FormData(form)
    const name = String(formData.get('name') || '')
    const email = String(formData.get('email') || '')
    const shopWebsiteUrlValue = formData.get('shop_website_url')
    const messageValue = formData.get('message')

    const { error } = await tryCatch(
      submitContactMessage({
        name,
        email,
        shopWebsiteUrl: shopWebsiteUrlValue ? String(shopWebsiteUrlValue) : undefined,
        message: messageValue ? String(messageValue) : undefined,
      })
    )
    setLoading(false)
    if (!error) {
      setSubmitted(true)
      form.reset()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo-128.png" 
              alt="VoxAgent" 
              width={128}
              height={128}
              className="h-14 w-14"
            />
            <span className="text-2xl font-extrabold text-slate-900">
              Vox<span className="text-teal-600">Agent</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="rounded-md bg-teal-600 font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-sm active:scale-98 active:shadow-none">
                  Zaloguj się
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="rounded-md bg-teal-600 font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-sm active:scale-98 active:shadow-none">
                  Przejdź do panelu
                </Button>
              </Link>
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        
        <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
          Telefoniczny agent AI<br />dla e‑commerce
        </h1>
        
        <p className="mt-6 text-lg text-slate-600 md:text-xl">
          Odbiera połączenia, pomaga klientom i zwiększa sprzedaż.<br />
        </p>

        <div className="mt-10">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="h-12 rounded-md bg-teal-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-teal-700 hover:shadow-md active:scale-98 active:shadow-sm">
                Zaloguj się
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="h-12 rounded-md bg-teal-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-teal-700 hover:shadow-md active:scale-98 active:shadow-sm">
                Przejdź do panelu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Contact Section */}
      <section id="zainteresowany" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="overflow-hidden rounded-lg border-2 border-slate-200 shadow-xl">
          <div className="grid gap-0 md:grid-cols-2">
            {/* Left side - Info */}
            <div className="border-b-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-8 md:border-b-0 md:border-r-2 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  Nie masz konta, ale jesteś zainteresowany?
                </h2>
                <p className="mt-4 text-slate-700">
                  Zadzwoń do naszego agenta telefonicznego i dowiedz się więcej o naszym produkcie.
                </p>

                <div className="mt-6 rounded-lg border-2 border-teal-200 bg-white p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-teal-50 p-2 shadow-sm ring-1 ring-teal-100">
                      <Phone className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Zadzwoń teraz</p>
                      <a 
                        href="tel:+48123456789" 
                        className="text-lg font-bold text-slate-900 hover:text-teal-600"
                      >
                        +48 123 456 789
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-sm text-slate-600">
                  <p>✓ Agent AI dostępny 24/7</p>
                  <p>✓ Panel z nagraniami i transkryptami</p>
                  <p>✓ Pierwszy miesiąc za darmo</p>
                </div>
              </div>

            {/* Right side - Form */}
            <div className="relative bg-white p-8 md:p-10">
                <h3 className="text-xl font-semibold text-slate-900">
                  Lub wypełnij formularz
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Odezwiemy się w ciągu 1–2 dni roboczych.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  {submitted ? (
                    <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-center text-sm text-teal-800">
                      ✓ Dziękujemy! Odezwiemy się wkrótce.
                    </div>
                  ) : (
                    <>
                      <div>
                        <Input
                          name="name"
                          placeholder="Imię i nazwisko"
                          className="h-11 border-slate-200 bg-slate-50/50 shadow-sm focus:bg-white"
                          required
                          onInvalid={(e) => {
                            e.currentTarget.setCustomValidity('Proszę wypełnić to pole')
                          }}
                          onChange={(e) => {
                            e.currentTarget.setCustomValidity('')
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          name="email"
                          type="email"
                          placeholder="E‑mail do kontaktu"
                          className="h-11 border-slate-200 bg-slate-50/50 shadow-sm focus:bg-white"
                          required
                          onInvalid={(e) => {
                            if (e.currentTarget.validity.valueMissing) {
                              e.currentTarget.setCustomValidity('Proszę wypełnić to pole')
                            } else if (e.currentTarget.validity.typeMismatch) {
                              e.currentTarget.setCustomValidity('Proszę podać prawidłowy adres e-mail')
                            }
                          }}
                          onChange={(e) => {
                            e.currentTarget.setCustomValidity('')
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          name="shop_website_url"
                          placeholder="Link do sklepu internetowego (opcjonalne)"
                          className="h-11 border-slate-200 bg-slate-50/50 shadow-sm focus:bg-white"
                        />
                      </div>
                      <div>
                        <Textarea
                          name="message"
                          placeholder="Jak możemy pomóc? (opcjonalne)"
                          maxLength={2000}
                          className="min-h-[100px] border-slate-200 bg-slate-50/50 shadow-sm focus:bg-white"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-11 w-full rounded-md bg-teal-600 font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-sm active:scale-98 active:shadow-none disabled:active:scale-100"
                      >
                        {loading ? "Wysyłanie..." : "Wyślij"}
                      </Button>
                    </>
                  )}
                </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-600">
          <span>© {new Date().getFullYear()} VoxAgent</span>
        </div>
      </footer>
    </main>
  )
}
