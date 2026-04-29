import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs"
import { join } from "path"

const ROOT = process.cwd()
const SOURCE = join(ROOT, ".env")
const OUTPUT = join(ROOT, ".env.example")

// ── Validate source exists ────────────────────────────────────────────────────

if (!existsSync(SOURCE)) {
  console.error("✗ .env not found. Nothing to do.")
  process.exit(1)
}

// ── Read & transform ──────────────────────────────────────────────────────────

const source = readFileSync(SOURCE, "utf-8")

const transformed = source
  .split("\n")
  .map((line) => {
    const trimmed = line.trim()

    // Preserve empty lines and comments as-is
    if (trimmed === "" || trimmed.startsWith("#")) return line

    // For key=value lines, strip the value
    const eqIndex = line.indexOf("=")
    if (eqIndex !== -1) return line.slice(0, eqIndex + 1)

    // Anything else (malformed lines), preserve as-is
    return line
  })
  .join("\n")

// ── Write output (overwrite if exists) ───────────────────────────────────────

if (existsSync(OUTPUT)) {
  unlinkSync(OUTPUT)
  console.log("↺  Existing .env.example removed.")
}

writeFileSync(OUTPUT, transformed, "utf-8")
console.log("✓  .env.example generated successfully.")
