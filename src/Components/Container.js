import React from "react"
import Canvas from "./Canvas"
import PreviewCard from "./PreviewCard"
import Sidebar from "./SideBar"

function Container() {
  return (
    <div className="container">
      <Sidebar />
      <Canvas />
      <PreviewCard />
    </div>
  )
}

export default Container
