export const HEADER_ALIASES: Record<string, string> = {
  // geography
  gp: 'gram_panchayat',

  // parents / hierarchy
  parent_cbo: 'parent_clf_name',
  primary_parent_cbo_vo: 'parent_vo_name',
  secondary_parent_cbo_clf: 'parent_clf_name',

  // member specific
  father_mother_spouse_name: 'guardian_name',
  relation: 'guardian_relation',
  account_number_default: 'account_number_default',

  // dates
  date_of_joining_in_shg: 'date_of_joining_shg',

  // mobile
  ebk_mobile_no: 'ebk_mobile_no',
  mobile_no: 'mobile_no',

  // status naming
  status_active_inactive: 'status',
  inactive_reject_reason: 'inactive_reject_reason',

  // misc consistency
  promoters_name: 'promoter_name',
}
