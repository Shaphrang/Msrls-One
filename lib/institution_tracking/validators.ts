// /lib/validators.ts

export function validateHeaders(
  rows: any[],
  requiredHeaders: string[]
) {
  if (!rows || rows.length === 0) {
    throw new Error("Excel file is empty");
  }

  const fileHeaders = Object.keys(rows[0]).map(h => h.trim());

  for (const header of requiredHeaders) {
    if (!fileHeaders.includes(header)) {
      throw new Error(`Missing required column: ${header}`);
    }
  }
}

export function validateRowBasics(row: any) {
  if (!row.district || !row.block) {
    throw new Error("District or Block missing in a row");
  }
}

export function toNumber(value: any) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const num = Number(value);

  if (isNaN(num)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }

  return num;
}
