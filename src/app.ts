import { Prisma, PrismaClient, type Organization } from "@prisma/client"
import { getOrganizations } from "./utils/getOrganizations"

const db = new PrismaClient()

async function main() {
  // Get all the TU/e Organizations
  const organizations = await getOrganizations()

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

  await db.organization
    .createMany({
      data: orgInputData,
      skipDuplicates: true,
    })
    .then((res) => console.log("Created records", res))

  // Connecting organizations
  organizations.forEach(async (o) => {
    await db.organization.update({
      where: { pureUuid: o.uuid },
      data: {
        parents: { connect: o.parents?.map((p) => ({ pureUuid: p.uuid })) },
      },
    })
  })
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
