export function StepIllustration({ step }: { step: 1 | 2 | 3 }) {
  return (
    <svg viewBox="0 0 144 96" fill="none" aria-hidden="true" className="aspect-[3/2] w-32 shrink-0 text-peacock">
      {step === 1 && <>
        <rect x="38" y="10" width="56" height="74" rx="5" fill="var(--paper)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M49 27h22m-22 10h34m-34 10h34m-34 10h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="78" y="38" width="31" height="50" rx="6" fill="var(--mint-soft)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M88 44h11m-8 36h5M29 24v-9h9m64 0h9v9M29 67v9h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="93.5" cy="62" r="7" stroke="currentColor" strokeWidth="1.5" />
      </>}
      {step === 2 && <>
        <path d="M28 18h78a9 9 0 0 1 9 9v39a9 9 0 0 1-9 9H56L40 87V75H28a9 9 0 0 1-9-9V27a9 9 0 0 1 9-9Z" fill="var(--mint-soft)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M38 42v10m10-20v30m10-23v16m10-30v43m10-32v21m10-25v30m10-20v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </>}
      {step === 3 && <>
        <rect x="32" y="9" width="65" height="78" rx="5" fill="var(--paper)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M44 24h33m-20 15h25m-25 16h25m-25 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="m43 38 3 3 5-6m-8 19 3 3 5-6m-8 19 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="102" cy="65" r="18" fill="var(--mint-soft)" stroke="currentColor" strokeWidth="1.5" />
        <path d="m94 65 5 5 10-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </>}
    </svg>
  )
}
