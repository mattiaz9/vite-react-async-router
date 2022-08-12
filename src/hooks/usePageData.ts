import { useEffect, useState } from "react"
import { useLoaderData, useLocation, useRevalidator } from "react-router-dom"
import type { LoaderData } from "../types"

const isPromise = <T>(
  value: any | ((state: any) => Promise<T>)
): value is (state: any) => Promise<T> => typeof value === "function"

export default function usePageData<T>() {
  const { revalidate } = useRevalidator()
  const { state } = useLocation()
  const loaderData = useLoaderData() as
    | T
    | ((state: any) => Promise<LoaderData<T>>)
    | null
    | undefined
  const [data, setData] = useState<T | undefined | null>(
    typeof loaderData !== "function" ? loaderData : undefined
  )

  useEffect(() => {
    setData(typeof loaderData !== "function" ? loaderData : undefined)

    if (!loaderData) return
    if (isPromise(loaderData)) {
      loaderData(state).then(pageData => {
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
