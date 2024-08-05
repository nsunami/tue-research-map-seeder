-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "pureUuid" TEXT NOT NULL,
    "orcid" TEXT,
    "firstName" TEXT,
    "lastName" TEXT NOT NULL,
    "portalUrl" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "pureId" BIGINT NOT NULL,
    "email" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "primaryAssociation" BOOLEAN,
    "jobTitleUri" TEXT,
    "jobTitle" TEXT,
    "staffTypeUri" TEXT,
    "staffType" TEXT,
    "personId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "pureUuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "typeUri" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationContact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pureId" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "typeUri" TEXT NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "OrganizationContact_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "OrganizationContact_pureId_key" ON "OrganizationContact"("pureId");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationRelation_AB_unique" ON "_OrganizationRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationRelation_B_index" ON "_OrganizationRelation"("B");

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationContact" ADD CONSTRAINT "OrganizationContact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationRelation" ADD CONSTRAINT "_OrganizationRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationRelation" ADD CONSTRAINT "_OrganizationRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
