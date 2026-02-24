// lib/excel/parseExcelStream.ts

import ExcelJS from 'exceljs'
import { Readable } from 'stream'

export async function* parseExcelStream(
  data: Buffer,
  batchSize = 5000
) {
  const stream = Readable.from(data)

  const workbook = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
    entries: 'emit',
    sharedStrings: 'cache',
    hyperlinks: 'ignore',
    worksheets: 'emit',
  })

  let headers: string[] = []
  let batch: Record<string, any>[] = []
  let isHeaderRead = false

  for await (const worksheet of workbook) {
    for await (const row of worksheet) {

      /* ===============================
         1️⃣ READ HEADER ROW
      =============================== */
      if (!isHeaderRead) {
        const rowValues = (row.values ?? []) as ExcelJS.CellValue[]

        headers = rowValues
          .slice(1)
          .map(v => String(v ?? '').trim())

        if (headers.length === 0) {
          throw new Error('Excel file has no headers')
        }

        isHeaderRead = true
        continue
      }

      /* ===============================
         2️⃣ PROCESS DATA ROW
      =============================== */
      const record: Record<string, any> = {}
      let isEmpty = true

      for (let i = 0; i < headers.length; i++) {
        const value = row.getCell(i + 1).value ?? null
        record[headers[i]] = value

        if (value !== null && value !== '') {
          isEmpty = false
        }
      }

      if (!isEmpty) {
        batch.push(record)
      }


      if (batch.length >= batchSize) {
        yield batch
        batch = []
      }
    }

    break // Only first worksheet
  }

  if (batch.length > 0) {
    yield batch
  }
}
