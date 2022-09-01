import React from "react"
import { DataBrowserRouter } from "react-router-dom"

import { createRoutes } from "../utils/create-routes"
import type { RouteLoadingBehaviour } from ".."

type RouterProps = {
  defaultBehaviour?: RouteLoadingBehaviour
}

const Router: React.FC<RouterProps> = ({ defaultBehaviour }) => {
  return <DataBrowserRouter routes={createRoutes({ defaultBehaviour })} />
}

export default Router
