import type { PersonsResponseData } from "../types/Person"

type GetAllPersonsProps = {
  pageSize: number
  maxPages: number
  baseUrl: string
}

export async function getAllPersons({
  pageSize,
  maxPages,
  baseUrl,
}: GetAllPersonsProps) {
  const fetchPersonsRequests = Array.from(
    { length: maxPages },
    (_, i) => i
  ).map((pageIndex) =>
    createRequest({
      pageSize: pageSize,
      offset: pageIndex * pageSize,
      baseUrl,
      targetEndpoint: "persons",
    })
  )

  // ~5700 pages to fetch
  // Total record is ~57_000

  console.time(`fetch time for ${fetchPersonsRequests.length} requests`)
  const persons = await Promise.all(fetchPersonsRequests)
  console.timeEnd(`fetch time for ${fetchPersonsRequests.length} requests`)

  return persons
}

type CountPersonsProps = {
  baseUrl: string
}
export async function countPersons({ baseUrl }: CountPersonsProps) {
  const controller = new AbortController()

  const headers = new Headers({
    "api-key": process.env.PURE_API_KEY as string,
  })

  const personsUrl = new URL(`persons`, baseUrl)

  const personsRequest = new Request(personsUrl)

  const personsResponseData = (await fetch(personsRequest, {
    headers,
    signal: controller.signal,
  }).then((res) => res.json())) as PersonsResponseData

  return {
    count: personsResponseData.count,
    offset: personsResponseData.pageInformation.offset,
    page_size: personsResponseData.pageInformation.size,
  }
}
