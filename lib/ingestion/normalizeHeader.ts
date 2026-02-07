const ORDINAL_MAP: Record<string, string> = {
  '1st': 'first',
  '2nd': 'second',
  '3rd': 'third',
  '4th': 'fourth',
}

export function normalizeHeader(header: string): string {
  let h = header.trim().toLowerCase()

  // ordinal replacement
  for (const [k, v] of Object.entries(ORDINAL_MAP)) {
    if (h.startsWith(k + '_')) {
      h = h.replace(k, v)
    }
  }

  return h
    .replace(/['"]/g, '')
    .replace(/[().]/g, '')
    .replace(/\//g, '_')
    .replace(/__+/g, '_')
    .replace(/[^a-z0-9_]/g, '_')
}
