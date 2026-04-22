-- Create AgentApprovalStatus enum (includes PENDING_INFO so migration 3 ADD VALUE becomes a no-op)
DO $$ BEGIN
    CREATE TYPE "AgentApprovalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PENDING_INFO');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create AgentDocumentType enum
DO $$ BEGIN
    CREATE TYPE "AgentDocumentType" AS ENUM ('RERA_BROKER_CARD', 'BRN', 'LABOUR_CARD', 'EMPLOYMENT_VISA', 'EMIRATES_ID');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add approvalStatus
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "approvalStatus" "AgentApprovalStatus" NOT NULL DEFAULT 'DRAFT';
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add approvalNote
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "approvalNote" TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add infoRequestNote (also added by migration 20260422140418, guard covers both)
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "infoRequestNote" TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add submittedAt
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "submittedAt" TIMESTAMP(3);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add reviewedAt
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "reviewedAt" TIMESTAMP(3);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add reviewedBy
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "reviewedBy" TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add title
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "title" TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add nationality
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "nationality" TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add spokenLanguages
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "spokenLanguages" TEXT[] NOT NULL DEFAULT '{}';
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add experienceSince
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "experienceSince" TIMESTAMP(3);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Add profilePhoto
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "profilePhoto" TEXT;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Create agent_documents table
CREATE TABLE IF NOT EXISTS "agent_documents" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" "AgentDocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileSize" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "agent_documents_pkey" PRIMARY KEY ("id")
);

-- Add foreign key on agent_documents
DO $$ BEGIN
    ALTER TABLE "agent_documents" ADD CONSTRAINT "agent_documents_agentId_fkey"
        FOREIGN KEY ("agentId") REFERENCES "agent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Backfill existing agents so they are not locked out
UPDATE "agent_profiles" SET "approvalStatus" = 'APPROVED' WHERE "approvalStatus" = 'DRAFT';
