"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, LogIn, MessageSquare, ShoppingCart, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LandingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Contact form submitted:", { email, message })
    setIsSubmitting(false)
    setIsContactOpen(false)
    setEmail("")
    setMessage("")

    // In a real app, you'd send this to your backend
    alert("Thank you for your message! We'll get back to you soon.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Phone Orders</span>
          </div>

          <Button variant="outline" className="gap-2">
            <LogIn className="h-4 w-4" />
            Customer Login
          </Button>
        </div>
      </header>

      {/* Hero Section - Two Column Layout */}
      <main className="container mx-auto px-4">
        <div className="py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text and CTAs */}
            <div className="flex flex-col">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Turn Phone Calls Into
                <span className="text-blue-600 block">Automatic Orders</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                Give your customers a phone number they can call to place orders. Our AI handles everything - from
                taking the order to collecting delivery details. Perfect for cash-on-delivery businesses.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Never miss a phone order again</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Collect customer details automatically</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Works 24/7 - even when you're sleeping</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2">
                      <Mail className="h-5 w-5" />
                      Get Started - Contact Us
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Contact Us</DialogTitle>
                      <DialogDescription>
                        Send us a message and we'll help you set up AI phone ordering for your business.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your business and how we can help..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsContactOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="lg" className="gap-2">
                  <LogIn className="h-5 w-5" />
                  Existing Customer Login
                </Button>
              </div>
            </div>

            {/* Right Column - Phone Demo Visual */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md border-2 border-blue-200 bg-white/80 backdrop-blur shadow-xl">
                <CardContent className="p-8">
                  <div className="relative">
                    {/* Phone Frame */}
                    <div className="bg-gray-900 rounded-3xl p-4 shadow-lg mx-auto max-w-[280px]">
                      {/* Phone Screen */}
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                        <div className="flex justify-center mb-6">
                          <Phone className="h-16 w-16 text-white/90" />
                        </div>

                        <h3 className="text-xl font-bold text-center mb-2">Try Our Demo</h3>
                        <p className="text-sm text-center text-white/80 mb-6">
                          Call now to experience our AI ordering system
                        </p>

                        <div className="bg-white/20 rounded-lg p-4 text-center backdrop-blur-sm">
                          <div className="text-2xl font-bold mb-1">+1 (555) 123-DEMO</div>
                          <div className="text-xs">Available 24/7</div>
                        </div>

                        <div className="mt-6 text-center">
                          <div className="inline-flex items-center justify-center bg-white/20 rounded-full px-3 py-1 text-xs backdrop-blur-sm">
                            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-green-400"></span>
                            Live Demo Available
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg">
                      <ShoppingCart className="h-6 w-6 text-yellow-900" />
                    </div>

                    <div className="absolute -bottom-2 -left-2 bg-green-400 rounded-full p-2 shadow-lg">
                      <CheckCircle className="h-5 w-5 text-green-900" />
                    </div>
                  </div>

                  {/* Demo Instructions */}
                  <div className="mt-8 text-center">
                    <h4 className="font-medium text-gray-900 mb-2">How It Works:</h4>
                    <ol className="text-sm text-gray-600 space-y-2 text-left list-decimal pl-5">
                      <li>Call the demo number</li>
                      <li>Our AI will answer and take your order</li>
                      <li>Try ordering products and providing delivery details</li>
                      <li>Experience how natural and efficient it feels</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="py-16 border-t border-blue-100">
          <h2 className="text-3xl font-bold text-center mb-12">How AI Phone Orders Helps Your Business</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Conversations</h3>
              <p className="text-gray-600 text-sm text-center">
                Natural voice AI that understands your customers and takes complete orders
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Order Management</h3>
              <p className="text-gray-600 text-sm text-center">
                Automatic order processing with customer details and delivery information
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600 text-sm text-center">
                Never miss an order - your AI assistant works around the clock
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>&copy; 2024 AI Phone Orders. All rights reserved.</p>
      </footer>
    </div>
  )
}
