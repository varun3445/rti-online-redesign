// Small inline stroke icons — no icon library dependency, just enough
// visual variety for the example cards (Craft's icon-row mechanic).

const shared = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ClockIcon() {
  return (
    <svg {...shared} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function DocumentIcon() {
  return (
    <svg {...shared} aria-hidden="true">
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 12h5M9.5 15.5h5" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg {...shared} aria-hidden="true">
      <path d="M4 5h16v11H8l-4 4z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  );
}

export function CoinsIcon() {
  return (
    <svg {...shared} aria-hidden="true">
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v5c0 1.66 2.69 3 6 3s6-1.34 6-3V7" />
      <path d="M3 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
      <path d="M15 9.3c2.9.36 5 1.55 5 2.95 0 1.4-2.1 2.59-5 2.95" />
    </svg>
  );
}

export function BuildingIcon() {
  return (
    <svg {...shared} aria-hidden="true">
      <path d="M5 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16" />
      <path d="M13 10h5a1 1 0 0 1 1 1v10" />
      <path d="M8 8h1M8 11h1M8 14h1M8 17h1M16.5 13.5h1M16.5 16.5h1" />
      <path d="M3 21h18" />
    </svg>
  );
}

export function MapPinCheckIcon() {
  return (
    <svg {...shared} aria-hidden="true">
      <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" />
      <path d="M9 10.5l2 2 4-4" />
    </svg>
  );
}
