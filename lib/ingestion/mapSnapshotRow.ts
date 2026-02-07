import { EntityType } from '@/lib/validation/schema'

export function mapSnapshotRow(
  entity: EntityType,
  row: Record<string, any>
) {
  switch (entity) {
    case 'VO':
      return {
        ...row,
        parent_clf_name: row['parent_cbo'] ?? null,
        clf_code: null,
      }

    case 'SHG':
      return {
        ...row,
        parent_vo_name: row['primary_parent_cbo_(vo)'] ?? null,
        parent_clf_name: row['secondary_parent_cbo_(clf)'] ?? null,
        vo_code: null,
        clf_code: null,
      }

    default:
      return row
  }
}
