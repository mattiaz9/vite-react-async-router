import React from "react"

type ArticleCardProps = {
  title: string
  excerpt: string
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, excerpt }) => {
  return (
    <div className="p-3 rounded border border-gray-500">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-gray-400">{excerpt}</p>
    </div>
  )
}

export default ArticleCard
