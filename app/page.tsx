"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Globe, MapPin, Search, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [featuredCountries, setFeaturedCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }

    const fetchFeaturedCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/alpha?codes=USA,FRA,JPN,AUS,BRA,EGY")
        if (response.ok) {
          const data = await response.json()
          setFeaturedCountries(data)
        }
      } catch (error) {
        console.error("Error fetching featured countries:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
    fetchFeaturedCountries()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-background pt-16 pb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Discover the World's Countries
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Explore detailed information about countries, their flags, populations, and more. Create an account to
                  save your favorite countries.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/countries">
                    <Button size="lg" className="gap-2">
                      <Search className="h-5 w-5" />
                      Start Exploring
                    </Button>
                  </Link>
                  {!user ? (
                    <Link href="/login">
                      <Button size="lg" variant="outline">
                        Sign In
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/favorites">
                      <Button size="lg" variant="outline" className="gap-2">
                        <Heart className="h-5 w-5" />
                        My Favorites
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10 rounded-lg" />
                <Image
                  src="/world.jpg?height=1080&width=1920"
                  alt="World Map"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  {/*<motion.div*/}
                  {/*  animate={{*/}
                  {/*    rotate: 360,*/}
                  {/*  }}*/}
                  {/*  transition={{*/}
                  {/*    duration: 60,*/}
                  {/*    repeat: Number.POSITIVE_INFINITY,*/}
                  {/*    ease: "linear",*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <Globe className="h-32 w-32 text-primary/80" strokeWidth={1} />*/}
                  {/*</motion.div>*/}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore Countries Like Never Before</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform provides comprehensive information about countries around the world.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div variants={item} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
                <p className="text-muted-foreground">
                  Easily search for countries by name or filter them by region to find exactly what you're looking for.
                </p>
              </motion.div>

              <motion.div variants={item} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
                <p className="text-muted-foreground">
                  Create an account to save your favorite countries and access them quickly anytime.
                </p>
              </motion.div>

              <motion.div variants={item} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Information</h3>
                <p className="text-muted-foreground">
                  Get comprehensive details about each country including population, languages, currencies, and more.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Countries Section */}
        {!loading && featuredCountries.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Countries</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Take a quick look at some of the countries you can explore in detail
                </p>
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              >
                {featuredCountries.map((country) => (
                  <motion.div
                    key={country.cca3}
                    variants={item}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-card rounded-lg overflow-hidden shadow-sm"
                  >
                    <Link href={`/countries/${country.cca3}`}>
                      <div className="aspect-[3/2] relative">
                        <Image
                          src={country.flags.svg || country.flags.png}
                          alt={country.flags.alt || `Flag of ${country.name.common}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-center truncate">{country.name.common}</h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center mt-10">
                <Link href="/countries">
                  <Button size="lg">View All Countries</Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-bold">Country Hunt</h2>
          </div>
          <p className="text-sm text-muted-foreground">SE3040 – Application Frameworks Assignment</p>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Country Hunt</p>
        </div>
      </footer>
    </div>
  )
}
