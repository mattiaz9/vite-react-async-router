# Vite Plugin React Router Async

Automatic react router generator with pages folder and async loader.

## Installation

`npm install vite-react-async-router`

## Setup

In your entry point:

```tsx
import React from "react"
import { createRoot } from "react-dom/client"
import { Router } from "vite-react-async-router"

createRoot(document.getElementById("root")!).render(<Router />)
```

## Adding pages

Create a pages folder in the root of your project.

Example:
```
/my-app
  /pages
    /404.tsx (default 404 page [optional])
    /_error_.tsx (default error page [optional])
    /_entry.tsx (layout wrapper [optional])
    /index.tsx
    /posts
      /_entry.tsx (layout wrapper)
      /index.tsx
      /[slug].tsx
  /src
    /components
    ...
```

### Set a custom pages root

When you define your Router component set the `pagesRoot` prop like this:
```tsx
<Router pagesRoot="src" />
```

Now your folder structure should look like this:
```
/my-app
  /src
    /components
    /pages
      ...
    ...
```

## Setup a page loader

Export a function named `loader` from your page. The function must return a `data` and optionally a `notFound` property.
When `notFound` is `true` the 404 page is shown.

Example:
```tsx
import React from "react"
import { usePageData } from "vite-react-async-router"
import type { PageLoader } from "vite-react-async-router"

type PageData = {
  projects: Project[]
}

const Page = () => <div>...</div>

export const loader: PageLoader<PageData> = async args => {
  const resp = await fetch(`/api/projects`)
  const projects = await resp.json()

  return {
    data: {
      projects,
    },
  }
}

export default Page
```

### Loading mode

#### At root level (default is "lazy")
```tsx
createRoot(
  document.getElementById("root")!
).render(
  <Router defaultBehaviour="blocking" />
)
```

#### At page level

Set `loader.loadingMode = "blocking"` to make the router wait the loader function to fetch the data before rendering the component.

Set `loader.loadingMode = "lazy"` to render immediatly the page with loading option.

## Retrieving the data

Using the hook `usePageData` you can get the fetched data, and a variable `isLoading` if the data is yet to fetched.
When `loader.loadingMode = "blocking"` `isLoading` will always be false, because the page is rendered only when the data is fetched.

Example:
```tsx
const Page = () => {
  const { data, isLoading } = usePageData<PageData>()

  return (
    <div>
      {isLoading && (
        <p>Loading...</p>
      )}
      {data && (
        <div>...</div>
      )}
    </div>
  )
}
```

## The `_entry` component

The `_entry` component can be placed under any directory and serves as layout wrapper for each components in the same directory and sub-directories.

An _entry can have its own loader, but it's not necessary.

Example:
```tsx
import React from "react"
import { usePageData } from "vite-react-async-router"
import type { PageLoader } from "vite-react-async-router"

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
  const resp = await fetch(`/api/projects/${args.params.id}`)
  const project = await resp.json()

  return {
    data: {
      project,
    },
    notFound: !project,
  }
}

export default EntryProject
```
