import { useEffect, useState } from "react"
import { useLoaderData, useRevalidator } from "react-router-dom"
import type { LoaderData } from "../types"

const isPromise = <T>(value: any | (() => Promise<T>)): value is () => Promise<T> =>
  typeof value === "function"

export default function usePageData<T>() {
  const { revalidate } = useRevalidator()
  const loaderData = useLoaderData() as T | (() => Promise<LoaderData<T>>) | null | undefined
  const [data, setData] = useState<T | undefined | null>(
    typeof loaderData !== "function" ? loaderData : undefined
  )

  useEffect(() => {
    setData(typeof loaderData !== "function" ? loaderData : undefined)

    if (!loaderData) return
    if (isPromise(loaderData)) {
      loaderData().then(pageData => {
        if (pageData.notFound) {
          // revalidate to throw not found error from the router `loader`
          revalidate()
        }
        setData(pageData.data)
      })
    }
  }, [loaderData])

  return {
    data,
    isLoading: data === undefined,
  }
}
