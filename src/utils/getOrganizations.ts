import type { OrganizationResponseData } from "../types/Organization"

export async function getOrganizations() {
  const PAGE_SIZE = 50

  const controller = new AbortController()

  const headers = new Headers({
    "api-key": process.env.PURE_API_KEY as string,
  })

  const params = new URLSearchParams({
    size: PAGE_SIZE.toString(),
  })

  const baseUrl = "https://pure.tue.nl/ws/api/"
  const organizationsUrl = new URL(`organizations?${params}`, baseUrl)

  const organizationsRequest = new Request(organizationsUrl, {
    headers,
    signal: controller.signal,
  })

  const organizationResponseData = (await fetch(organizationsRequest).then(
    (res) => res.json()
  )) as OrganizationResponseData

  const totalOrganizations = organizationResponseData.count
  const totalPages = Math.ceil(
    totalOrganizations / organizationResponseData.pageInformation.size
  )
  const pageSize = organizationResponseData.pageInformation.size

  console.log("Page size:", organizationResponseData.pageInformation.size)
  console.log("Total organizations:", totalOrganizations)
  console.log("Total pages:", totalPages + 1)

  let organizations = []
  for (let pageIndex = 0; pageIndex <= totalPages; pageIndex++) {
    let offset = pageSize * pageIndex

    params.set("offset", offset.toString())

    const currentUrl = new URL(`organizations?${params}`, baseUrl)
    const res = (await fetch(currentUrl, {
      headers,
      signal: controller.signal,
    }).then((res) => res.json())) as OrganizationResponseData

    console.log(
      "Fetched from",
      res.pageInformation.offset + 1,
      "to",
      res.pageInformation.offset + res.pageInformation.size,
      `(page ${pageIndex + 1}/${totalPages + 1})`
    )

    if (res.items.length == 0) break
    organizations.push(...res.items)
  }

  console.log(organizations.length, "organizations fetched")

  const duplicates = organizations.filter((v, i, a) => a.indexOf(v) !== i)
  if (duplicates.length > 0) {
    console.log(duplicates)
    throw Error("Duplicates detected")
  } else {
    console.log("✅ No duplicates")
  }
  return organizations
}
