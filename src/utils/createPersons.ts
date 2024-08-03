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

  await db.person
    .createMany({
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
    .then(() => {
      console.log(`✅ Created ${persons.length} persons`)
    })

  console.log("⌛ Creating membership entries for persons...")
  const memberships = persons.flatMap((p) => p.staffOrganizationAssociations)
  const membershipData = memberships.flatMap((o) => {
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
    }
  }) as Prisma.OrganizationMembershipCreateManyInput[]
  await db.organizationMembership.createMany({
    data: membershipData,
    skipDuplicates: true,
  })
  console.log("...✅ Done")

  console.log("⏳ Connecting persons with memberships...")
  const connectPersonsWithOrgsPromises = persons.flatMap((p) => {
    if (p.staffOrganizationAssociations == null) return []

    const pureIds = p.staffOrganizationAssociations.map((m) => ({
      pureId: m.pureId,
    }))

    return db.person.update({
      where: { pureUuid: p.uuid },
      data: {
        organizationMembership: {
          connect: pureIds,
        },
      },
    })
  })

  const connectOrgsWithPersonsPromises = persons.flatMap((p) => {
    if (p.staffOrganizationAssociations == null) return []
    return p.staffOrganizationAssociations.map((org) => {
      return db.organizationMembership.update({
        where: { pureId: org.pureId },
        data: {
          person: {
            connect: { pureUuid: p.uuid },
          },
          organization: {
            connect: {
              pureUuid: org.organization.uuid,
            },
          },
        },
      })
    })
  })

  await db.$transaction([
    ...connectPersonsWithOrgsPromises,
    ...connectOrgsWithPersonsPromises,
  ])
  console.log("...✅ Done")
}
