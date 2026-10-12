import type { FieldBox, FormAnalysis, GuideField, IntentResult, MessageExplanation } from './types'

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string')
const nullableString = (value: unknown) => value === null || typeof value === 'string'

function isBox(value: unknown): value is FieldBox | null {
  if (value === null) return true
  if (!record(value)) return false
  const { x, y, w, h } = value
  return typeof x === 'number' && typeof y === 'number' && typeof w === 'number' && typeof h === 'number'
    && x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.000001 && y + h <= 1.000001
}

function isField(value: unknown): value is GuideField {
  return record(value) && Number.isInteger(value.id) && typeof value.label === 'string'
    && typeof value.hindi_explanation === 'string' && nullableString(value.format_hint)
    && typeof value.type === 'string' && ['text', 'date', 'choice', 'signature', 'photo', 'number', 'checkbox'].includes(value.type)
    && isBox(value.box)
    && (value.profile_key == null || ['name', 'father_name', 'dob', 'mobile', 'address'].includes(String(value.profile_key)))
}

export function isFormAnalysis(value: unknown): value is FormAnalysis {
  return record(value) && typeof value.form_title === 'string' && Array.isArray(value.fields)
    && value.fields.length > 0 && value.fields.every(isField) && value.total_fields === value.fields.length
    && new Set(value.fields.map(field => field.id)).size === value.fields.length
    && strings(value.final_checklist_hindi)
}

export function isIntentResult(value: unknown): value is IntentResult {
  return record(value) && typeof value.intent === 'string'
    && ['form_scan', 'explain_message', 'website_form', 'unknown'].includes(value.intent)
    && typeof value.confidence === 'number' && value.confidence >= 0 && value.confidence <= 1
    && typeof value.reply_hindi === 'string'
}

export function isMessageExplanation(value: unknown): value is MessageExplanation {
  return record(value) && typeof value.message_type === 'string' && typeof value.summary_hindi === 'string'
    && nullableString(value.amount) && nullableString(value.due_date) && nullableString(value.sender)
    && strings(value.next_steps_hindi) && typeof value.is_suspicious === 'boolean'
    && nullableString(value.warning_hindi)
    && (value.suspicious_reasons_hindi === undefined || strings(value.suspicious_reasons_hindi))
}
