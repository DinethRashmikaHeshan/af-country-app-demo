import { render, screen, fireEvent } from "../test-utils"
import CountryCard from "@/components/country-card"
import { mockCountries } from "../test-utils"

describe("CountryCard Component", () => {
  const mockCountry = mockCountries[0]
  const mockOnToggleFavorite = jest.fn()
  const mockOnViewDetails = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders country information correctly", () => {
    render(
      <CountryCard
        country={mockCountry}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />,
    )

    // Check if country name is displayed
    expect(screen.getByText(mockCountry.name.common)).toBeInTheDocument()

    // Check if capital is displayed
    expect(screen.getByText(/Washington, D.C./i)).toBeInTheDocument()

    // Check if region is displayed
    expect(screen.getByText(/Americas/i)).toBeInTheDocument()

    // Check if population is displayed with formatting
    expect(screen.getByText(/329,484,123/i)).toBeInTheDocument()

    // Check if buttons are present
    expect(screen.getByText(/Details/i)).toBeInTheDocument()
    expect(screen.getByText(/Save/i)).toBeInTheDocument()
  })

  it('displays "Saved" when country is favorite', () => {
    render(
      <CountryCard
        country={mockCountry}
        isFavorite={true}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />,
    )

    expect(screen.getByText(/Saved/i)).toBeInTheDocument()
  })

  it("calls onToggleFavorite when favorite button is clicked", () => {
    render(
      <CountryCard
        country={mockCountry}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />,
    )

    fireEvent.click(screen.getByText(/Save/i))
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1)
  })

  it("calls onViewDetails when details button is clicked", () => {
    render(
      <CountryCard
        country={mockCountry}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />,
    )

    fireEvent.click(screen.getByText(/Details/i))
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1)
  })
})
