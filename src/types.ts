import React from "react"
import type { LoaderFunctionArgs } from "react-router-dom"

export interface RoutePage<P = {}> extends React.FC<P> {
  //routeId?: string --> cannot fetch this without compromising code splitting
}

export interface RouteEntry<P = {}> extends RoutePage<P & { children: React.ReactNode }> {}

export interface Page<P = {}, T = any, S = any> {
  default: RoutePage<P>
  loader?: PageLoader<T, S>
  config?: PageConfig
}

export type PageLoader<T, S = any> = {
  (args: LoaderFunctionArgs & { state?: S }): Promise<LoaderData<T>>
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
