export function HeroPattern() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full text-forest-800 opacity-35" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 560" fill="none">
      <defs><pattern id="hero-dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="currentColor" /></pattern></defs>
      <rect width="1440" height="560" fill="url(#hero-dots)" />
      <g stroke="currentColor" strokeWidth="2">
        <rect x="840" y="64" width="368" height="408" rx="20" />
        <path d="M872 112h184m-184 24h112m-112 48h304m-304 64h304m-304 64h304m-304 64h304m-304 64h184" />
        <path d="M1280 160h160m-160 64h160m-160 64h160M0 392h128m-128 64h200" />
      </g>
    </svg>
  )
}
