// Get all persons

import type { Prisma, PrismaClient } from "@prisma/client"
import { countPersons, getAllPersons } from "./getAllPersons"
import type { PersonsResponseData } from "../types/Person"

type CreatePersonsProps = {
  db: PrismaClient
  baseUrl: string
  limitPages?: number
}

export async function createPersons({
  db,
  baseUrl,
  limitPages = 0,
}: CreatePersonsProps) {
  const personsMetadata = await countPersons({ baseUrl })
  const pageSize = 100
  const totalPages = Math.ceil(personsMetadata.count / pageSize)

  const personsResponses = (await getAllPersons({
    pageSize,
    maxPages: limitPages || totalPages,
    baseUrl,
  })) as PersonsResponseData[]
  const persons = personsResponses.flatMap((response) => response.items)

  console.log(`⏳ Creating persons...`)

  const personsResults = await db.person.createMany({
    data: persons.map((p) => {
      return {
        pureUuid: p.uuid,
        firstName: p.name?.firstName,
        lastName: p.name.lastName,
        portalUrl: p.portalUrl,
        profilePhotoUrl: p?.profilePhotos?.[0].url,
        orcid: p?.orcid,
      }
    }),
    skipDuplicates: true,
  })
  console.log(personsResults)
  console.log(`✅ Created ${personsResults} persons`)

  console.log("⌛ Creating membership entries for persons...")

  const existingPersonsIds = await db.person.findMany({
    select: { id: true, pureUuid: true },
  })
  const existingOrgsIds = await db.organization.findMany({
    select: { id: true, pureUuid: true },
  })

  const membershipCreateManyInput = persons.flatMap((p) => {
    if (p?.staffOrganizationAssociations == null) return []
    return p.staffOrganizationAssociations.flatMap((o) => {
      if (o == null) return []
      return {
        pureId: o.pureId,
        email: o?.emails?.[0]?.value,
        startDate: new Date(o.period.startDate),
        endDate: o?.period?.endDate && new Date(o?.period?.endDate),
        primaryAssociation: o.primaryAssociation,
        jobTitleUri: o?.jobTitle?.uri,
        jobTitle: o?.jobTitle?.term.en_GB,
        staffTypeUri: o?.staffType?.uri,
        staffType: o?.staffType?.term.en_GB,
        organizationId: existingOrgsIds.find(
          (existing) => existing.pureUuid === o.organization.uuid
        )?.id,
        personId: existingPersonsIds.find(
          (existing) => existing.pureUuid === p.uuid
        )?.id,
      }
    })
  }) as Prisma.OrganizationMembershipCreateManyInput[]

  await db.organizationMembership.createMany({
    data: membershipCreateManyInput,
    skipDuplicates: true,
  })
  console.log("...✅ Done")
}
