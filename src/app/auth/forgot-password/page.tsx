
"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { useAuth } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2, Mail, ArrowLeft, Send, ShieldCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const auth = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      setError(err.message || "Could not send reset link. Check your email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0714] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />

      <Card className="w-full max-w-md glass-panel border-0 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center pt-10 px-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {sent ? <ShieldCheck className="w-8 h-8 text-green-500" /> : <Mail className="w-8 h-8 text-primary" />}
          </div>
          <CardTitle className="text-3xl font-headline font-bold gradient-text">
            {sent ? "Check Inbox" : "Recovery Mode"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {sent 
              ? `We've sent a magic link to ${email}. Check your spam folder if you don't see it.` 
              : "Lost your key? No worries, we'll help you secure your access."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          {!sent ? (
            <>
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Registered Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-panel h-12 pl-11 rounded-xl border-white/5 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full h-14 rounded-2xl text-lg font-headline bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95" 
                  disabled={loading || !email}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  {loading ? "Broadcasting Link..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Click the link in the email to set a new password. Once done, you can return here to login.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pb-10 pt-4 flex flex-col items-center gap-4">
          <Link href="/auth/login" className="flex items-center gap-2 text-sm text-muted-foreground font-bold hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
