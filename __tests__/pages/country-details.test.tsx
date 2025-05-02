import { render, screen, waitFor, fireEvent } from "../test-utils"
import CountryDetail from "@/app/countries/[code]/page"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { mockCountryDetails } from "../test-utils"
import { act } from "react" // Import from react instead of react-dom/test-utils

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
      single: jest.fn(),
    }),
  },
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe("Country Detail Page", () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockCountryDetails),
    })
  })

  it("renders loading screen initially", async () => {
    // Mock implementation to ensure loading state is visible
    jest.spyOn(global, "fetch").mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockCountryDetails),
            } as Response)
          }, 100),
        ),
    )

    render(<CountryDetail params={{ code: "USA" }} />)

    // Check for loading indicator - use a more specific query
    expect(screen.getByTestId("loading-screen")).toBeInTheDocument()
  })

  it("renders country details after loading", async () => {
    render(<CountryDetail params={{ code: "USA" }} />)

    // Wait for the country details to load and check for basic details
    await waitFor(() => {
      // Use getAllByText and check the first instance
      const headings = screen.getAllByRole("heading")
      const unitedStatesHeading = headings.find((h) => h.textContent?.includes("United States"))
      expect(unitedStatesHeading).toBeInTheDocument()
    })

    // Check for other details
    await waitFor(() => {
      expect(screen.getByText(/Washington, D.C./i)).toBeInTheDocument()
      expect(screen.getByText(/329,484,123/i)).toBeInTheDocument()
      expect(screen.getByText(/English/i)).toBeInTheDocument()
    })
  })

  it("displays tabs with different sections", async () => {
    render(<CountryDetail params={{ code: "USA" }} />)

    // Wait for the country details to load
    await waitFor(() => {
      const headings = screen.getAllByRole("heading")
      const unitedStatesHeading = headings.find((h) => h.textContent?.includes("United States"))
      expect(unitedStatesHeading).toBeInTheDocument()
    })

    // Check if tabs are present
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /Details/i })).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: /Neighboring Countries/i })).toBeInTheDocument()
    })

    // Check content in Details tab
    await waitFor(() => {
      expect(screen.getByText("General Information")).toBeInTheDocument()
    })

    // Switch to Neighboring Countries tab
    await act(async () => {
      fireEvent.click(screen.getByRole("tab", { name: /Neighboring Countries/i }))
    })

    // Check content in Neighboring Countries tab
    await waitFor(() => {
      expect(screen.getByText("Neighboring Countries")).toBeInTheDocument()
    })
  })

  it("handles API error gracefully", async () => {
    // Mock a failed API call
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"))

    render(<CountryDetail params={{ code: "USA" }} />)

    // Wait for the error state
    await waitFor(() => {
      const notFoundText = screen.getByText("Country not found")
      expect(notFoundText).toBeInTheDocument()
    })

    // Check if back button is present
    expect(screen.getByText(/Back to Countries/i)).toBeInTheDocument()
  })
})
