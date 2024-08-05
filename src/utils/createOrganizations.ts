import type { PrismaClient } from "@prisma/client/extension"
import { getOrganizations } from "./getOrganizations"
import type { Prisma } from "@prisma/client"

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
