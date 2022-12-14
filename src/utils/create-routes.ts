import React, { Suspense, lazy } from "react"
import type { RouteObject, LoaderFunctionArgs } from "react-router-dom"

import { pagePathToRoutePath, pageToUrl } from "./paths"
import EntryOutlet from "../components/entry-outlet"
import NotFound from "../components/404"
import ErrorPage from "../components/error-page"
import { ClientError, NotFoundError } from "./errors"
import type { RoutesOptions, Page } from "../types"

export function createRoutes(opts?: RoutesOptions): RouteObject[] {
  const pagesRoot = (opts?.pagesRoot?.replace(/^\/?/, "/") ?? "/").replace(/\/$/, "")
  const pagesFolder = pagesRoot + "/pages"
  const pages = import.meta.glob<Page>("/**/pages/**/*.(tsx|jsx|ts|js)")
  const entriesPages = import.meta.glob<Page>("/**/pages/**/_entry.(tsx|jsx|ts|js)", {
    eager: true,
  })
  const allPagesPaths = Object.keys(pages)
  const pagesPaths = allPagesPaths.filter(
    path => !/(_entry|_error|404)\.(tsx|jsx|ts|js)$/.test(path)
  )
  const entriesPaths = Object.keys(entriesPages).reverse()

  return [
    createRouteOuter(
      {
        id: "root-route",
        path: "",
        children: [createRoutes(), { path: "*", element: createNotFoundElement(), id: "404" }],
        errorElement: React.createElement(ErrorPage),
      },
      React.Fragment
    ),
  ]

  function createRoutes(): RouteObject {
    const pathsRoutes = pagesPaths.map(path => ({
      path,
      route: createRouteObject(path),
    }))

    for (const entryPath of entriesPaths) {
      const folderRegex = new RegExp(`${pagesFolder}(/.*)/.+?\.(tsx|jsx|ts|js)$`)
      const folder = entryPath.match(folderRegex)?.[1] ?? ""
      const folderRoutes = pathsRoutes
        .reverse()
        .filter(
          ({ path }) =>
            folder === "" ||
            new RegExp(
              `${pagesFolder}${folder
                .replace(/\[/, "\\[")
                .replace(/\]/, "\\]")}/.+?\.(tsx|jsx|ts|js)$`
            ).test(path)
        )

      const entryModule = () => Promise.resolve(entriesPages[entryPath])

      const path = pagePathToRoutePath(folder).replace(/^\/?/, "")

      pathsRoutes.push({
        path: folder,
        route: createRouteOuter(
          {
            id: `outer-${path}`,
            path,
            children: folderRoutes.map(folderRoute => ({
              ...folderRoute.route,
              path: folderRoute.route.path?.replace(path, "").replace(/^\//, "") ?? "",
            })),
            loader: createPageLoader(entryModule),
          },
          entriesPages[entryPath].default ?? React.Fragment
        ),
      })

      // remove folder components from root routes
      for (const folderRoute of folderRoutes) {
        pathsRoutes.splice(pathsRoutes.indexOf(folderRoute), 1)
      }
    }

    return createRouteOuter(
      {
        id: `main-routes`,
        path: "",
        children: pathsRoutes.map(pathComponent => pathComponent.route),
      },
      React.Fragment
    )
  }

  function createRouteObject(path: string): RouteObject {
    // 1. convert file system path to url
    // 2. replace dynamic parts `[id]` with `:id`
    const routePath = pageToUrl(path, pagesRoot)!.replace(/\[.+?\]/g, sub => `:${sub.slice(1, -1)}`)

    const Page = createRoutePage(path)

    return {
      id: routePath,
      path: routePath,
      element: React.createElement(Suspense, {}, Page),
      loader: createPageLoader(pages[path]),
    }
  }

  function createRoutePage(path: string) {
    return lazy(async () => {
      const { default: page } = await pages[path]()
      return {
        default: React.createElement(page),
      } as any
    }) as unknown as React.ReactNode
  }

  function createPageLoader(pageModule: () => Promise<Page>) {
    let error: Error | undefined

    return async function (args: LoaderFunctionArgs) {
      if (error) throw error

      const { loader } = await pageModule()

      if (loader) {
        const loadingMode = loader.loadingMode ?? opts?.defaultBehaviour ?? "lazy"

        if (loadingMode === "blocking") {
          try {
            const result = await loader(args)

            if (result.notFound) {
              throw new NotFoundError()
            }

            if (result.redirect) {
              // return navigate
            }

            return result.data
          } catch (error: any) {
            error = new ClientError(error.message)
          }
        } else if (loadingMode === "lazy") {
          return async (state: any) => {
            try {
              const result = await loader({ ...args, state })

              if (result.notFound) {
                error = new NotFoundError()
              }

              return result
            } catch (error: any) {
              error = new ClientError(error.message)
            }
          }
        }
      } else {
        return null
      }
    }
  }

  function createNotFoundElement() {
    const NotFoundPage = lazy(async () => {
      const notFoundRegex = new RegExp(`${pagesFolder}/404.(tsx|jsx|ts|js)`)
      const notFoundPath = allPagesPaths.find(path => notFoundRegex.test(path))
      const notFoundComponent = notFoundPath ? (await pages[notFoundPath]()).default : NotFound
      return {
        default: notFoundComponent,
      }
    })
    return React.createElement(Suspense, {}, React.createElement(NotFoundPage))
  }

  function createRouteOuter(route: RouteObject, wrapperComponent: React.FC): RouteObject {
    return {
      ...route,
      element: React.createElement(EntryOutlet, { component: wrapperComponent }),
    }
  }
}
