import type React from "react"
import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"

// Create a custom render function that includes providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    )
  }

  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from testing-library
export * from "@testing-library/react"

// Override render method
export { customRender as render }

// Mock response data
export const mockCountries = [
  {
    name: {
      common: "United States",
      official: "United States of America",
    },
    cca3: "USA",
    flags: {
      png: "https://flagcdn.com/w320/us.png",
      svg: "https://flagcdn.com/us.svg",
      alt: "The flag of the United States of America",
    },
    capital: ["Washington, D.C."],
    region: "Americas",
    population: 329484123,
  },
  {
    name: {
      common: "Germany",
      official: "Federal Republic of Germany",
    },
    cca3: "DEU",
    flags: {
      png: "https://flagcdn.com/w320/de.png",
      svg: "https://flagcdn.com/de.svg",
      alt: "The flag of Germany",
    },
    capital: ["Berlin"],
    region: "Europe",
    population: 83240525,
  },
]

export const mockCountryDetails = {
  name: {
    common: "United States",
    official: "United States of America",
    nativeName: {
      eng: {
        official: "United States of America",
        common: "United States",
      },
    },
  },
  cca3: "USA",
  cca2: "US",
  flags: {
    png: "https://flagcdn.com/w320/us.png",
    svg: "https://flagcdn.com/us.svg",
    alt: "The flag of the United States of America",
  },
  coatOfArms: {
    png: "https://mainfacts.com/media/images/coats_of_arms/us.png",
    svg: "https://mainfacts.com/media/images/coats_of_arms/us.svg",
  },
  capital: ["Washington, D.C."],
  region: "Americas",
  subregion: "North America",
  population: 329484123,
  languages: {
    eng: "English",
  },
  borders: ["CAN", "MEX"],
  currencies: {
    USD: {
      name: "United States dollar",
      symbol: "$",
    },
  },
  area: 9372610,
  latlng: [38, -97],
  timezones: [
    "UTC-12:00",
    "UTC-11:00",
    "UTC-10:00",
    "UTC-09:00",
    "UTC-08:00",
    "UTC-07:00",
    "UTC-06:00",
    "UTC-05:00",
    "UTC-04:00",
  ],
  continents: ["North America"],
  car: {
    signs: ["USA"],
    side: "right",
  },
  tld: [".us"],
  unMember: true,
  independent: true,
  gini: {
    2018: 41.4,
  },
  demonyms: {
    eng: {
      f: "American",
      m: "American",
    },
  },
  maps: {
    googleMaps: "https://goo.gl/maps/e8M246zY4BSjkjAv6",
    openStreetMaps: "https://www.openstreetmap.org/relation/148838",
  },
  startOfWeek: "sunday",
  capitalInfo: {
    latlng: [38.89, -77.05],
  },
}

// Mock user data
export const mockUser = {
  id: "user-123",
  email: "test@example.com",
}

// Mock favorites data
export const mockFavorites = [
  { user_id: "user-123", country_code: "USA" },
  { user_id: "user-123", country_code: "DEU" },
]
