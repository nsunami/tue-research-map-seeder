import { getOrganizations } from "./getOrganizations"
import type { Prisma, PrismaClient } from "@prisma/client"

type CreateOrganizationsProps = {
  db: PrismaClient
  baseUrl: string
}

export async function createOrganizations({
  db,
  baseUrl,
}: CreateOrganizationsProps) {
  const organizations = await getOrganizations({ baseUrl })

  const orgInputData = organizations.map((o) => {
    return {
      pureUuid: o.uuid,
      name: o.name.en_GB as string,
      shortName: o.nameVariants.find((n) => n.type.term.en_GB === "Short name")
        ?.value?.en_GB as string,
      typeUri: o.type.uri,
      type: o.type.term.en_GB as string,
    }
  }) as Prisma.OrganizationCreateManyInput[]

  const createdOrgs = await db.organization.createMany({
    data: orgInputData,
    skipDuplicates: true,
  })
  if (createdOrgs.count > 0) {
    console.log(`✅ Created ${createdOrgs.count} new organizations`)
  } else {
    console.log("⏩ No new organizations created")
  }

  const currentOrgs = await db.organization.findMany({
    select: {
      id: true,
      pureUuid: true,
    },
  })

  const contacts = organizations.flatMap((o) => {
    if (o.emails == null) return []
    return o.emails?.map((e) => ({
      email: e.value,
      pureId: e.pureId,
      type: e.type.term.en_GB,
      typeUri: e.type.uri,
      organizationId: currentOrgs.find((cur) => cur.pureUuid === o.uuid)?.id,
    })) as Prisma.OrganizationContactCreateManyInput[]
  })

  await db.organizationContact.createMany({
    data: contacts,
    skipDuplicates: true,
  })

  // Connecting organizations with each other
  organizations.forEach(async (o) => {
    await db.organization.update({
      where: { pureUuid: o.uuid },
      data: {
        parents: { connect: o.parents?.map((p) => ({ pureUuid: p.uuid })) },
      },
    })
  })
}
