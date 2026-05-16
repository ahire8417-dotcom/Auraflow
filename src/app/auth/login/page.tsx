"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useAuth } from "@/firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2, Mail, Lock, Chrome, ArrowRight, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) {
      setError("AuraFlow Authentication is initializing. Please wait.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your access.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError("AuraFlow Authentication is initializing. Please wait.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      await signInWithPopup(auth, provider)
      router.push("/")
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/api-key-not-valid') {
        setError("Firebase API Key is missing or invalid. Please update src/firebase/config.ts.")
      } else {
        setError("Google authentication was interrupted. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0714] relative overflow-hidden">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />

      <Card className="w-full max-w-md glass-panel border-0 rounded-[3rem] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
        
        <CardHeader className="space-y-2 text-center pt-12">
          <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30 animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline font-bold gradient-text">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">Resume your journey to academic excellence.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-10">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-bold uppercase tracking-tight">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Academic Email</Label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-panel h-14 pl-12 rounded-2xl border-white/5 focus:border-primary/50 transition-all bg-white/5 text-sm"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Security Key</Label>
                <Link href="/auth/forgot-password" className="text-[10px] text-primary font-black hover:underline uppercase tracking-widest">Recovery?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="glass-panel h-14 pl-12 rounded-2xl border-white/5 focus:border-primary/50 transition-all bg-white/5 text-sm"
                />
              </div>
            </div>
            <Button 
              className="w-full h-16 rounded-[2rem] text-xl font-headline bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all active:scale-95 mt-4" 
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <ArrowRight className="w-6 h-6 mr-3" />}
              {loading ? "Authenticating..." : "Login to Command"}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#0A0714] px-4 text-muted-foreground font-black tracking-[0.3em]">Neural Link</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-16 rounded-[2rem] border-white/10 hover:bg-white/5 font-black transition-all gap-4 text-sm"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Chrome className="w-6 h-6 text-primary" />}
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="pb-12 pt-6 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            New Scholar?{" "}
            <Link href="/auth/signup" className="text-primary font-black hover:underline">Register Access</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
