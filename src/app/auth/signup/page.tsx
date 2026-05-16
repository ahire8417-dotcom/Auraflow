"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useAuth, useFirestore } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2, Mail, Lock, User, Chrome, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const auth = useAuth()
  const firestore = useFirestore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth || !firestore) {
      setError("Authentication service is not ready. Please refresh.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await updateProfile(userCredential.user, { displayName: formData.name })
      
      // Initialize UserStats in Firestore immediately
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: formData.name,
        photoURL: "",
        totalScore: 0,
        level: "Beginner",
        quizzesCompleted: 0,
        lastActive: serverTimestamp(),
      })

      router.push("/")
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!auth) {
      setError("Authentication service is not ready. Please refresh.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/")
    } catch (err: any) {
      setError("Google sign-up failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0714] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />

      <Card className="w-full max-w-md glass-panel border-0 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-2 text-center pt-10">
          <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary/20">
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold gradient-text">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">Join 10,000+ students mastering their future.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Alex Xavier" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-panel h-12 pl-11 rounded-xl border-white/5 focus:border-secondary/50 transition-all bg-white/5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-panel h-12 pl-11 rounded-xl border-white/5 focus:border-secondary/50 transition-all bg-white/5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="Minimum 6 characters" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="glass-panel h-12 pl-11 rounded-xl border-white/5 focus:border-secondary/50 transition-all bg-white/5"
                />
              </div>
            </div>
            <Button 
              className="w-full h-14 rounded-2xl text-lg font-headline bg-secondary hover:bg-secondary/90 shadow-xl shadow-secondary/20 transition-all active:scale-95" 
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
              {loading ? "Launching Account..." : "Join AuraFlow"}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0714] px-4 text-muted-foreground font-bold tracking-widest">Sign up with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 font-bold transition-all gap-3"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5 text-secondary" />}
            Google
          </Button>
        </CardContent>
        <CardFooter className="pb-10 pt-4 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Already a member?{" "}
            <Link href="/auth/login" className="text-secondary font-bold hover:underline">Login here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
