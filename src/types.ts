import type { LoaderFunctionArgs } from "react-router-dom"

export interface Page<T = any> {
  default: React.FC
  loader?: PageLoader<T>
  config?: PageConfig
}

export type PageLoader<T> = {
  (args: LoaderFunctionArgs): Promise<LoaderData<T>>
  loadingMode?: "render" | "blocking"
}

export interface LoaderData<T> {
  data: T
  notFound?: boolean
  redirect?: string
}

export interface PageConfig {
  mode?: "modal"
}
