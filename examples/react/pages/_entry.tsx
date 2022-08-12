import React from "react"
import { Link } from "react-router-dom"

import { usePageData } from "vite-react-async-router"
import type { PageLoader, RouteEntry } from "vite-react-async-router"

import type { Project } from "../data/projects"

type PageData = {
  projects: Project[]
}

const Entry: RouteEntry = ({ children }) => {
  const { data, isLoading } = usePageData<PageData>()

  return (
    <div className="bg-gray-700 text-white flex flex-col w-full min-h-screen py-6">
      <div className="w-full max-w-screen-md mx-auto flex items-start">
        <aside className="w-full max-w-xs">
          <h2 className="uppercase text-xs text-gray-400 mb-4">Projects</h2>
          <ul className="space-y-1 text-sm">
            {!data && isLoading && <Placeholder />}
            {data?.projects.map(project => (
              <li key={project.id}>
                <Link
                  className="block px-2 py-1 border border-gray-400 rounded"
                  to={`/projects/${project.id}`}
                  state={{ project }}
                >
                  {project.name}
                </Link>
              </li>
            ))}
            {data && !isLoading && (
              <li>
                <Link
                  className="block px-2 py-1 border border-gray-400 rounded"
                  to="/projects/whatever"
                >
                  Not found!
                </Link>
              </li>
            )}
          </ul>
        </aside>
        <main className="w-full flex flex-col ml-6">{children}</main>
      </div>
    </div>
  )
}

const Placeholder: React.FC = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <li className="bg-gray-500 rounded animate-pulse w-full h-5" key={i} />
        ))}
    </>
  )
}

export const loader: PageLoader<PageData> = async args => {
  await new Promise(resolve => setTimeout(resolve, 2000))

  const projects = (await import("../data/projects")).default

  return {
    data: {
      projects,
    },
  }
}

export default Entry
