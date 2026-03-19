-- CreateTable
CREATE TABLE "HomePage" (
    "id" TEXT NOT NULL,
    "singletonKey" TEXT NOT NULL DEFAULT 'main',
    "heroEyebrow" TEXT,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT,
    "heroPrimaryCtaLabel" TEXT,
    "heroSecondaryCtaLabel" TEXT,
    "heroTrustText" TEXT,
    "audienceTitle" TEXT,
    "audienceSubtitle" TEXT,
    "valueTitle" TEXT,
    "valueSubtitle" TEXT,
    "valueCtaLabel" TEXT,
    "methodTitle" TEXT,
    "methodSubtitle" TEXT,
    "methodCtaLabel" TEXT,
    "faqTitle" TEXT,
    "faqSubtitle" TEXT,
    "finalCtaTitle" TEXT,
    "finalCtaSubtitle" TEXT,
    "finalCtaScarcityText" TEXT,
    "finalCtaLabel" TEXT,
    "finalWhatsappMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeAudienceItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "HomeAudienceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeValueItem" (
    "id" TEXT NOT NULL,
    "badge" TEXT,
    "title" TEXT NOT NULL,
    "bullets" JSONB NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'NEUTRAL',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "HomeValueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeMethodStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "HomeMethodStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeFaqItem" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "homePageId" TEXT NOT NULL,

    CONSTRAINT "HomeFaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_singletonKey_key" ON "HomePage"("singletonKey");

-- CreateIndex
CREATE INDEX "HomeAudienceItem_homePageId_sortOrder_idx" ON "HomeAudienceItem"("homePageId", "sortOrder");

-- CreateIndex
CREATE INDEX "HomeValueItem_homePageId_sortOrder_idx" ON "HomeValueItem"("homePageId", "sortOrder");

-- CreateIndex
CREATE INDEX "HomeMethodStep_homePageId_sortOrder_idx" ON "HomeMethodStep"("homePageId", "sortOrder");

-- CreateIndex
CREATE INDEX "HomeFaqItem_homePageId_sortOrder_idx" ON "HomeFaqItem"("homePageId", "sortOrder");

-- AddForeignKey
ALTER TABLE "HomeAudienceItem" ADD CONSTRAINT "HomeAudienceItem_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeValueItem" ADD CONSTRAINT "HomeValueItem_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeMethodStep" ADD CONSTRAINT "HomeMethodStep_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeFaqItem" ADD CONSTRAINT "HomeFaqItem_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
