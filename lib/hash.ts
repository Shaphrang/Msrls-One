import crypto from 'crypto'

/**
 * Computes a deterministic hash for a snapshot row.
 * - Ignores ordering
 * - Ignores undefined vs null differences
 * - Stable across runs
 */
export function computeHash(row: Record<string, any>): string {
  const normalized: Record<string, any> = {}

  Object.keys(row)
    .sort()
    .forEach(key => {
      const value = row[key]
      normalized[key] =
        value === undefined ? null : value
    })

  return crypto
    .createHash('sha256')
    .update(JSON.stringify(normalized))
    .digest('hex')
}
