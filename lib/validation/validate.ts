import { ENTITY_SCHEMAS, EntityType } from './schema'

export interface ValidationResult {
  status: 'VALIDATED' | 'FAILED'
  missing?: string[]
  unknown?: string[]
}

export function validateColumns(
  entity: EntityType,
  headers: string[]
): ValidationResult {
  const schema = ENTITY_SCHEMAS[entity]

  const missing = schema.required_columns.filter(
    col => !headers.includes(col)
  )

  if (missing.length > 0) {
    return {
      status: 'FAILED',
      missing,
    }
  }

  const unknown = headers.filter(
    h =>
      !schema.required_columns.includes(h) &&
      !schema.optional_columns.includes(h)
  )

  return {
    status: 'VALIDATED',
    unknown,
  }
}
