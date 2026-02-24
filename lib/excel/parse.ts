//lib\excel\parse.ts
import * as XLSX from 'xlsx'

export type ParsedExcel = {
  headers: string[]
  rows: Record<string, any>[]
  rowCount: number
}

export function parseExcel(buffer: Buffer): ParsedExcel {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const json: Record<string, any>[] =
    XLSX.utils.sheet_to_json(sheet, {
      defval: null,
      raw: false,
    })

  const headers =
    json.length > 0
      ? Object.keys(json[0])
      : []

  return {
    headers,
    rows: json,
    rowCount: json.length,
  }
}
