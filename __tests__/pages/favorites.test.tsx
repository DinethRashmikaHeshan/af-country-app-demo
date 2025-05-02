import { render, waitFor } from "../test-utils"
import Favorites from "@/app/favorites/page"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { mockCountries, mockFavorites } from "../test-utils"
import { act } from "react"

// Mock the modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    }),
  },
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe("Favorites Page", () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    // Mock logged in user
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: "user-123", email: "test@example.com" },
        },
      },
    })

    // Mock favorites data
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: mockFavorites,
          error: null,
        }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
          }),
        }),
      }),
    })

    // Mock country data fetch
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes("USA")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockCountries[0]]),
        })
      } else if (url.includes("DEU")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockCountries[1]]),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    })
  })

  it("redirects to login if user is not logged in", async () => {
    // Mock no user logged in
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } })

    await act(async () => {
      render(<Favorites />)
    })

    // Check if router.push was called with '/login'
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/login")
    })
  })
})
