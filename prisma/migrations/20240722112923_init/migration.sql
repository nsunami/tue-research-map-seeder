-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "pureUuid" TEXT NOT NULL,
    "orcid" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "portalUrl" TEXT NOT NULL,
    "profilePhotoUrl" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "pureId" BIGINT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "primaryAssociation" BOOLEAN NOT NULL,
    "jobTitleUri" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "staffTypeUri" TEXT NOT NULL,
    "staffType" TEXT NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "pureUuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "typeUri" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_pureUuid_key" ON "Person"("pureUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Person_orcid_key" ON "Person"("orcid");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_pureId_key" ON "OrganizationMembership"("pureId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_pureUuid_key" ON "Organization"("pureUuid");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationRelation_AB_unique" ON "_OrganizationRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationRelation_B_index" ON "_OrganizationRelation"("B");

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationRelation" ADD CONSTRAINT "_OrganizationRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationRelation" ADD CONSTRAINT "_OrganizationRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
