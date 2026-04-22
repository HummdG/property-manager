-- Add PENDING_INFO to AgentApprovalStatus enum (handles enum not yet existing)
DO $$ BEGIN
    ALTER TYPE "AgentApprovalStatus" ADD VALUE 'PENDING_INFO';
EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN duplicate_object THEN NULL;
END $$;

-- Add infoRequestNote column (handles table not yet existing)
DO $$ BEGIN
    ALTER TABLE "agent_profiles" ADD COLUMN "infoRequestNote" TEXT;
EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN duplicate_column THEN NULL;
END $$;
