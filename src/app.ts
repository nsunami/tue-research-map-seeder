import { PrismaClient } from "@prisma/client"
import { getOrganizations } from "./utils/getOrganizations"
import { createPersons } from "./utils/createPersons"

const db = new PrismaClient()

async function main() {
  // Get all the TU/e Organizations
  const baseUrl = "https://pure.tue.nl/ws/api/"
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
  })

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

  await createPersons({ db, baseUrl })
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
