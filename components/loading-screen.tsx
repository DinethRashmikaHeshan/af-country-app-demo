"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  const [loadingDots, setLoadingDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === "...") return "."
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50" data-testid="loading-screen">
        <div className="flex flex-col items-center justify-center space-y-6 p-4 text-center">
          <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
          >
            <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="text-primary relative w-16 h-16"
            >
              <Image src="/images/world-logo.png" alt="Countries Explorer Logo" fill className="object-contain" />
            </motion.div>
            <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10" />
            </motion.div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
          >
            <h2 className="text-xl font-medium">{message}</h2>
            <p className="text-muted-foreground">Exploring the world{loadingDots}</p>
          </motion.div>
        </div>
      </div>
  )
}

//
// import { LoadingSpinner } from "./loading-spinner"
//
// interface LoadingScreenProps {
//     message?: string
// }
//
// export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-[50vh] p-8" data-testid="loading-screen">
//             <LoadingSpinner size={40} />
//             <p className="mt-4 text-lg text-muted-foreground">{message}</p>
//         </div>
//     )
// }
