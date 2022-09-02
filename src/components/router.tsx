import React from "react"
import { DataBrowserRouter } from "react-router-dom"

import { createRoutes } from "../utils/create-routes"
import type { RoutesOptions } from ".."

type RouterProps = RoutesOptions & {}

const Router: React.FC<RouterProps> = ({ defaultBehaviour, pagesRoot }) => {
  return <DataBrowserRouter routes={createRoutes({ defaultBehaviour, pagesRoot })} />
}

export default Router
