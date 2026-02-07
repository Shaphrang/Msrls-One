import { normalizeHeader } from './normalizeHeader'
import { HEADER_ALIASES } from './aliasMap'

export function normalizeRow(
  row: Record<string, any>
): Record<string, any> {
  const out: Record<string, any> = {}

  for (const [rawKey, value] of Object.entries(row)) {
    const normalizedKey = normalizeHeader(rawKey)
    const finalKey =
      HEADER_ALIASES[normalizedKey] ?? normalizedKey

    out[finalKey] = value
  }

  return out
}
