import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Bookmark, BriefcaseBusiness, ChevronDown, ChevronRight, ClipboardClock, FileText, Settings } from 'lucide-react'
import { currentUser } from '../data'
import { useStore } from '../store'
import { LeaderboardIcon } from './icons'
import { Avatar, Card, cn } from './ui'

export function ProfileCard() {
  const { showToast } = useStore()
  const stats = [
    { value: currentUser.posts, label: 'Posts' },
    { value: currentUser.impactPoints, label: 'Impact Points' },
    { value: `#${currentUser.rank}`, label: 'Community Rank' },
  ]
  return (
    <Card className="px-3 pt-4 pb-4">
      <div className="flex items-center gap-4">
        <Avatar src={currentUser.avatar} size={48} online />
        <div className="min-w-0">
          <p className="truncate text-lg leading-6 font-medium text-ink">{currentUser.name}</p>
          <p className="text-xs text-[#5d5d5d]">@{currentUser.handle}</p>
        </div>
      </div>
      <p className="mt-1 text-[11px] font-semibold text-black">{currentUser.role}</p>
      <p className="text-[11px] text-[#7e7e7e]">{currentUser.location}</p>
      <div className="mt-5 grid grid-cols-[1fr_auto_1.3fr_auto_1.3fr] items-center">
        {stats.map((s, i) => (
          <div key={s.label} className="contents">
            {i > 0 && <span className="h-7 w-px bg-[#d9d9d9]" />}
            <div className={cn(i === 0 ? 'text-left' : i === 1 ? 'text-center' : 'text-right')}>
              <p className="text-[15px] leading-5 font-medium text-ink">{s.value}</p>
              <p className="mt-1 text-[7px] text-[#555]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => showToast('Profile page coming soon')}
        className="mt-[22px] h-7 w-full rounded-lg bg-brand-soft text-[11px] font-medium text-brand-strong transition-colors hover:bg-brand-ring/60"
      >
        View Profile
      </button>
    </Card>
  )
}

type LinkItem = { label: string; icon: LucideIcon | typeof LeaderboardIcon; to: string; children?: LinkItem[] }

const homeLinks: LinkItem[] = [
  { label: 'My Projects', icon: FileText, to: '/projects' },
  { label: 'My Opportunities', icon: BriefcaseBusiness, to: '/opportunities' },
  { label: 'Saved posts', icon: Bookmark, to: '/?view=saved' },
  { label: 'My Activities', icon: ClipboardClock, to: '/activities' },
  { label: 'Leaderboard', icon: LeaderboardIcon, to: '/leaderboard' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

const opportunityLinks: LinkItem[] = [
  { label: 'My Projects', icon: FileText, to: '/projects' },
  {
    label: 'My Opportunities',
    icon: BriefcaseBusiness,
    to: '/opportunities',
    children: [
      { label: 'Browse Opportunities', icon: FileText, to: '/opportunities' },
      { label: 'My Opportunities', icon: FileText, to: '/opportunities?view=mine' },
      { label: 'Applied Opportunities', icon: FileText, to: '/opportunities?view=applied' },
      { label: 'Saved Opportunities', icon: FileText, to: '/opportunities?view=saved' },
    ],
  },
  { label: 'My Activities', icon: ClipboardClock, to: '/activities' },
  { label: 'Leaderboard', icon: LeaderboardIcon, to: '/leaderboard' },
  { label: 'Settings', icon: Settings, to: '/settings' },
  { label: 'Saved posts', icon: Bookmark, to: '/?view=saved' },
]

export function QuickLinks({ variant }: { variant: 'list' | 'accordion' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const current = location.pathname + location.search
  const [expanded, setExpanded] = useState<string | null>(variant === 'accordion' ? 'My Opportunities' : null)

  if (variant === 'list') {
    return (
      <Card className="px-3 pt-3 pb-3">
        <h2 className="mb-1 text-lg font-semibold text-brand-brown">Quick Links</h2>
        <ul>
          {homeLinks.map(({ label, icon: Icon, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="group flex h-[39px] items-center gap-2 rounded-md px-2 text-[13px] text-[#363636] transition-colors hover:bg-page"
              >
                <Icon className="size-3.5 text-[#555]" strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                <ChevronRight className="size-4 text-black transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    )
  }

  return (
    <Card className="px-3 pt-3 pb-3">
      <h2 className="mb-1 text-lg font-semibold text-brand-brown">Quick Links</h2>
      <ul>
        {opportunityLinks.map(({ label, icon: Icon, to, children }) => {
          const open = expanded === label
          return (
            <li key={label}>
              <button
                onClick={() => (children ? setExpanded(open ? null : label) : navigate(to))}
                className="flex h-[37px] w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-[#363636] transition-colors hover:bg-page"
              >
                <Icon className="size-3.5 text-[#555]" strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                <ChevronDown
                  className={cn('size-4 text-black transition-transform duration-200', open && children && 'rotate-180')}
                  strokeWidth={2.25}
                />
              </button>
              {children && (
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <ul className="overflow-hidden">
                    {children.map((child) => {
                      const active = current === child.to
                      return (
                        <li key={child.label} className="py-[2.5px]">
                          <Link
                            to={child.to}
                            className={cn(
                              'flex h-[30px] items-center gap-2 rounded px-[18px] text-[11px] transition-colors',
                              active ? 'bg-[#fdefe2] font-medium text-[#fe6201]' : 'text-[#222] hover:bg-page',
                            )}
                          >
                            <child.icon className="size-3.5" strokeWidth={1.8} />
                            {child.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
