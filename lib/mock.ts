import type { FieldBox, FormAnalysis, IntentResult, Language, MessageExplanation } from './types'

const box = (x: number, y: number, w: number, h: number): FieldBox => ({
  x: x / 800, y: y / 1100, w: w / 800, h: h / 1100,
})

export const MOCK_FORM_HI: FormAnalysis = {
  form_title: 'छात्रवृत्ति आवेदन पत्र',
  total_fields: 10,
  fields: [
    { id: 1, label: 'नाम', hindi_explanation: 'इस खाने में अपना पूरा नाम लिखिए, बिल्कुल वैसे जैसे आधार कार्ड पर है।', format_hint: null, type: 'text', box: box(60, 260, 680, 48), profile_key: 'name' },
    { id: 2, label: 'पिता का नाम', hindi_explanation: 'यहाँ अपने पिताजी का पूरा नाम लिखिए।', format_hint: null, type: 'text', box: box(60, 340, 680, 48), profile_key: 'father_name' },
    { id: 3, label: 'जन्म तिथि', hindi_explanation: 'तारीख़ इस तरह लिखिए: दिन/महीना/साल।', format_hint: 'DD/MM/YYYY', type: 'date', box: box(60, 420, 320, 48), profile_key: 'dob' },
    { id: 4, label: 'लिंग', hindi_explanation: 'अपने सामने वाला विकल्प चुनिए और उस पर सही का निशान लगाइए।', format_hint: null, type: 'choice', box: box(420, 420, 320, 48) },
    { id: 5, label: 'मोबाइल नंबर', hindi_explanation: 'अपना 10 अंकों का मोबाइल नंबर लिखिए।', format_hint: null, type: 'number', box: box(60, 500, 680, 48), profile_key: 'mobile' },
    { id: 6, label: 'श्रेणी (Category)', hindi_explanation: 'सामान्य, OBC, SC या ST में से जो आपका है, उसी पर निशान लगाइए।', format_hint: null, type: 'choice', box: box(60, 580, 680, 48) },
    { id: 7, label: 'कोर्स का नाम', hindi_explanation: 'आप जिस कोर्स में पढ़ रहे हैं, उसका नाम लिखिए। जैसे BCA।', format_hint: null, type: 'text', box: box(60, 660, 680, 48) },
    { id: 8, label: 'कॉलेज का नाम', hindi_explanation: 'अपने कॉलेज का पूरा नाम लिखिए।', format_hint: null, type: 'text', box: box(60, 740, 680, 48) },
    { id: 9, label: 'पता', hindi_explanation: 'अपना पूरा पता लिखिए, पिन कोड के साथ।', format_hint: null, type: 'text', box: box(60, 820, 680, 80), profile_key: 'address' },
    { id: 10, label: 'हस्ताक्षर', hindi_explanation: 'यहाँ आप ख़ुद अपने हस्ताक्षर कीजिए। यह कोई और नहीं कर सकता।', format_hint: null, type: 'signature', box: box(440, 950, 300, 50) },
  ],
  final_checklist_hindi: ['सारे खाने भर लिए?', 'हस्ताक्षर कर दिए?', 'फ़ोटो चिपका दी?', 'आधार और मार्कशीट की कॉपी साथ लगाई?'],
}

export const MOCK_BILL_SMS = 'Dear Consumer, your electricity bill of Rs 840.00 for Consumer No 4471290 is due on 15-Oct-2026. Pay online at the official MP Bijli app to avoid late fee.'

export const MOCK_BILL_HI: MessageExplanation = {
  message_type: 'electricity_bill',
  summary_hindi: 'यह आपके बिजली बिल का संदेश है। इस बार ₹840 भरने हैं। आख़िरी तारीख़ 15 अक्टूबर है।',
  amount: '₹840',
  due_date: '15 अक्टूबर 2026',
  sender: 'बिजली विभाग',
  next_steps_hindi: ['अपने फ़ोन में बिजली विभाग का आधिकारिक ऐप खोलिए।', 'उपभोक्ता नंबर 4471290 डालकर बिल देखिए।', 'देर से भरने पर अतिरिक्त शुल्क लग सकता है, इसलिए 15 तारीख़ से पहले भर दीजिए।'],
  is_suspicious: false,
  warning_hindi: null,
}

export const MOCK_SCAM_SMS = 'URGENT: Your bank account will be blocked today. Update KYC now at http://sbi-kyc-update.in/login and share OTP to avoid closure.'

export const MOCK_SCAM_HI: MessageExplanation = {
  message_type: 'kyc_scam',
  summary_hindi: 'यह संदेश बैंक का नहीं लगता। इसमें आपसे OTP और लिंक पर जानकारी माँगी जा रही है।',
  amount: null,
  due_date: null,
  sender: null,
  next_steps_hindi: ['इस पर कोई जवाब न दीजिए।', 'अपने बैंक की शाखा या आधिकारिक नंबर पर ख़ुद फ़ोन करके पूछिए।', 'संदेश को मिटा दीजिए।'],
  is_suspicious: true,
  warning_hindi: 'यह संदेश संदिग्ध लगता है। लिंक न खोलें और OTP किसी को न बताएँ।',
  suspicious_reasons_hindi: ['जल्दबाज़ी करवाई जा रही है ("आज ही")', 'संदिग्ध लिंक दिया गया है', 'OTP माँगा जा रहा है, असली बैंक कभी OTP नहीं माँगता'],
}

export const MOCK_WEBSITE_FORM_HI: FormAnalysis = {
  form_title: 'राज्य छात्रवृत्ति पोर्टल: आवेदन',
  total_fields: 6,
  fields: [
    { id: 1, label: 'आवेदक का नाम', hindi_explanation: 'यहाँ अपना पूरा नाम लिखिए, जैसा आपके कागज़ों में है।', format_hint: null, type: 'text', box: null, profile_key: 'name' },
    { id: 2, label: 'आधार से जुड़ा मोबाइल', hindi_explanation: 'आधार से जुड़ा 10 अंकों का मोबाइल नंबर वेबसाइट पर लिखिए। OTP किसी को न बताइए।', format_hint: null, type: 'number', box: null, profile_key: 'mobile' },
    { id: 3, label: 'ईमेल (वैकल्पिक)', hindi_explanation: 'अगर आपका ईमेल है तो लिखिए। नहीं है तो यह खाना खाली छोड़ सकते हैं।', format_hint: null, type: 'text', box: null },
    { id: 4, label: 'बैंक खाता संख्या', hindi_explanation: 'अपनी पासबुक देखकर खाता संख्या असली वेबसाइट पर ख़ुद लिखिए। इसे यहाँ न लिखिए और किसी के साथ साझा न कीजिए।', format_hint: null, type: 'number', box: null },
    { id: 5, label: 'IFSC कोड', hindi_explanation: 'पासबुक में लिखा IFSC कोड असली वेबसाइट पर लिखिए। अक्षर और अंक ध्यान से मिलाइए।', format_hint: null, type: 'text', box: null },
    { id: 6, label: 'घोषणा', hindi_explanation: 'घोषणा ध्यान से पढ़िए। सारी जानकारी सही हो और आप सहमत हों, तभी सही का निशान लगाइए। आख़िरी बटन आप ख़ुद दबाइए।', format_hint: null, type: 'checkbox', box: null },
  ],
  final_checklist_hindi: ['नाम और मोबाइल सही हैं?', 'बैंक की जानकारी पासबुक से मिला ली?', 'घोषणा पढ़ ली?', 'आख़िरी बटन आप ख़ुद दबाइए।'],
}

const formFieldsEn = [
  ['Name', 'Write your full name in this box, exactly as it appears on your Aadhaar card.'],
  ["Father’s name", 'Write your father’s full name here.'],
  ['Date of birth', 'Write the date like this: day/month/year.'],
  ['Gender', 'Choose the option that applies to you and put a tick beside it.'],
  ['Mobile number', 'Write your 10-digit mobile number.'],
  ['Category', 'Tick your category: General, OBC, SC or ST.'],
  ['Course name', 'Write the name of the course you are studying, such as BCA.'],
  ['College name', 'Write the full name of your college.'],
  ['Address', 'Write your full address, including the PIN code.'],
  ['Signature', 'Sign here yourself. No one else can sign for you.'],
] as const

export const MOCK_FORM_EN: FormAnalysis = {
  ...structuredClone(MOCK_FORM_HI),
  form_title: 'Scholarship Application Form',
  fields: MOCK_FORM_HI.fields.map((field, index) => ({
    ...structuredClone(field), label: formFieldsEn[index][0], hindi_explanation: formFieldsEn[index][1],
  })),
  final_checklist_hindi: ['Filled in every box?', 'Signed the form?', 'Attached your photo?', 'Attached copies of your Aadhaar card and marksheet?'],
}

export const MOCK_BILL_EN: MessageExplanation = {
  ...structuredClone(MOCK_BILL_HI),
  summary_hindi: 'This is a message about your electricity bill. You need to pay ₹840. The last date is 15 October.',
  due_date: '15 October 2026',
  sender: 'Electricity department',
  next_steps_hindi: ['Open the electricity department’s official app on your phone.', 'Enter consumer number 4471290 to view your bill.', 'Pay before the 15th to avoid a late fee.'],
}

export const MOCK_SCAM_EN: MessageExplanation = {
  ...structuredClone(MOCK_SCAM_HI),
  summary_hindi: 'This message does not seem to be from your bank. It asks for your OTP and personal details through a link.',
  next_steps_hindi: ['Do not reply to this message.', 'Contact your bank branch or call its official number yourself to check.', 'Delete the message.'],
  warning_hindi: 'This message looks suspicious. Do not open the link or share your OTP.',
  suspicious_reasons_hindi: ['It pressures you to act immediately ("today").', 'It includes a suspicious link.', 'It asks for your OTP. A real bank never asks you to share your OTP.'],
}

const websiteFieldsEn = [
  ['Applicant’s name', 'Write your full name as it appears on your documents.'],
  ['Mobile linked to Aadhaar', 'Enter the 10-digit mobile number linked to your Aadhaar on the website. Never share your OTP.'],
  ['Email (optional)', 'Enter your email if you have one. You can leave this box empty if you do not.'],
  ['Bank account number', 'Check your passbook and type the account number yourself on the official website. Do not enter it here or share it with anyone.'],
  ['IFSC code', 'Enter the IFSC code from your passbook on the official website. Check each letter and number carefully.'],
  ['Declaration', 'Read the declaration carefully. Tick the box only if all the details are correct and you agree. Press the final button yourself.'],
] as const

export const MOCK_WEBSITE_FORM_EN: FormAnalysis = {
  ...structuredClone(MOCK_WEBSITE_FORM_HI),
  form_title: 'State Scholarship Portal: Application',
  fields: MOCK_WEBSITE_FORM_HI.fields.map((field, index) => ({
    ...structuredClone(field), label: websiteFieldsEn[index][0], hindi_explanation: websiteFieldsEn[index][1],
  })),
  final_checklist_hindi: ['Are your name and mobile number correct?', 'Checked your bank details against your passbook?', 'Read the declaration?', 'Press the final button yourself.'],
}

export const MOCK_FORM = { hi: MOCK_FORM_HI, en: MOCK_FORM_EN }
export const MOCK_BILL = { hi: MOCK_BILL_HI, en: MOCK_BILL_EN }
export const MOCK_SCAM = { hi: MOCK_SCAM_HI, en: MOCK_SCAM_EN }
export const MOCK_WEBSITE_FORM = { hi: MOCK_WEBSITE_FORM_HI, en: MOCK_WEBSITE_FORM_EN }

export const getMockForm = (language: Language): FormAnalysis => structuredClone(MOCK_FORM[language])
export const getMockBill = (language: Language): MessageExplanation => structuredClone(MOCK_BILL[language])
export const getMockScam = (language: Language): MessageExplanation => structuredClone(MOCK_SCAM[language])
export const getMockWebsiteForm = (language: Language): FormAnalysis => structuredClone(MOCK_WEBSITE_FORM[language])

const intentReplies = {
  hi: {
    website_form: 'वेबसाइट का लिंक या स्क्रीनशॉट दीजिए। मैं एक-एक खाना समझाऊँगा।',
    form_scan: 'फ़ॉर्म की फ़ोटो दिखाइए। मैं एक-एक खाना समझाऊँगा।',
    explain_message: 'मैसेज या बिल दिखाइए। मैं आसान हिंदी में समझाऊँगा।',
    unknown: 'आप फ़ॉर्म भरना चाहते हैं या कोई मैसेज समझना चाहते हैं? थोड़ा और बताइए।',
  },
  en: {
    website_form: 'Share the website link or a screenshot. I will explain one field at a time.',
    form_scan: 'Show me a photo of the form. I will explain one field at a time.',
    explain_message: 'Show me the message or bill. I will explain it in simple English.',
    unknown: 'Would you like help filling a form or understanding a message? Tell me a little more.',
  },
}

export function mockDetectIntent(transcript: string, language: Language): IntentResult {
  const text = transcript.normalize('NFC').toLowerCase()
  const intent = /वेबसाइट|website|portal|पोर्टल/u.test(text) ? 'website_form'
    : /फ़ॉर्म|फॉर्म|form/u.test(text) ? 'form_scan'
    : /बिल|मैसेज|bill|message|sms/u.test(text) ? 'explain_message' : 'unknown'
  return { intent, confidence: intent === 'unknown' ? 0.2 : 0.96, reply_hindi: intentReplies[language][intent] }
}
