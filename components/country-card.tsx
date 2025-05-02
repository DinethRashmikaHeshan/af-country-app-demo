"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from "lucide-react"

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
  population: number
}

interface CountryCardProps {
  country: Country
  isFavorite: boolean
  onToggleFavorite: () => void
  onViewDetails: () => void
}

export default function CountryCard({ country, isFavorite, onToggleFavorite, onViewDetails }: CountryCardProps) {
  // Format population with commas
  const formatPopulation = (population: number) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-40">
        <Image
          src={country.flags.svg || country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="flex-1 pt-6">
        <h2 className="text-xl font-bold mb-2 line-clamp-1">{country.name.common}</h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Region:</strong> {country.region}
          </p>
          <p>
            <strong>Population:</strong> {formatPopulation(country.population)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          <ExternalLink className="h-4 w-4 mr-2" /> Details
        </Button>

        <Button variant={isFavorite ? "default" : "outline"} size="sm" onClick={onToggleFavorite}>
          <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? "Saved" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  )
}
