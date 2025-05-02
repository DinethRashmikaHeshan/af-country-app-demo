"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CountryCard from "@/components/country-card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import LoadingScreen from "@/components/loading-screen"
import { SiteHeader } from "@/components/site-header"

// Define types
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

export default function Countries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
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
      }
    }

    checkUser()
  }, [])

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        if (!response.ok) throw new Error("Failed to fetch countries")

        const data = await response.json()
        setCountries(data)
        setFilteredCountries(data)
      } catch (error) {
        console.error("Error fetching countries:", error)
        toast({
          title: "Error",
          description: "Failed to load countries. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [toast])

  // Fetch user's favorite countries
  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("favorites").select("country_code").eq("user_id", userId)

      if (error) throw error

      if (data) {
        setFavorites(data.map((fav) => fav.country_code))
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  // Filter countries based on search term and region
  useEffect(() => {
    let result = countries

    if (searchTerm) {
      result = result.filter((country) => country.name.common.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedRegion && selectedRegion !== "all") {
      result = result.filter((country) => country.region === selectedRegion)
    }

    setFilteredCountries(result)
  }, [searchTerm, selectedRegion, countries])

  // Toggle favorite status for a country
  const toggleFavorite = async (countryCode: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "default",
      })
      router.push("/login")
      return
    }

    try {
      if (favorites.includes(countryCode)) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("country_code", countryCode)

        if (error) throw error

        setFavorites(favorites.filter((code) => code !== countryCode))
        toast({
          title: "Removed from favorites",
          description: "Country has been removed from your favorites",
        })
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert([{ user_id: user.id, country_code: countryCode }])

        if (error) throw error

        setFavorites([...favorites, countryCode])
        toast({
          title: "Added to favorites",
          description: "Country has been added to your favorites",
        })
      }
    } catch (error) {
      console.error("Error updating favorites:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get unique regions for the filter dropdown
  const regions = [...new Set(countries.map((country) => country.region))].sort()

  if (loading) {
    return <LoadingScreen message="Discovering countries..." />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Countries Explorer</h1>

          {!user && <Button onClick={() => router.push("/login")}>Sign In to Save Favorites</Button>}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
              isFavorite={favorites.includes(country.cca3)}
              onToggleFavorite={() => toggleFavorite(country.cca3)}
              onViewDetails={() => router.push(`/countries/${country.cca3}`)}
            />
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No countries found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
