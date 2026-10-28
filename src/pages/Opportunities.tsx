import { useCallback, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Funnel, MapPin, Search, X } from 'lucide-react'
import brighterTomorrow from '../assets/brighter-tomorrow.webp'
import { Header } from '../components/Header'
import { MobileNav } from '../components/MobileNav'
import { ListingCard, MobileListingCard } from '../components/opportunities/ListingCard'
import type { Filters } from '../components/opportunities/Panels'
import {
  ApplicationOverview,
  FilterList,
  FiltersCard,
  NotifyCard,
  OpportunitiesHero,
  PostOpportunityCard,
  PostOpportunityModal,
  TypeTabs,
} from '../components/opportunities/Panels'
import { ProfileCard, QuickLinks } from '../components/Sidebar'
import { Card, PrimaryButton, PromoBanner, cn, useClickOutside } from '../components/ui'
import type { ListingType } from '../data'
import { useStore } from '../store'

const defaultFilters = (): Filters => ({
  status: new Set(['Open']),
  category: new Set(['Hotel Operations']),
  level: new Set(['Beginner']),
})

const viewTitles: Record<string, string> = {
  mine: 'My Opportunities',
  applied: 'Applied Opportunities',
  saved: 'Saved Opportunities',
}

export default function Opportunities() {
  const { listings, applied, savedListings, setPostOpportunityOpen } = useStore()
  const [params, setParams] = useSearchParams()
  const view = params.get('view')
  const urlQuery = params.get('q') ?? ''

  const [type, setType] = useState<ListingType | 'All'>('All')
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [query, setQuery] = useState(urlQuery)
  const [location, setLocation] = useState('')
  const [applied_, setApplied] = useState({ q: urlQuery, loc: '' })
  const [expanded, setExpanded] = useState<string | null>('l1')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  useClickOutside(sheet, useCallback(() => setSheetOpen(false), []), sheetOpen)

  // Keep the search box in sync when the header search navigates here with a new ?q=.
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery)
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery)
    setQuery(urlQuery)
    setApplied((a) => ({ ...a, q: urlQuery }))
  }

  const results = useMemo(() => {
    const q = applied_.q.trim().toLowerCase()
    const loc = applied_.loc.trim().toLowerCase()
    return listings.filter((l) => {
      if (view === 'mine' && !l.postedByMe) return false
      if (view === 'applied' && !applied.has(l.id)) return false
      if (view === 'saved' && !savedListings.has(l.id)) return false
      if (type !== 'All' && l.type !== type) return false
      if (filters.status.size && !filters.status.has(l.status)) return false
      if (filters.category.size && !filters.category.has(l.category)) return false
      if (filters.level.size && !filters.level.has(l.level)) return false
      if (q && !`${l.title} ${l.company} ${l.skills.join(' ')}`.toLowerCase().includes(q)) return false
      if (loc && !l.city.toLowerCase().includes(loc)) return false
      return true
    })
  }, [listings, view, applied, savedListings, type, filters, applied_])

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    setApplied({ q: query, loc: location })
    if (urlQuery) setParams((p) => (p.delete('q'), p))
  }

  const resetAll = () => {
    setType('All')
    setFilters({ status: new Set(), category: new Set(), level: new Set() })
    setQuery('')
    setLocation('')
    setApplied({ q: '', loc: '' })
  }

  const viewBanner = view && viewTitles[view] && (
    <div className="flex animate-pop items-center justify-between rounded-xl bg-brand-soft px-4 py-2.5 text-sm text-brand-deep">
      <span className="font-medium">
        {viewTitles[view]} ({results.length})
      </span>
      <Link to="/opportunities" className="flex items-center gap-1 font-semibold hover:underline">
        <X className="size-4" /> Clear
      </Link>
    </div>
  )

  const empty = (
    <Card className="px-6 py-12 text-center">
      <p className="text-base font-medium text-black">No opportunities match your filters</p>
      <p className="mt-1 text-sm text-muted">Try another tab, widen your filters or clear your search.</p>
      <PrimaryButton onClick={resetAll} className="mt-4 h-9 px-5 text-sm">
        Reset filters
      </PrimaryButton>
    </Card>
  )

  const toggle = (id: string) => setExpanded((e) => (e === id ? null : id))

  return (
    <div className="min-h-screen bg-page-mobile lg:bg-page">
      <Header createLabel="Create Projects" onCreate={() => setPostOpportunityOpen(true)} />

      {/* Desktop */}
      <main className="mx-auto hidden max-w-[1440px] grid-cols-[220px_minmax(0,1fr)_300px] items-start gap-3 pt-4 pr-7 pb-6 pl-10 lg:grid xl:grid-cols-[242px_minmax(0,1fr)_347px]">
        <aside className="space-y-3">
          <ProfileCard />
          <QuickLinks variant="accordion" />
          <FiltersCard filters={filters} onChange={setFilters} />
          <PromoBanner src={brighterTomorrow} className="aspect-[242/302]" />
        </aside>

        <div className="space-y-3">
          <OpportunitiesHero />
          <Card className="px-[10px] py-[10px]">
            <TypeTabs value={type} onChange={setType} />
          </Card>
          <form onSubmit={submitSearch} className="flex gap-[14px]">
            <label className="flex h-10 flex-[371] items-center gap-3 rounded-lg border border-[#d9d9d9] bg-white px-4 transition-shadow focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <Search className="size-[18px] shrink-0 text-[#555]" strokeWidth={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, skill, or company"
                className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-[#666]"
              />
            </label>
            <label className="flex h-10 flex-[131] items-center gap-3 rounded-lg border border-[#d9d9d9] bg-white px-4 transition-shadow focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <Search className="size-[18px] shrink-0 text-[#555]" strokeWidth={2} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full min-w-0 bg-transparent text-xs text-ink outline-none placeholder:text-[#666]"
              />
            </label>
            <PrimaryButton type="submit" className="h-10 flex-[188] rounded-md text-base">
              Search
            </PrimaryButton>
          </form>
          {viewBanner}
          <div className="space-y-3">
            {results.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} open={expanded === l.id} onToggle={() => toggle(l.id)} />
            ))}
            {results.length === 0 && empty}
          </div>
        </div>

        <aside className="space-y-3">
          <PostOpportunityCard />
          <Card className="px-3 pt-[22px] pb-3">
            <ApplicationOverview />
          </Card>
          <NotifyCard />
        </aside>
      </main>

      {/* Mobile */}
      <main className="mx-auto max-w-xl px-4 pb-28 lg:hidden">
        <section className="animate-fade-up pt-3">
          <h1 className="font-display text-[22px] leading-6 text-black">
            Your Hospitality
            <br />
            Career Starts Here
          </h1>
          <p className="mt-2.5 max-w-[250px] text-[11px] leading-[17px] text-[#666]">
            Discover jobs, internships and training programs from top hotels, resorts and hospitality brands around the world.
          </p>
          <PrimaryButton onClick={() => setPostOpportunityOpen(true)} className="mt-2 h-10 w-full rounded-md text-[15px] font-medium">
            Post an Opportunity
          </PrimaryButton>
        </section>
        <form onSubmit={submitSearch} className="mt-4 flex gap-2.5">
          <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 focus-within:border-brand">
            <Search className="size-4 shrink-0 text-[#555]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, skill, or company"
              enterKeyHint="search"
              className="w-full bg-transparent text-xs outline-none placeholder:text-[#666]"
            />
          </label>
          <button
            type="button"
            aria-label="Filter by location"
            aria-expanded={showLocation}
            onClick={() => setShowLocation((s) => !s)}
            className={cn(
              'grid size-10 place-items-center rounded-lg border bg-white transition-colors',
              showLocation || applied_.loc ? 'border-brand text-brand-strong' : 'border-[#d9d9d9] text-[#333]',
            )}
          >
            <MapPin className="size-[18px]" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Open filters"
            onClick={() => setSheetOpen(true)}
            className="relative grid size-10 place-items-center rounded-lg border border-[#d9d9d9] bg-white text-[#333]"
          >
            <Funnel className="size-[18px]" strokeWidth={1.6} />
          </button>
        </form>
        {showLocation && (
          <form onSubmit={submitSearch} className="mt-2.5 flex animate-pop gap-2.5">
            <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 focus-within:border-brand">
              <MapPin className="size-4 shrink-0 text-[#555]" />
              <input
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                enterKeyHint="search"
                className="w-full bg-transparent text-xs outline-none placeholder:text-[#666]"
              />
            </label>
            <PrimaryButton type="submit" className="h-10 rounded-md px-4 text-sm">
              Search
            </PrimaryButton>
          </form>
        )}
        {viewBanner && <div className="mt-3">{viewBanner}</div>}
        <div className="mt-6 space-y-3">
          {results.map((l, i) => (
            <MobileListingCard key={l.id} listing={l} index={i} open={expanded === l.id} onToggle={() => toggle(l.id)} />
          ))}
          {results.length === 0 && empty}
        </div>

        {sheetOpen && (
          <div className="fixed inset-0 z-40 animate-fade bg-black/25">
            <div
              ref={sheet}
              className="absolute top-[60px] left-1/2 max-h-[calc(100vh-150px)] w-[min(300px,calc(100%-32px))] -translate-x-1/2 animate-sheet overflow-y-auto rounded-lg bg-white px-4 pt-4 pb-4 shadow-2xl"
            >
              <ApplicationOverview compact />
              <div className="my-4 h-px bg-line" />
              <TypeTabs value={type} onChange={setType} wrap />
              <div className="my-4 h-px bg-line" />
              <FilterList filters={filters} onChange={setFilters} />
              <PrimaryButton onClick={() => setSheetOpen(false)} className="mt-5 h-9 w-full rounded-md text-sm">
                Show {results.length} results
              </PrimaryButton>
            </div>
          </div>
        )}
      </main>

      <MobileNav accent="brand" onFab={() => setPostOpportunityOpen(true)} />
      <PostOpportunityModal />
    </div>
  )
}
