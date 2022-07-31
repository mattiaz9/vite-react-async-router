import React from "react"
import { DataBrowserRouter } from "react-router-dom"

import { createRoutes } from "../utils/create-routes"

const Router: React.FC = () => {
  return <DataBrowserRouter routes={createRoutes()} />
}

export default Router
