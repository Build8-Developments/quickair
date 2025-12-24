#!/usr/bin/env node

/**
 * Apply database indexes directly to SQLite database
 * This runs independently of Strapi
 */

const path = require("path");
const fs = require("fs");

async function applyIndexes() {
  console.log("🗄️  Applying database performance indexes...");

  const dbPath = path.join(__dirname, "..", ".tmp", "data.db");

  if (!fs.existsSync(dbPath)) {
    console.log("⚠️  Database file not found, skipping index creation");
    console.log("   Indexes will be created on first Strapi startup");
    return;
  }

  try {
    const Database = require("better-sqlite3");
    const db = new Database(dbPath);

    console.log("📊 Connected to database");

    // Enable WAL mode for better performance
    db.pragma("journal_mode = WAL");
    console.log("✅ Enabled WAL mode");

    // List of indexes to create
    const indexes = [
      // Offers table
      "CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC)",
      "CREATE INDEX IF NOT EXISTS idx_offers_published_at ON offers(published_at)",
      "CREATE INDEX IF NOT EXISTS idx_offers_locale ON offers(locale)",
      "CREATE INDEX IF NOT EXISTS idx_offers_document_id ON offers(document_id)",

      // Locations table
      "CREATE INDEX IF NOT EXISTS idx_locations_featured ON locations(featured)",
      "CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name)",
      "CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug)",
      "CREATE INDEX IF NOT EXISTS idx_locations_document_id ON locations(document_id)",

      // Hotels table
      "CREATE INDEX IF NOT EXISTS idx_hotels_document_id ON hotels(document_id)",
    ];

    // Check for optional tables and add their indexes
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all()
      .map((r) => r.name);

    if (tables.includes("components_offer_hotel_options")) {
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_hotel_options_hotel ON components_offer_hotel_options(hotel_id)"
      );
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_hotel_options_meal_plan ON components_offer_hotel_options(meal_plan_id)"
      );
    }

    if (tables.includes("hotels_amenities_lnk")) {
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_hotels_amenities_hotel ON hotels_amenities_lnk(hotel_id)"
      );
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_hotels_amenities_amenity ON hotels_amenities_lnk(amenity_id)"
      );
    }

    if (tables.includes("hotels_location_lnk")) {
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_hotels_location_lnk_hotel ON hotels_location_lnk(hotel_id)"
      );
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_hotels_location_lnk_location ON hotels_location_lnk(location_id)"
      );
    }

    if (tables.includes("offers_location_lnk")) {
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_offers_location_lnk_offer ON offers_location_lnk(offer_id)"
      );
      indexes.push(
        "CREATE INDEX IF NOT EXISTS idx_offers_location_lnk_location ON offers_location_lnk(location_id)"
      );
    }

    // Apply all indexes
    let created = 0;
    for (const indexSql of indexes) {
      try {
        db.exec(indexSql);
        created++;
      } catch (error) {
        // Index might already exist or table might not exist
        console.log(`⚠️  Skipped: ${indexSql.split("ON")[0].trim()}`);
      }
    }

    console.log(`✅ Created/verified ${created} database indexes`);

    db.close();
    console.log("✅ Database indexes applied successfully");
  } catch (error) {
    console.error("❌ Failed to apply indexes:", error.message);
    process.exit(1);
  }
}

applyIndexes();
