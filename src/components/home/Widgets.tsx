import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, ChevronRight, Clock, MapPin, Monitor, Users } from 'lucide-react'
import heroHome from '../../assets/hero-home.webp'
import type { Suggestion } from '../../data'
import { currentUser, suggestions, upcomingEvent } from '../../data'
import { useStore } from '../../store'
import { ImpactIcon, PodiumIcon } from '../icons'
import { Card, SectionHeader, cn } from '../ui'

export function HomeHero() {
  return (
    <section className="group relative h-[205px] animate-fade-up overflow-hidden rounded-xl">
      <img
        src={heroHome}
        alt=""
        className="absolute inset-0 size-full object-cover object-right transition-transform duration-[1.2s] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#ece3d3_0%,rgba(236,227,211,0.94)_38%,rgba(236,227,211,0.55)_62%,rgba(236,227,211,0)_80%)]" />
      <div className="relative px-6 pt-[30px]">
        <p className="text-xs font-medium tracking-[0.01em] text-brand-strong">WELCOME BACK, {currentUser.firstName.toUpperCase()}</p>
        <h1 className="mt-2.5 max-w-[330px] font-serif text-[26px] leading-[31px] font-medium text-ink">
          Grow. Connect. Build a career in Hospitality.
        </h1>
        <p className="mt-[11px] max-w-[560px] text-xs leading-[19px] text-[#7c7c7c]">
          Share experiences, learn with peers, and discover Opportunities in the global hospitality community.
        </p>
      </div>
      <p className="pointer-events-none absolute top-[50px] right-[46px] w-[150px] -rotate-[24deg] font-script text-[38px] leading-[30px] text-[#2b2b2b]">
        People <span className="ml-5 block">Make</span>
        <span className="-ml-3 block">Hospitality</span>
      </p>
    </section>
  )
}

function SuggestionCard({
  item,
  active,
  onHover,
  compact,
}: {
  item: Suggestion
  active: boolean
  onHover: () => void
  compact?: boolean
}) {
  const navigate = useNavigate()
  const teal = item.kind === 'INTERNSHIP'
  return (
    <button
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={() => navigate(`/opportunities?q=${encodeURIComponent(item.title)}`)}
      className={cn(
        'flex w-full items-center rounded-[10px] border text-left transition-all duration-300',
        compact ? 'gap-2 p-2' : 'gap-2.5 p-[13px]',
        active
          ? 'border-teal-line/70 shadow-[0_3px_0_-1px_rgba(135,190,185,0.45)]'
          : 'border-[#f3ece4] shadow-[0_3px_0_-1px_rgba(255,230,205,0.6)]',
      )}
    >
      <img src={item.image} alt="" className="h-[106px] w-[83px] shrink-0 rounded-md object-cover" />
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'inline-flex items-center rounded px-1.5 font-medium',
            compact ? 'h-[19px] text-[10px]' : 'h-[22px] text-xs',
            teal ? 'bg-teal-soft text-teal' : 'bg-brand-softer text-brand-deep',
          )}
        >
          {item.kind}
        </span>
        <p className={cn('mt-2 font-medium whitespace-nowrap text-black', compact ? 'text-[13px] leading-4' : 'text-base leading-5')}>{item.title}</p>
        <p className={cn('mt-0.5 text-[#697483]', compact ? 'text-[11px]' : 'text-[13px]')}>{item.company}</p>
        <div className={cn('flex items-center gap-3 whitespace-nowrap text-[#697483]', compact ? 'mt-2 text-[10px]' : 'mt-3 text-xs')}>
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" strokeWidth={1.6} />
            {item.city}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" strokeWidth={1.6} />
            {item.duration}
          </span>
        </div>
      </div>
      <ChevronRight
        className={cn(compact && 'hidden', 'size-5 shrink-0 text-black transition-all duration-300', active ? 'opacity-100' : '-translate-x-1 opacity-0')}
        strokeWidth={2}
      />
    </button>
  )
}

export function OpportunitiesWidget() {
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  return (
    <Card className="px-4 pt-[26px] pb-4">
      <SectionHeader title="Opportunities" action="View all" onAction={() => navigate('/opportunities')} />
      <div className="mt-[37px] space-y-[14px]">
        {suggestions.map((s, i) => (
          <SuggestionCard key={s.id} item={s} active={active === i} onHover={() => setActive(i)} />
        ))}
      </div>
    </Card>
  )
}

export function MobileOpportunities() {
  const navigate = useNavigate()
  return (
    <Card className="pt-6 pb-4">
      <div className="px-4">
        <SectionHeader title="Opportunities" action="View all" onAction={() => navigate('/opportunities')} />
      </div>
      <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4">
        {suggestions.map((s, i) => (
          <div key={s.id} className="w-[250px] shrink-0 snap-start">
            <SuggestionCard item={s} active={i === 0} onHover={() => {}} compact />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function ProgressCard({ compact }: { compact?: boolean }) {
  const navigate = useNavigate()
  const [fill, setFill] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setFill(currentUser.progress))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <Card className={compact ? 'px-4 pt-6 pb-6' : 'px-4 pt-[25px] pb-6'}>
      <SectionHeader title="Your Progress" action="Leeaderboard" onAction={() => navigate('/leaderboard')} />
      <div className="mt-2.5 h-px bg-line" />
      <div className="mt-[18px] grid grid-cols-[1fr_1px_1fr]">
        <div>
          <p className="text-[13px] text-[#555]">Current Rank</p>
          <p className="mt-1 ml-3.5 text-[32px] leading-9 font-semibold text-black">#{currentUser.rank}</p>
          <PodiumIcon className="mt-2 ml-8 size-5 text-[#e100e1]" />
        </div>
        <span className="my-0.5 bg-line" />
        <div className="text-right">
          <p className="text-[13px] text-[#555]">Impact Points</p>
          <p className="mt-1 mr-3.5 text-[32px] leading-9 font-semibold text-black">{currentUser.totalPoints}</p>
          <ImpactIcon className="mt-2 mr-9 ml-auto size-4 text-[#1e90ff]" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-[#d9d9d9]">
          <div
            className="h-full rounded-full bg-linear-to-r from-teal-from to-teal-to transition-[width] duration-1000 ease-out"
            style={{ width: `${fill * 100}%` }}
          />
        </div>
        <span className="flex items-center gap-0.5 text-xs font-medium text-teal">
          <ArrowUp className="size-4" strokeWidth={2} />
          {currentUser.weeklyRankGain} this Week
        </span>
      </div>
    </Card>
  )
}

export function UpcomingActivity() {
  const { joinedEvent, toggleJoinEvent, eventGoing, showToast } = useStore()
  const e = upcomingEvent
  return (
    <Card className="px-4 pt-[25px] pb-4">
      <SectionHeader title="Upcoming Activity" action="View all" onAction={() => showToast('Activities coming soon')} />
      <div className="mt-[18px] flex gap-[11px]">
        <div className="grid size-[52px] shrink-0 place-items-center rounded bg-[#e4e4e4] text-center text-[13px] leading-4 font-semibold text-[#272727]">
          <span>
            {e.month}
            <br />
            {e.day}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base leading-5 font-semibold text-black">{e.title}</p>
          <p className="mt-1 text-sm text-[#7c7c7c]">{e.subtitle}</p>
          <div className="mt-3 flex items-center gap-5 text-sm text-[#555]">
            <span className="flex items-center gap-1">
              <Monitor className="size-4" strokeWidth={1.6} />
              {e.mode}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" strokeWidth={1.6} />
              {e.time}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between pl-[63px]">
        <span className="flex items-center gap-2 text-sm text-[#555]">
          <Users className="size-[18px]" strokeWidth={1.6} />
          <span key={eventGoing} className="animate-pop">
            {eventGoing} going
          </span>
        </span>
        <button
          onClick={() => {
            toggleJoinEvent()
            showToast(joinedEvent ? 'You left the webinar' : 'You’re in! See you on Oct 05')
          }}
          className={cn(
            'h-9 min-w-[78px] rounded-full px-4 text-[15px] font-semibold transition-all active:scale-95',
            joinedEvent ? 'bg-teal-soft text-teal' : 'bg-brand-softer text-brand-deep hover:bg-brand-soft',
          )}
        >
          {joinedEvent ? 'Joined' : 'Join'}
        </button>
      </div>
    </Card>
  )
}
