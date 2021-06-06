import { render, screen } from "@testing-library/react"
import Header from "../components/Header"

test("Header Renders", () => {
  render(<Header />)
  const linkElement = screen.getByText(/Map Generator 2.0/i)
  expect(linkElement).toBeInTheDocument()
})

test("Header Links Save", () => {
  render(<Header />)
  const linkElement = screen.getByText(/Save Project/i)
  expect(linkElement).toBeInTheDocument()
})

test("Header Links Open", () => {
  render(<Header />)
  const linkElement = screen.getByText(/Open Project/i)
  expect(linkElement).toBeInTheDocument()
})

test("Header Links Export", () => {
  render(<Header />)
  const linkElement = screen.getByText(/Export Map/i)
  expect(linkElement).toBeInTheDocument()
})
