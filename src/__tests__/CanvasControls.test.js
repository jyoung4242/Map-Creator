import { render, screen } from "@testing-library/react"
import React from "react"
import CnvControls from "../components/CnvControls"
import 

test("Header Renders", () => {
  render(<CnvControls />)
  const linkElement = screen.getByText(/Canvas Controls.0/i)
  expect(linkElement).toBeInTheDocument()
})
