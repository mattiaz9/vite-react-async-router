export function pageToUrl(path: string, root = "/") {
  const pagesRegex = new RegExp(`^.?${root}/pages/`)
  const url = path
    .replace(pagesRegex, "/")
    .replace(/\.(tsx|jsx|ts|js)$/, "")
    .replace(/\/index$/, "")
    .replace(/\/?$/, "")
    .replace(/^\/$/, "/")

  if (url.endsWith("_entry")) {
    return null
  } else {
    return url || "/"
  }
}

export function pagePathToRoutePath(pagePath: string) {
  return pagePath
    .split("/")
    .map(part => (part.match(/^\[.+\]$/) ? part.replace(/^\[(.+)\]$/, ":$1") : part))
    .join("/")
}
