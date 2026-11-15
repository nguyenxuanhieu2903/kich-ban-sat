-- =============================================================================
-- Migration: V0__init_schema.sql
-- Description: Baseline schema initialization for Kịch Bản Sát
-- Note: Phase Foundation only initializes the database infrastructure baseline.
-- Business tables (games, game_rooms, room_participants, dm_assignments, etc.)
-- will be defined strictly in Phase 5 upon official ERD approval.
-- =============================================================================

-- Ensure necessary PostgreSQL extensions (if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema comment
COMMENT ON SCHEMA public IS 'Kịch Bản Sát Production Schema - Initialized in Foundation';
