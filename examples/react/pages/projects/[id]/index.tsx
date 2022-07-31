import React from "react"
import { Link } from "react-router-dom"

import { usePageData } from "vite-react-async-router"
import type { PageLoader } from "vite-react-async-router"
import type { Article } from "data/articles"

type PageData = {
  articles: Article[]
}

const Project: React.FC = () => {
  const { data, isLoading } = usePageData<PageData>()

  return (
    <div className="">
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, i) => <li className="bg-gray-500 rounded h-32 animate-pulse" key={i} />)
          : data.articles.map(article => (
              <li className="p-3 rounded border border-gray-500" key={article.id}>
                <h2 className="font-semibold">{article.title}</h2>
                <p className="text-xs text-gray-400">{article.excerpt}</p>
              </li>
            ))}
      </ul>

      {!isLoading && data.articles.length === 0 && (
        <p className="mt-4 text-lg text-gray-300">No articles found!</p>
      )}
    </div>
  )
}

export const loader: PageLoader<PageData> = async args => {
  await new Promise(resolve => setTimeout(resolve, 2000))

  const projects = (await import("../../../data/articles")).default
  const articles = projects.filter(a => a.project === args.params.id)

  return {
    data: {
      articles: articles!,
    },
  }
}

export default Project