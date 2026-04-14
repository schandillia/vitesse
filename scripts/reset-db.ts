import { db } from "@/db/drizzle"
import { sql } from "drizzle-orm"

async function resetDb() {
  const tables = await db.execute(sql`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  `)

  if (tables.rows.length === 0) {
    console.log("No tables found")
    process.exit(0)
  }

  const tableNames = tables.rows.map((row) => `"${row.tablename}"`).join(", ")

  await db.execute(sql.raw(`DROP TABLE IF EXISTS ${tableNames} CASCADE`))
  console.log(`✓ Dropped tables: ${tableNames}`)
  process.exit(0)
}

resetDb().catch((err) => {
  console.error(err)
  process.exit(1)
})
