"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CountryCard from "@/components/country-card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import LoadingScreen from "@/components/loading-screen"
import { SiteHeader } from "@/components/site-header"

interface Country {
  name: {
    common: string
    official: string
  }
  cca3: string
  flags: {
    png: string
    svg: string
    alt?: string
  }
  capital?: string[]
  region: string
  subregion?: string
  population: number
  languages?: Record<string, string>
}

export default function Favorites() {
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setUser(data.session.user)
        fetchFavorites(data.session.user.id)
      } else {
        // Redirect to login if not logged in
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  // Fetch user's favorite countries
  const fetchFavorites = async (userId: string) => {
    try {
      // Get favorite country codes from Supabase
      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select("country_code")
        .eq("user_id", userId)

      if (favoritesError) throw favoritesError

      if (favoritesData && favoritesData.length > 0) {
        // Get country codes array
        const countryCodes = favoritesData.map((fav) => fav.country_code)

        // Fetch country details from REST Countries API
        const countriesPromises = countryCodes.map(async (code) => {
          const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
          if (!response.ok) return null
          const data = await response.json()
          return data[0]
        })

        const countriesData = await Promise.all(countriesPromises)
        setFavoriteCountries(countriesData.filter(Boolean))
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
      toast({
        title: "Error",
        description: "Failed to load favorite countries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Remove country from favorites
  const removeFromFavorites = async (countryCode: string) => {
    try {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("country_code", countryCode)

      if (error) throw error

      // Update state to remove the country
      setFavoriteCountries(favoriteCountries.filter((country) => country.cca3 !== countryCode))

      toast({
        title: "Removed from favorites",
        description: "Country has been removed from your favorites",
      })
    } catch (error) {
      console.error("Error removing from favorites:", error)
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (loading) {
    return <LoadingScreen message="Loading your favorites..." />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Button variant="outline" onClick={() => router.push("/countries")} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Countries
            </Button>
            <h1 className="text-3xl font-bold">My Favorite Countries</h1>
          </div>
        </div>

        {favoriteCountries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteCountries.map((country) => (
              <CountryCard
                key={country.cca3}
                country={country}
                isFavorite={true}
                onToggleFavorite={() => removeFromFavorites(country.cca3)}
                onViewDetails={() => router.push(`/countries/${country.cca3}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">You haven't added any countries to your favorites yet</p>
            <Button onClick={() => router.push("/countries")}>Explore Countries</Button>
          </div>
        )}
      </div>
    </div>
  )
}
