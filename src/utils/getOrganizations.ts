import type { OrganizationResponseData } from "../types/Organization"
import { createRequest } from "./createRequest"

type GetOrganizationsProps = {
  baseUrl: string
}

export async function getOrganizations({ baseUrl }: GetOrganizationsProps) {
  const PAGE_SIZE = 50

  const controller = new AbortController()

  const headers = new Headers({
    "api-key": process.env.PURE_API_KEY as string,
  })

  const params = new URLSearchParams({
    size: PAGE_SIZE.toString(),
  })

  const organizationsUrl = new URL(`organizations?${params}`, baseUrl)

  const organizationsRequest = new Request(organizationsUrl, {
    headers,
    signal: controller.signal,
  })

  const organizationResponseData = (await fetch(organizationsRequest).then(
    (res) => res.json()
  )) as OrganizationResponseData

  const totalOrganizations = organizationResponseData.count
  const totalPages = Math.ceil(totalOrganizations / PAGE_SIZE)
  const pageSize = organizationResponseData.pageInformation.size

  console.log("Page size:", organizationResponseData.pageInformation.size)
  console.log("Total organizations:", totalOrganizations)
  console.log("Total pages:", totalPages + 1)

  const organizationsPromises = Array.from(
    { length: totalPages },
    (_, i) => i
  ).map((i) =>
    createRequest({
      pageSize,
      offset: i * pageSize,
      baseUrl,
      targetEndpoint: "organizations",
    })
  )

  const organizationsResponses = (await Promise.all(
    organizationsPromises
  )) as OrganizationResponseData[]
  const organizations = organizationsResponses.flatMap((r) => r.items)

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
