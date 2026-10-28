import type { SVGProps } from 'react'

// Podium icon used beside the community rank.
export function PodiumIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" {...props}>
      <path d="M9 21V4h6v17M3 21v-9h6M15 21V9h6v12M2 21h20" />
    </svg>
  )
}

// Signal-arc icon used beside impact points.
export function ImpactIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M3 15a9 9 0 0 1 18 0" />
      <path d="M6.5 15a5.5 5.5 0 0 1 11 0" />
      <path d="M10 15a2 2 0 0 1 4 0" />
      <path d="M12 15l4.5-6" />
    </svg>
  )
}

// Medal with ribbon used for the leaderboard nav item.
export function LeaderboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" {...props}>
      <path d="M7 3l3 6M17 3l-3 6M9.5 3h5" strokeLinecap="round" />
      <circle cx="12" cy="15" r="6" />
      <circle cx="7" cy="15" r="3" fill="currentColor" stroke="none" opacity={0.85} />
      <circle cx="17" cy="15" r="3" fill="currentColor" stroke="none" opacity={0.85} />
      <circle cx="12" cy="15" r="2.4" />
    </svg>
  )
}
