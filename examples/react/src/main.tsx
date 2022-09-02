import React from "react"
import { createRoot } from "react-dom/client"

import { Router } from "vite-react-async-router"

import "./styles/global.css"

createRoot(document.getElementById("root")!).render(<Router pagesRoot="src" />)
