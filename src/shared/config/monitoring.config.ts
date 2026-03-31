export const IGNORED_PATHS = ['/health', '/metrics', '/docs', '/favicon.ico']

export const isIgnoredPath = (url: string | undefined): boolean => {
  if (!url) return false
  return IGNORED_PATHS.some((path) => url.includes(path))
}
