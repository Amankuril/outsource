import { useCallback, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardClock,
  FileText,
  House,
  LogOut,
  Plus,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'
import { currentUser, notifications, users } from '../data'
import { useStore } from '../store'
import { LeaderboardIcon } from './icons'
import { Avatar, Logo, cn, useClickOutside } from './ui'

export const navItems = [
  { to: '/', label: 'Home', icon: House },
  { to: '/projects', label: 'Projects', icon: FileText },
  { to: '/opportunities', label: 'Opportunities', icon: BriefcaseBusiness },
  { to: '/activities', label: 'Activities', icon: ClipboardClock },
  { to: '/leaderboard', label: 'Leaderboard', icon: LeaderboardIcon },
]

function SearchBox({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const { listings } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useClickOutside(box, useCallback(() => setOpen(false), []), open)

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!q) return { people: [], roles: [] }
    const people = Object.values(users).filter((u) => `${u.name} ${u.handle}`.toLowerCase().includes(q))
    const seen = new Set<string>()
    const roles = listings.filter((l) => {
      const key = `${l.title}|${l.company}`
      if (seen.has(key) || !`${l.title} ${l.company} ${l.city}`.toLowerCase().includes(q)) return false
      seen.add(key)
      return true
    })
    return { people, roles: roles.slice(0, 5) }
  }, [q, listings])

  const go = (term: string) => {
    setOpen(false)
    navigate(`/opportunities?q=${encodeURIComponent(term)}`)
  }

  return (
    <div ref={box} className={cn('relative', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (q) go(query.trim())
        }}
        className="flex h-10 items-center gap-3 rounded-full bg-field px-4 ring-brand/30 transition-shadow focus-within:ring-2"
      >
        <Search className="size-5 shrink-0 text-[#555]" strokeWidth={2} />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="search people, opportunities..."
          className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-[#666]"
        />
      </form>
      {open && q && (
        <div className="absolute inset-x-0 top-12 z-40 animate-pop overflow-hidden rounded-xl border border-line bg-white py-2 shadow-xl">
          {results.people.length === 0 && results.roles.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted">No results for “{query}”</p>
          )}
          {results.people.length > 0 && (
            <p className="px-4 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">People</p>
          )}
          {results.people.map((u) => (
            <button
              key={u.id}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-page"
            >
              <Avatar src={u.avatar} size={28} />
              <span className="text-sm text-ink">{u.name}</span>
              <span className="text-xs text-muted">@{u.handle}</span>
            </button>
          ))}
          {results.roles.length > 0 && (
            <p className="px-4 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">Opportunities</p>
          )}
          {results.roles.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.title)}
              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-page"
            >
              <BriefcaseBusiness className="size-4 text-brand-strong" />
              <span className="text-sm text-ink">{l.title}</span>
              <span className="text-xs text-muted">
                {l.company} · {l.city}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function NotificationBell({ size = 40 }: { size?: number }) {
  const { unreadNotifications, markNotificationsRead } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, useCallback(() => setOpen(false), []), open)
  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Notifications"
        onClick={() => {
          setOpen((o) => !o)
          markNotificationsRead()
        }}
        style={{ width: size, height: size }}
        className="relative grid place-items-center rounded-full border border-[#f0f0f0] bg-[#f9f9f9] text-[#555] transition-colors hover:bg-field"
      >
        <Bell className="size-5" strokeWidth={1.8} />
        {unreadNotifications > 0 && (
          <span className="absolute top-1 right-1 grid size-3.5 place-items-center rounded-full bg-badge text-[9px] font-semibold text-white">
            {unreadNotifications}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-12 right-0 z-40 w-80 max-w-[calc(100vw-32px)] origin-top-right animate-pop rounded-xl border border-line bg-white py-2 shadow-xl">
          <p className="px-4 pt-1 pb-2 text-sm font-semibold text-black">Notifications</p>
          {notifications.map((n) => (
            <div key={n.id} className="flex gap-3 px-4 py-2.5 hover:bg-page">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
              <p className="flex-1 text-[13px] leading-5 text-body">{n.text}</p>
              <span className="text-xs text-muted">{n.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileMenu({ showChevron, size }: { showChevron: boolean; size: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { showToast } = useStore()
  useClickOutside(ref, useCallback(() => setOpen(false), []), open)
  const items = [
    { label: 'View Profile', icon: UserRound },
    { label: 'Settings', icon: Settings },
    { label: 'Log out', icon: LogOut },
  ]
  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-90"
      >
        <Avatar src={currentUser.avatar} size={size} />
        {showChevron && (
          <ChevronDown className={cn('size-5 text-[#555] transition-transform', open && 'rotate-180')} />
        )}
      </button>
      {open && (
        <div className="absolute top-14 right-0 z-40 w-52 origin-top-right animate-pop rounded-xl border border-line bg-white py-2 shadow-xl">
          <div className="border-b border-line px-4 pb-2">
            <p className="text-sm font-semibold text-black">{currentUser.name}</p>
            <p className="text-xs text-muted">@{currentUser.handle}</p>
          </div>
          {items.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setOpen(false)
                showToast(`${label} coming soon`)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-ink hover:bg-page"
            >
              <Icon className="size-4 text-muted" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header({ createLabel = 'Create', onCreate }: { createLabel?: string; onCreate: () => void }) {
  const [mobileSearch, setMobileSearch] = useState(false)
  return (
    <>
      {/* Desktop */}
      <header className="sticky top-0 z-30 hidden bg-white lg:block">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center pr-10 pl-10">
          <NavLink to="/" className="w-[254px] shrink-0 xl:w-[254px]">
            <Logo className="text-[26px]" />
            <p className="mt-1.5 text-[11px] font-semibold tracking-[0.02em] text-[#7e7e7e]">
              PEOPLE . SKILLS . OPPORTUNITIES
            </p>
          </NavLink>
          <nav className="flex h-full items-stretch gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative flex flex-col items-center justify-center gap-1.5 px-3 text-[13px] transition-colors',
                    isActive ? 'font-medium text-brand-strong' : 'text-[#363636] hover:text-brand-strong',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="size-4" strokeWidth={1.8} />
                    {label}
                    <span
                      className={cn(
                        'absolute inset-x-0 bottom-2.5 h-0.5 rounded-full bg-brand-strong transition-transform duration-300',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <SearchBox className="ml-6 w-[302px] min-w-[180px] shrink xl:ml-[42px]" />
          <div className="ml-auto flex shrink-0 items-center gap-4 pl-4">
            <NotificationBell />
            <ProfileMenu showChevron size={48} />
            <button
              onClick={onCreate}
              className="ml-6 flex h-10 items-center gap-1.5 rounded-lg whitespace-nowrap bg-brand px-4 text-base font-medium text-white transition-all hover:bg-[#f57f0c] hover:shadow-[0_6px_16px_-6px_rgba(255,140,26,0.7)] active:scale-[0.98]"
            >
              <Plus className="size-5" strokeWidth={2.25} />
              {createLabel}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile */}
      <header className="sticky top-0 z-30 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <NavLink to="/">
            <Logo className="text-[26px]" />
          </NavLink>
          <div className="flex items-center gap-2.5">
            <button
              aria-label="Search"
              onClick={() => setMobileSearch((s) => !s)}
              className="grid size-9 place-items-center rounded-full border border-[#f0f0f0] bg-[#f9f9f9] text-[#555]"
            >
              <Search className="size-[18px]" />
            </button>
            <NotificationBell size={36} />
            <ProfileMenu showChevron={false} size={36} />
          </div>
        </div>
        {mobileSearch && (
          <div className="animate-pop px-4 pb-3">
            <SearchBox autoFocus />
          </div>
        )}
      </header>
    </>
  )
}
