// lib/validation/schema.ts
export type EntityType = 'CLF' | 'VO' | 'SHG' | 'MEMBER'

export interface EntitySchema {
  entity: EntityType
  primary_key: string
  required_columns: string[]
  optional_columns: string[]
}

/**
 * RULES:
 * - ALL column names are FINAL normalized names
 * - They MUST exist in snapshot tables
 * - NO raw Excel headers here
 * - NO aliases here
 */

/* =========================================================
   CLF
   ========================================================= */
export const CLF_SCHEMA: EntitySchema = {
  entity: 'CLF',
  primary_key: 'clf_code',
  required_columns: ['clf_code'],
  optional_columns: [
    'state',
    'district',
    'block',
    'region',
    'clf_name',
    'clf_nic_code',
    'date_of_formation',
    'mapped_vos',
    'ec_members_count',
    'no_of_signatories',
    'ebk_id',
    'ebk_name',
    'ebk_mobile_no',
    'approval_status',
    'first_time_approval_date',
    'status',
    'inactive_reject_date',
    'inactive_rejection_reason',
    'migrated_lokos',
    'president',
    'secretary',
    'promoted_by',
    'promoter_name',
    'co_option_status',
    'co_option_revival_date',
    'meeting_frequency',
    'savings_frequency',
    'savings_amount',
    'tenure_of_office_bearers_months',
    'registration_number',
    'registration_act',
    'registration_date',

    /* bank accounts */
    'first_account_number',
    'first_account_type',
    'first_ifsc',
    'first_branch_name',
    'first_bank_name',
    'first_account_opening_date',
    'second_account_number',
    'second_account_type',
    'second_ifsc',
    'second_branch_name',
    'second_bank_name',
    'second_account_opening_date',
    'third_account_number',
    'third_account_type',
    'third_ifsc',
    'third_branch_name',
    'third_bank_name',
    'third_account_opening_date',
  ],
}

/* =========================================================
   VO
   ========================================================= */
export const VO_SCHEMA: EntitySchema = {
  entity: 'VO',
  primary_key: 'vo_code',
  required_columns: [
    'vo_code',
    'parent_clf_name', // derived from parent_cbo
  ],
  optional_columns: [
    'state',
    'district',
    'block',
    'region',
    'gram_panchayat',
    'village',
    'vo_name',
    'vo_nic_code',
    'date_of_formation',
    'mapped_shgs',
    'ec_members_count',
    'no_of_signatories',
    'approval_status',
    'first_time_approval_date',
    'status',
    'inactive_reject_date',
    'inactive_rejection_reason',
    'migrated_lokos',
    'president',
    'secretary',
    'promoted_by',
    'promoter_name',
    'co_option_status',
    'co_option_revival_date',
    'meeting_frequency',
    'financial_intermediation',
    'savings_frequency',
    'savings_amount',
    'tenure_of_office_bearers_months',
    'registration_number',
    'registration_act',
    'registration_date',
    'ebk_id',
    'ebk_name',
    'ebk_mobile_no',

    /* hierarchy */
    'parent_clf_name',
    'parent_cbo',

    /* bank accounts */
    'first_account_number',
    'first_account_type',
    'first_ifsc',
    'first_branch_name',
    'first_bank_name',
    'first_account_opening_date',
    'second_account_number',
    'second_account_type',
    'second_ifsc',
    'second_branch_name',
    'second_bank_name',
    'second_account_opening_date',
    'third_account_number',
    'third_account_type',
    'third_ifsc',
    'third_branch_name',
    'third_bank_name',
    'third_account_opening_date',
  ],
}

/* =========================================================
   SHG
   ========================================================= */
export const SHG_SCHEMA: EntitySchema = {
  entity: 'SHG',
  primary_key: 'shg_code',
  required_columns: [
    'shg_code',
    'parent_vo_name',
  ],
  optional_columns: [
    'state',
    'district',
    'block',
    'region',
    'gram_panchayat',
    'village',
    'shg_name',
    'shg_nic_code',
    'shg_category',
    'shg_type',
    'special_shg_type',
    'date_of_formation',
    'active_members',
    'approval_status',
    'first_time_approval_date',
    'status',
    'inactive_reject_date',
    'inactive_reject_reason',
    'migrated_lokos',
    'promoted_by',
    'promoter_name',
    'meeting_frequency',
    'savings_frequency',
    'savings_amount',
    'tenure_of_office_bearers_months',
    'primary_livelihoods',
    'secondary_livelihoods',
    'tertiary_livelihoods',
    'ebk_id',
    'ebk_name',
    'ebk_mobile_no',

    /* hierarchy */
    'parent_vo_name',
    'parent_clf_name',

    /* bank accounts */
    'first_account_number',
    'first_account_type',
    'first_ifsc',
    'first_branch_name',
    'first_bank_name',
    'first_account_opening_date',
    'second_account_number',
    'second_account_type',
    'second_ifsc',
    'second_branch_name',
    'second_bank_name',
    'second_account_opening_date',
    'third_account_number',
    'third_account_type',
    'third_ifsc',
    'third_branch_name',
    'third_bank_name',
    'third_account_opening_date',
  ],
}

/* =========================================================
   MEMBER
   ========================================================= */
export const MEMBER_SCHEMA: EntitySchema = {
  entity: 'MEMBER',
  primary_key: 'member_code',
  required_columns: [
    'member_code',
    'shg_code',
  ],
  optional_columns: [
    'state',
    'district',
    'block',
    'gram_panchayat',
    'village',
    'shg_name',
    'date_of_formation',
    'member_name',
    'date_of_birth',
    'date_of_joining_shg',
    'designation_in_shg',
    'social_category',
    'pvtg_category',
    'religion',
    'gender',
    'education',
    'marital_status',
    'insurance',
    'disability',
    'disability_type',
    'is_head_of_family',
    'guardian_name',
    'guardian_relation',
    'account_number_default',
    'ifsc',
    'branch_name',
    'bank_name',
    'account_opening_date',
    'account_type',
    'mobile_no',
    'aadhaar_kyc',
    'ekyc',
    'cadres_role',
    'primary_livelihoods',
    'secondary_livelihoods',
    'tertiary_livelihoods',
    'nrega_job_card_number',
    'pmayg_id',
    'secc_tin',
    'nrlm_mis_id',
    'state_mis_id',
    'ebk_id',
    'ebk_name',
    'ebk_mobile_no',
    'approval_status',
    'first_time_approval_date',
    'status',
    'inactive_reject_date',
    'inactive_reject_reason',
    'migrated_lokos',
  ],
}

/* =========================================================
   ENTITY MAP
   ========================================================= */
export const ENTITY_SCHEMAS: Record<EntityType, EntitySchema> = {
  CLF: CLF_SCHEMA,
  VO: VO_SCHEMA,
  SHG: SHG_SCHEMA,
  MEMBER: MEMBER_SCHEMA,
}
