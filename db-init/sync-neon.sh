#!/bin/bash
set -e

echo "📥 Starting automatic Neon Cloud data sync neon-url=${NEON_DATABASE_URL}..."
# 1. This uses the cloud URL variable you passed in compose
pg_dump "$NEON_DATABASE_URL" -F c -b -f /tmp/neon_backup.dump

echo "🧹 Clearing default local database tables..."
# 2. Changed to native $POSTGRES_USER and $POSTGRES_DB
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "🔄 Restoring full schema and data locally pg_user=${POSTGRES_USER}, pg_db=${POSTGRES_DB}..."
# 3. Changed here as well to ensure it targets the correct local database
pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges -v /tmp/neon_backup.dump

echo "🌱 Neon sync complete!"