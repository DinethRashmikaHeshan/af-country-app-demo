"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MapPin, Users, Globe, Languages, Clock, Car, Flag, DollarSign, Globe2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import LoadingScreen from "@/components/loading-screen"
import { SiteHeader } from "@/components/site-header"
import CountryMap from "@/components/country-map"

interface Country {
  name: {
    common: string
    official: string
    nativeName?: Record<string, { official: string; common: string }>
  }
  cca3: string
  cca2: string
  flags: {
    png: string
    svg: string
    alt?: string
  }
  coatOfArms?: {
    png?: string
    svg?: string
  }
  capital?: string[]
  region: string
  subregion?: string
  population: number
  languages?: Record<string, string>
  borders?: string[]
  currencies?: Record<string, { name: string; symbol: string }>
  area?: number
  latlng?: [number, number]
  timezones?: string[]
  continents?: string[]
  car?: {
    signs?: string[]
    side?: string
  }
  tld?: string[]
  unMember?: boolean
  independent?: boolean
  gini?: Record<string, number>
  demonyms?: Record<string, { f: string; m: string }>
  maps?: {
    googleMaps?: string
    openStreetMaps?: string
  }
  startOfWeek?: string
  capitalInfo?: {
    latlng?: [number, number]
  }
}

export default function CountryDetail({ params }: { params: { code: string } }) {
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { code } = params

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setUser(data.session.user)
        checkIfFavorite(data.session.user.id, code)
      }
    }

    checkUser()
  }, [code])

  // Fetch country details
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(
            `https://restcountries.com/v3.1/alpha/${code}?fields=name,cca3,cca2,flags,coatOfArms,capital,region,subregion,population,languages,borders,currencies,area,latlng,timezones,continents,car,tld,unMember,independent,gini,demonyms,maps,startOfWeek,capitalInfo`,
        )
        if (!response.ok) throw new Error("Failed to fetch country details")

        const data = await response.json()
        setCountry(data)
      } catch (error) {
        console.error("Error fetching country details:", error)
        toast({
          title: "Error",
          description: "Failed to load country details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [code, toast])

  // Check if country is in user's favorites
  const checkIfFavorite = async (userId: string, countryCode: string) => {
    try {
      const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", userId)
          .eq("country_code", countryCode)
          .single()

      if (error && error.code !== "PGRST116") throw error

      setIsFavorite(!!data)
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  // Toggle favorite status
  const toggleFavorite = async () => {
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
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("country_code", code)

        if (error) throw error

        setIsFavorite(false)
        toast({
          title: "Removed from favorites",
          description: "Country has been removed from your favorites",
        })
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert([{ user_id: user.id, country_code: code }])

        if (error) throw error

        setIsFavorite(true)
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

  if (loading) {
    return <LoadingScreen message="Loading country details..." />
  }

  if (!country) {
    return (
        <div className="flex flex-col min-h-screen">
          <SiteHeader />
          <div className="container mx-auto px-4 py-12 flex flex-col items-center min-h-[50vh]">
            <p className="text-lg mb-4">Country not found</p>
            <Button onClick={() => router.push("/countries")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Countries
            </Button>
          </div>
        </div>
    )
  }

  // Format population with commas
  const formatPopulation = (population: number) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Get languages as an array
  const languagesArray = country.languages ? Object.values(country.languages) : []

  // Get native name if available
  const nativeName = country.name.nativeName
      ? Object.values(country.name.nativeName)[0]?.common || country.name.common
      : country.name.common

  // Get demonyms if available
  const demonyms = country.demonyms ? Object.values(country.demonyms)[0] : null

  return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />

        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={() => router.push("/countries")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Countries
            </Button>

            <Button variant={isFavorite ? "default" : "outline"} onClick={toggleFavorite}>
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-[3/2] shadow-lg rounded-lg overflow-hidden">
                <Image
                    src={country.flags.svg || country.flags.png}
                    alt={country.flags.alt || `Flag of ${country.name.common}`}
                    fill
                    className="object-cover"
                    priority
                />
              </div>

              {country.coatOfArms?.svg && (
                  <div className="relative w-full aspect-[1/1] max-h-40 shadow-lg rounded-lg overflow-hidden bg-white flex items-center justify-center p-4">
                    <div className="relative h-full w-full">
                      <Image
                          src={country.coatOfArms.svg || "/placeholder.svg"}
                          alt={`Coat of arms of ${country.name.common}`}
                          fill
                          className="object-contain"
                      />
                    </div>
                  </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{country.name.common}</h1>
              <p className="text-xl text-muted-foreground mb-4">{country.name.official}</p>

              {nativeName !== country.name.common && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Native name:</strong> {nativeName}
                  </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                  <strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}
                </span>
                </div>

                <div className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                  <strong>Region:</strong> {country.region} {country.subregion ? `(${country.subregion})` : ""}
                </span>
                </div>

                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                  <strong>Population:</strong> {formatPopulation(country.population)}
                </span>
                </div>

                <div className="flex items-center">
                  <Languages className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                  <strong>Languages:</strong> {languagesArray.length > 0 ? languagesArray.join(", ") : "N/A"}
                </span>
                </div>

                <div className="flex items-center">
                  <Globe2 className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                  <strong>Continent:</strong> {country.continents?.join(", ") || "N/A"}
                </span>
                </div>

                <div className="flex items-center">
                  <Flag className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                  <strong>Country Code:</strong> {country.cca2}
                </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {country.independent !== undefined && (
                    <Badge variant={country.independent ? "default" : "outline"}>
                      {country.independent ? "Independent" : "Dependent"}
                    </Badge>
                )}

                {country.unMember !== undefined && (
                    <Badge variant={country.unMember ? "default" : "outline"}>
                      {country.unMember ? "UN Member" : "Not UN Member"}
                    </Badge>
                )}

                {country.car?.side && <Badge variant="outline">Drives on the {country.car.side}</Badge>}
              </div>

              {country.maps?.googleMaps && (
                  <div className="mb-6">
                    <a
                        href={country.maps.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Google Maps
                    </a>
                  </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="details" className="mb-8">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              {/*<TabsTrigger value="map">Map</TabsTrigger>*/}
              <TabsTrigger value="neighbors">Neighboring Countries</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {country.area && (
                        <div>
                          <h3 className="font-semibold mb-2">Area</h3>
                          <p>{country.area.toLocaleString()} km²</p>
                        </div>
                    )}

                    {country.tld && country.tld.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Top Level Domains</h3>
                          <div className="flex flex-wrap gap-2">
                            {country.tld.map((domain) => (
                                <Badge key={domain} variant="outline">
                                  {domain}
                                </Badge>
                            ))}
                          </div>
                        </div>
                    )}

                    {country.timezones && country.timezones.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Timezones</h3>
                          <div className="flex flex-wrap gap-2">
                            {country.timezones.map((timezone) => (
                                <Badge key={timezone} variant="outline">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {timezone}
                                </Badge>
                            ))}
                          </div>
                        </div>
                    )}

                    {country.car?.signs && country.car.signs.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Car Signs</h3>
                          <div className="flex flex-wrap gap-2">
                            {country.car.signs.map((sign) => (
                                <Badge key={sign} variant="outline">
                                  <Car className="mr-1 h-3 w-3" />
                                  {sign}
                                </Badge>
                            ))}
                          </div>
                        </div>
                    )}

                    {demonyms && (
                        <div>
                          <h3 className="font-semibold mb-2">Demonyms</h3>
                          <p>
                            <span className="mr-4">Male: {demonyms.m}</span>
                            <span>Female: {demonyms.f}</span>
                          </p>
                        </div>
                    )}

                    {country.startOfWeek && (
                        <div>
                          <h3 className="font-semibold mb-2">Start of Week</h3>
                          <p className="capitalize">{country.startOfWeek}</p>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {country.currencies && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Currencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(country.currencies).map(([code, currency]) => (
                            <div key={code} className="flex items-center p-3 border rounded-md">
                              <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{currency.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {code} {currency.symbol && `(${currency.symbol})`}
                                </p>
                              </div>
                            </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
              )}

              {country.gini && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Gini Index</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(country.gini).map(([year, value]) => (
                            <div key={year} className="flex items-center justify-between">
                              <span>Year {year}:</span>
                              <div className="flex items-center">
                                <div className="w-48 h-3 bg-muted rounded-full overflow-hidden mr-3">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
                                </div>
                                <span className="font-medium">{value}%</span>
                              </div>
                            </div>
                        ))}
                        <p className="text-xs text-muted-foreground mt-2">
                          The Gini coefficient measures income inequality (0% = perfect equality, 100% = perfect inequality)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
              )}
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  {country.latlng && country.latlng.length === 2 ? (
                      <div className="h-[500px] w-full rounded-md overflow-hidden border">
                        <CountryMap
                            lat={country.latlng[0]}
                            lng={country.latlng[1]}
                            name={country.name.common}
                            className="h-full w-full"
                        />
                      </div>
                  ) : (
                      <p>Map coordinates not available for this country.</p>
                  )}

                  {country.maps && (
                      <div className="mt-4 flex flex-wrap gap-4">
                        {country.maps.googleMaps && (
                            <a
                                href={country.maps.googleMaps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary hover:underline"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              View on Google Maps
                            </a>
                        )}
                        {country.maps.openStreetMaps && (
                            <a
                                href={country.maps.openStreetMaps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary hover:underline"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              View on OpenStreetMap
                            </a>
                        )}
                      </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="neighbors">
              <Card>
                <CardHeader>
                  <CardTitle>Neighboring Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  {country.borders && country.borders.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {country.borders.map((border) => (
                            <Button
                                key={border}
                                variant="outline"
                                className="h-auto py-2 justify-start"
                                onClick={() => router.push(`/countries/${border}`)}
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              {border}
                            </Button>
                        ))}
                      </div>
                  ) : (
                      <p>This country has no land borders with other countries.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
