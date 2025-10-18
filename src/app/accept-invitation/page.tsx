'use client'

import * as React from 'react'
import { useSignUp, useUser } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, KeyRound, Loader2 } from 'lucide-react'
import { tryCatch } from '@/lib/tryCatch'

export default function Page() {
  const { isSignedIn, isLoaded: userLoaded } = useUser()
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Handle signed-in users visiting this page
  // This will also redirect the user once they finish the sign-up process
  React.useEffect(() => {
    if (isSignedIn) {
      router.replace('/dashboard')
    }
  }, [isSignedIn, router])

  // Get the token from the query params
  const token = useSearchParams().get('__clerk_ticket')

  // Show loading state while checking auth status
  if (!userLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
            <p className="text-lg text-slate-600">Ładowanie...</p>
          </div>
        </div>
      </main>
    )
  }

  // If the user is already signed in, avoid flashing this page while redirecting
  if (isSignedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
            <p className="text-lg text-slate-600">Przekierowywanie...</p>
          </div>
        </div>
      </main>
    )
  }

  // If there is no invitation token, restrict access to this page
  if (!token) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

        <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-lg border-2 border-red-200 bg-white p-8 shadow-xl">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-50 p-3 ring-2 ring-red-100">
                <UserPlus className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">
              Nieprawidłowe zaproszenie
            </h1>
            <p className="mt-3 text-left text-slate-600">
              Coś poszło nie tak. Upewnij się, że zaproszenie jest poprawe.
            </p>
            <div className="mt-6">
              <Link href="/">
                <Button className="w-full rounded-md bg-teal-600 font-semibold text-white shadow-md transition-all hover:bg-teal-700">
                  Powrót do strony głównej
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Check if passwords match
  const passwordsMatch = password === confirmPassword
  const canSubmit = password && confirmPassword && passwordsMatch && password.length >= 8

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isLoaded) return

    if (!passwordsMatch) {
      setError('Hasła nie są identyczne')
      return
    }

    setLoading(true)

    if (!token) {
      setError('Nieprawidłowe zaproszenie')
      setLoading(false)
      return
    }

    // Create a new sign-up with the supplied invitation token.
    const { data: signUpAttempt, error: signUpError } = await tryCatch(
      signUp.create({ strategy: 'ticket', ticket: token, password })
    )

    if (signUpError || !signUpAttempt) {
      console.error(JSON.stringify(signUpError, null, 2))
      setError('Wystąpił błąd podczas rejestracji. Sprawdź, czy hasło spełnia wymagania.')
      setLoading(false)
      return
    }

    if (signUpAttempt.status === 'complete') {
      const { error: activeError } = await tryCatch(
        setActive({ session: signUpAttempt.createdSessionId })
      )
      if (activeError) {
        console.error(JSON.stringify(activeError, null, 2))
        setError('Wystąpił problem z rejestracją. Spróbuj ponownie.')
      }
    } else {
      console.error(JSON.stringify(signUpAttempt, null, 2))
      setError('Wystąpił problem z rejestracją. Spróbuj ponownie.')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border-2 border-slate-200 bg-white p-8 shadow-xl">
            <div className="flex justify-center">
              <div className="rounded-full bg-teal-50 p-3 ring-2 ring-teal-100">
                <UserPlus className="h-8 w-8 text-teal-600" />
              </div>
            </div>

            <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">
              Witaj w AutoOdbiór!
            </h1>
            <p className="mt-2 text-center text-slate-600">
              Utwórz hasło, aby dokończyć rejestrację
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-slate-700">
                  <KeyRound className="h-4 w-4 text-teal-600" />
                  Hasło
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wprowadź silne hasło"
                  className="h-11 border-slate-200 bg-slate-50/50 shadow-sm focus:bg-white"
                  required
                  minLength={8}
                />
                <p className="text-xs text-slate-500">
                  Hasło musi mieć co najmniej 8 znaków
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-slate-700">
                  <KeyRound className="h-4 w-4 text-teal-600" />
                  Powtórz hasło
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="powtórz hasło"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Wprowadź hasło ponownie"
                  className={`h-11 border-slate-200 bg-slate-50/50 shadow-sm focus:bg-white ${
                    confirmPassword && !passwordsMatch ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                  required
                  minLength={8}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-600">
                    Hasła nie są identyczne
                  </p>
                )}
              </div>

              <div id="clerk-captcha" />

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !canSubmit}
                className="h-11 w-full rounded-md bg-teal-600 font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-sm active:scale-98 active:shadow-none disabled:active:scale-100"
              >
                {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}