type CreateRequestProps = {
  pageSize: number
  offset: number
  baseUrl: string
  targetEndpoint: "persons" | "organizations"
}
export function createRequest({
  pageSize,
  offset,
  baseUrl,
  targetEndpoint,
}: CreateRequestProps) {
  const params = new URLSearchParams({
    size: pageSize.toString(),
    offset: offset.toString(),
  })

  const currentUrl = new URL(`${targetEndpoint}?${params}`, baseUrl)
  const headers = new Headers({
    "api-key": process.env.PURE_API_KEY as string,
  })
  const controller = new AbortController()
  return fetch(currentUrl, {
    headers,
    signal: controller.signal,
  }).then((res) => {
    return res.json()
  })
}
