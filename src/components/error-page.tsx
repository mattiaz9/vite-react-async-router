import React, { lazy, Suspense } from "react"
import { useRouteError } from "react-router-dom"

import NotFound from "./404"
import Error from "./error"
import { ClientError, NotFoundError } from "../utils/errors"
import type { Page } from "../types"

const userErrorPages = import.meta.glob<Page>("/pages/**/(404|_error).(tsx|jsx|ts|js)")

const AsyncNotFound = lazy(async () => {
  const user404 = Object.keys(userErrorPages).find(path => /^\/pages\/404/.test(path))
  const page = user404 ? (await userErrorPages[user404]()).default : NotFound
  return {
    default: page,
  }
})

const AsyncClientError = lazy(async () => {
  const userError = Object.keys(userErrorPages).find(path => /^\/pages\/_error/.test(path))
  const page = userError ? (await userErrorPages[userError]()).default : Error
  return {
    default: page,
  }
})

const ErrorPage: React.FC = () => {
  const error = useRouteError() as Error | undefined

  if (error instanceof NotFoundError) {
    return (
      <Suspense>
        <AsyncNotFound />
      </Suspense>
    )
  }

  if (error instanceof ClientError) {
    return (
      <Suspense>
        <AsyncClientError />
      </Suspense>
    )
  }

  return <>An error has occurred</>
}

export default ErrorPage
