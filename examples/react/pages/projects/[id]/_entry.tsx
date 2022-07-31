import React from "react"

import { usePageData } from "vite-react-async-router"
import type { PageLoader } from "vite-react-async-router"

import type { Project } from "../../../data/projects"

type PageData = {
  project: Project
}

const EntryProject: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading } = usePageData<PageData>()

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-semibold">
        {isLoading || !data?.project ? (
          <div className="bg-gray-500 rounded h-4 animate-pulse" />
        ) : (
          data.project.name
        )}
      </h1>

      <div className="mt-6">{children}</div>
    </div>
  )
}

export const loader: PageLoader<PageData> = async args => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const projects = (await import("../../../data/projects")).default
  const project = projects.find(p => p.id === args.params.id)!

  return {
    data: {
      project,
    },
    notFound: !project,
  }
}

export default EntryProject
