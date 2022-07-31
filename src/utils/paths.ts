export function pageToUrl(path: string) {
  const url = path
    .replace(/^.?\/pages\//, "/")
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
