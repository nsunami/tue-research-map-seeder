import { PrismaClient } from "@prisma/client"
import { createPersons } from "./utils/createPersons"
import { createOrganizations } from "./utils/createOrganizations"

const db = new PrismaClient()

async function main() {
  // Get all the TU/e Organizations
  const baseUrl = "https://pure.tue.nl/ws/api/"

  await createOrganizations({ db, baseUrl })
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
