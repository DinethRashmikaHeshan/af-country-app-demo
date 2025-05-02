"use client"

import { useState, useEffect } from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, Globe, LogOut, User, Menu } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export function SiteHeader() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }

    checkUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-white border-b py-4 sticky top-0 z-40">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
              src="/images/world-logo.png"
              alt="Countries Explorer Logo"
              width={28}
              height={28}
              className="text-primary"
          />
          <h1 className="text-xl font-bold">Country Hunt</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/countries">
            <Button variant="ghost">Explore Countries</Button>
          </Link>

          {user ? (
            <>
              <Link href="/favorites">
                <Button variant="ghost">
                  <Heart className="mr-2 h-4 w-4" /> Favorites
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.email ? user.email.split("@")[0] : "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                    {loading ? (
                      <>
                        <LoadingSpinner className="mr-2" size={16} />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/countries" className="w-full">
                  Explore Countries
                </Link>
              </DropdownMenuItem>

              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="w-full">
                      <Heart className="mr-2 h-4 w-4" /> Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                    {loading ? (
                      <>
                        <LoadingSpinner className="mr-2" size={16} />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login" className="w-full">
                    Sign In
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
