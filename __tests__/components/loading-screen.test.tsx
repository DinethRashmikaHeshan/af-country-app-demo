import { render, screen } from "../test-utils"
import LoadingScreen from "@/components/loading-screen"

describe("LoadingScreen Component", () => {
  it("renders with default message", () => {
    render(<LoadingScreen />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("renders with custom message", () => {
    render(<LoadingScreen message="Custom loading message" />)
    expect(screen.getByText("Custom loading message")).toBeInTheDocument()
  })
})
