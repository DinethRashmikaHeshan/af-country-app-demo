"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CountryMapProps {
    lat: number
    lng: number
    name: string
    className?: string
}

export default function CountryMap({ lat, lng, name, className = "h-[300px] w-full" }: CountryMapProps) {
    const [mapUrl, setMapUrl] = useState<string>("")

    useEffect(() => {
        // Create a static map URL using OpenStreetMap
        const zoom = 4
        const width = 800
        const height = 500

        // Use OpenStreetMap static map service
        const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},red`

        setMapUrl(url)
    }, [lat, lng])

    return (
        <div className={`relative ${className} overflow-hidden rounded-md`}>
            {mapUrl ? (
                <div className="relative w-full h-full">
                    <Image
                        src={mapUrl || "/placeholder.svg"}
                        alt={`Map showing location of ${name}`}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/80 text-xs p-1 rounded">© OpenStreetMap contributors</div>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">Loading map...</div>
            )}
        </div>
    )
}
