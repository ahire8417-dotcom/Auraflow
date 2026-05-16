
"use client"

import { useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { HeaderNav } from "@/components/shared/header-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Crown, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const getLevel = (score: number) => {
  if (score < 50) return "Beginner"
  if (score < 150) return "Learner"
  if (score < 300) return "Skilled"
  if (score < 500) return "Advanced"
  return "Master"
}

export default function Leaderboard() {
  const firestore = useFirestore()
  
  const leaderboardQuery = firestore ? query(
    collection(firestore, "users"),
    orderBy("totalScore", "desc"),
    limit(20)
  ) : null
  
  const { data: users, loading } = useCollection(leaderboardQuery)

  return (
    <div className="min-h-full p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <HeaderNav title="Global Arena" subtitle="Top Ranked Scholars" showBack={true} />

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white/5 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {users?.map((user: any, idx) => {
              const rank = idx + 1
              const isTopThree = rank <= 3
              
              return (
                <div key={user.uid} className={cn(
                  "glass-panel p-5 rounded-[2rem] flex items-center justify-between group transition-all relative overflow-hidden",
                  rank === 1 && "border-yellow-500/30 bg-yellow-500/5",
                  rank === 2 && "border-gray-400/30 bg-gray-400/5",
                  rank === 3 && "border-orange-500/30 bg-orange-500/5",
                )}>
                  {rank === 1 && <Crown className="absolute -right-4 -top-4 w-20 h-20 text-yellow-500/10 rotate-12" />}
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-8 flex justify-center">
                      {rank === 1 && <Crown className="w-6 h-6 text-yellow-500" />}
                      {rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                      {rank === 3 && <Medal className="w-6 h-6 text-orange-500" />}
                      {rank > 3 && <span className="text-sm font-bold text-muted-foreground">#{rank}</span>}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-white/10 group-hover:scale-105 transition-transform">
                        <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {user.displayName?.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-base">{user.displayName}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {getLevel(user.totalScore || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right relative z-10">
                    <p className="text-xl font-headline font-bold text-primary">{user.totalScore || 0}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">XP</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && (!users || users.length === 0) && (
          <div className="text-center py-20 glass-panel rounded-[3rem] space-y-4">
            <Star className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
            <p className="text-muted-foreground font-medium">The Arena is empty. Be the first to claim a rank!</p>
          </div>
        )}
      </div>
    </div>
  )
}
