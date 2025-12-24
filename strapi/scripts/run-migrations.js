#!/usr/bin/env node

/**
 * Manual migration runner for Strapi
 * Runs all migrations in database/migrations directory
 */

const path = require("path");
const fs = require("fs");

async function runMigrations() {
  console.log("🗄️  Running database migrations...");

  // Get Strapi instance
  const Strapi = require("@strapi/strapi");
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();

  try {
    const migrationsDir = path.join(__dirname, "..", "database", "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".js") && file !== ".gitkeep")
      .sort();

    console.log(`Found ${migrationFiles.length} migration file(s)`);

    for (const file of migrationFiles) {
      console.log(`\n📝 Running migration: ${file}`);
      const migration = require(path.join(migrationsDir, file));

      if (typeof migration.up === "function") {
        await migration.up(app.db.connection);
        console.log(`✅ Migration ${file} completed successfully`);
      } else {
        console.log(`⚠️  Migration ${file} has no 'up' function, skipping`);
      }
    }

    console.log("\n✅ All migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await app.destroy();
  }
}

runMigrations();
