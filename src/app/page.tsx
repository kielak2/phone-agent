"use client"

import type React from "react"

import { useState } from "react"
import { Phone, ArrowRight, Mail, Globe, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LandingPage() {
  const { isSignedIn } = useUser()
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", { email, website })
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
      setWebsite("")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AI Phone Orders
              </h1>
            </div>
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-lg border-0",
                    userButtonPopoverActionButton: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Zaloguj się
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Automatyzacja sprzedaży telefonicznej</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              AI Phone Orders
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Zautomatyzuj przyjmowanie zamówień telefonicznych w swoim sklepie internetowym. Nasza sztuczna
              inteligencja obsłuży klientów 24/7, zwiększając Twoje sprzedaże.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {isSignedIn ? (
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                Przejdź do panelu
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  Zaloguj się do panelu
                </Button>
              </SignInButton>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  Jestem zainteresowany
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Rozpocznij współpracę
                  </DialogTitle>
                  <DialogDescription>
                    Podaj swoje dane, a skontaktujemy się z Tobą w sprawie wdrożenia AI Phone Orders w Twoim sklepie.
                  </DialogDescription>
                </DialogHeader>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        Adres email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="twoj@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-600" />
                        Strona sklepu internetowego
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://twojsklep.pl"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        required
                        className="focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      Wyślij zgłoszenie
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Zgłoszenie wysłane!</h3>
                    <p className="text-gray-600">Skontaktujemy się z Tobą wkrótce.</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dlaczego AI Phone Orders?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nasza platforma oferuje kompletne rozwiązanie do automatyzacji sprzedaży telefonicznej
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-blue-800">Obsługa 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  AI nigdy nie śpi. Twoi klienci mogą składać zamówienia o każdej porze dnia i nocy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-purple-800">Zwiększ sprzedaże</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  Automatyzacja pozwala obsłużyć więcej klientów jednocześnie, zwiększając przychody.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-emerald-800">Łatwa integracja</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  Szybkie wdrożenie z Twoim istniejącym sklepem internetowym bez zmian technicznych.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">AI Phone Orders</span>
          </div>
          <p className="text-gray-600">© 2024 AI Phone Orders. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  )
}
