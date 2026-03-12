CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL,
    "singletonKey" TEXT NOT NULL DEFAULT 'main',
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT,
    "introTitle" TEXT,
    "introBody" TEXT,
    "manifestoTitle" TEXT,
    "manifestoBody" TEXT,
    "heroImage" TEXT,
    "ctaMode" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "ctaUrl" TEXT,
    "ctaLabel" TEXT,
    "whatsappMessageTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AboutMilestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "aboutPageId" TEXT NOT NULL,

    CONSTRAINT "AboutMilestone_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AboutSpecialization" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "aboutPageId" TEXT NOT NULL,

    CONSTRAINT "AboutSpecialization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AboutCredential" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT,
    "year" TEXT,
    "imageUrl" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'CERTIFICATE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "aboutPageId" TEXT NOT NULL,

    CONSTRAINT "AboutCredential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AboutPage_singletonKey_key" ON "AboutPage"("singletonKey");
CREATE INDEX "AboutMilestone_aboutPageId_sortOrder_idx" ON "AboutMilestone"("aboutPageId", "sortOrder");
CREATE INDEX "AboutSpecialization_aboutPageId_sortOrder_idx" ON "AboutSpecialization"("aboutPageId", "sortOrder");
CREATE INDEX "AboutCredential_aboutPageId_sortOrder_idx" ON "AboutCredential"("aboutPageId", "sortOrder");
CREATE INDEX "AboutCredential_kind_sortOrder_idx" ON "AboutCredential"("kind", "sortOrder");

ALTER TABLE "AboutMilestone" ADD CONSTRAINT "AboutMilestone_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AboutSpecialization" ADD CONSTRAINT "AboutSpecialization_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AboutCredential" ADD CONSTRAINT "AboutCredential_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
