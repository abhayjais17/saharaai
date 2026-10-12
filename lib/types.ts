export type Language = "hi" | "en";

// Fields containing "hindi" keep their names for compatibility but hold text in the REQUESTED language ("hi" or "en"). Do not rename them.
export type Intent = "form_scan" | "explain_message" | "website_form" | "unknown";

export interface IntentResult { intent: Intent; confidence: number; reply_hindi: string; }

export interface FieldBox { x: number; y: number; w: number; h: number; } // normalized 0..1 relative to the image

export interface GuideField {
  id: number;
  label: string;                 // short field name in the requested language
  hindi_explanation: string;     // what to write, in the requested spoken language
  format_hint: string | null;    // e.g. "DD/MM/YYYY"
  type: "text" | "date" | "choice" | "signature" | "photo" | "number" | "checkbox";
  box: FieldBox | null;          // null for website-by-URL fields (no image)
  profile_key?: "name" | "father_name" | "dob" | "mobile" | "address" | null; // lets the app offer saved details
}

export interface FormAnalysis {
  form_title: string;
  total_fields: number;
  fields: GuideField[];
  final_checklist_hindi: string[];
}

export interface MessageExplanation {
  message_type: string;          // e.g. "electricity_bill", "bank_debit", "kyc_scam"
  summary_hindi: string;
  amount: string | null;         // e.g. "₹840"
  due_date: string | null;
  sender: string | null;
  next_steps_hindi: string[];
  is_suspicious: boolean;
  warning_hindi: string | null;
  suspicious_reasons_hindi?: string[];
}

export interface ApiError { error: string; message_hindi: string; }
