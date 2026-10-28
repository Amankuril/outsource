import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Building2, Clock3, FileText, Megaphone, UsersRound } from 'lucide-react'
import heroOpportunities from '../../assets/hero-opportunities.webp'
import type { Category, Level, Listing, ListingStatus, ListingType } from '../../data'
import { categoryOptions, levelOptions, statusOptions, typeTabs } from '../../data'
import { useStore } from '../../store'
import { Card, Checkbox, Modal, PrimaryButton, Toggle, cn } from '../ui'

export type Filters = {
  status: Set<ListingStatus>
  category: Set<Category>
  level: Set<Level>
}

export function OpportunitiesHero() {
  return (
    <section className="group relative h-[205px] animate-fade-up overflow-hidden rounded-xl">
      <img
        src={heroOpportunities}
        alt=""
        className="absolute inset-0 size-full object-cover object-right transition-transform duration-[1.2s] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#eedfc9_0%,rgba(238,223,201,0.95)_34%,rgba(238,223,201,0.6)_52%,rgba(238,223,201,0)_70%)]" />
      <div className="relative px-6 pt-[27px]">
        <p className="text-xs font-medium text-brand-strong">OPPORTUNITIES</p>
        <h1 className="mt-1 font-display text-[34px] leading-9 text-ink">
          Your Hospitality
          <br />
          Career Starts Here
        </h1>
        <p className="mt-[5px] max-w-[352px] text-[12.5px] leading-[19px] text-[#666]">
          Discover jobs, internships and training programs from top hotels, resorts and hospitality brands around the world.
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#333]">
          <Building2 className="size-3.5 text-brand-strong" strokeWidth={1.8} />
          <span className="font-semibold">1,240+</span> active opportunities
        </p>
      </div>
    </section>
  )
}

export function TypeTabs({
  value,
  onChange,
  className,
  wrap,
}: {
  value: ListingType | 'All'
  onChange: (t: ListingType | 'All') => void
  className?: string
  wrap?: boolean
}) {
  return (
    <div className={cn('flex gap-4', wrap ? 'flex-wrap gap-2' : 'no-scrollbar overflow-x-auto', className)}>
      {typeTabs.map((t) => {
        const active = t.type === value
        return (
          <button
            key={t.label}
            onClick={() => onChange(t.type)}
            aria-pressed={active}
            className={cn(
              'flex h-9 shrink-0 items-center gap-2.5 rounded-lg border px-3 font-medium transition-all duration-200',
              wrap ? 'h-[34px] px-2 text-[13px]' : 'text-sm',
              active
                ? 'border-brand bg-brand text-base font-semibold text-white shadow-[0_4px_12px_-4px_rgba(255,140,26,0.6)]'
                : 'border-[#ddd] text-[#555] hover:border-brand/50 hover:text-brand-strong',
              active && wrap && 'text-sm',
            )}
          >
            {t.label}
            <span
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium',
                active ? 'bg-white/25 text-white' : 'bg-[#f2f2f2] text-[#555]',
              )}
            >
              {t.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: T[]
  selected: Set<T>
  onToggle: (v: T) => void
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-brand-brown">{title}</h3>
      <div className="mt-2 space-y-[9px]">
        {options.map((o) => (
          <Checkbox key={o} label={o} checked={selected.has(o)} onChange={() => onToggle(o)} />
        ))}
      </div>
    </div>
  )
}

export function FilterList({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const toggle = <K extends keyof Filters>(key: K, v: string) => {
    const next = new Set(filters[key] as Set<string>)
    if (next.has(v)) next.delete(v)
    else next.add(v)
    onChange({ ...filters, [key]: next })
  }
  return (
    <>
      <h2 className="text-lg font-semibold text-brand-brown">Filters</h2>
      <div className="mt-2 space-y-4">
        <FilterGroup title="Project Status" options={statusOptions} selected={filters.status} onToggle={(v) => toggle('status', v)} />
        <FilterGroup title="Categories" options={categoryOptions} selected={filters.category} onToggle={(v) => toggle('category', v)} />
        <FilterGroup title="Experience Lavel" options={levelOptions} selected={filters.level} onToggle={(v) => toggle('level', v)} />
      </div>
    </>
  )
}

export function FiltersCard(props: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <Card className="px-3 pt-4 pb-4">
      <FilterList {...props} />
    </Card>
  )
}

export function PostOpportunityCard() {
  const { setPostOpportunityOpen } = useStore()
  return (
    <Card className="p-3">
      <div className="rounded-lg bg-brand-softer px-3 pt-3 pb-3">
        <div className="flex items-center gap-[18px]">
          <span className="grid size-8 place-items-center rounded-full bg-brand-ring">
            <Building2 className="size-4 text-brand-strong" strokeWidth={1.8} />
          </span>
          <h2 className="text-lg font-semibold text-brand-title">Post a Opportunities</h2>
        </div>
        <p className="mt-px pl-[50px] text-xs leading-[18px] text-[#666]">
          Reach passionate hospitality students and professionals from top institutions across India.
        </p>
        <PrimaryButton onClick={() => setPostOpportunityOpen(true)} className="mt-2 h-8 w-full rounded-md text-base font-medium">
          Post an Opportunity
        </PrimaryButton>
      </div>
    </Card>
  )
}

export function ApplicationOverview({ compact }: { compact?: boolean }) {
  const { applied } = useStore()
  const stats: { label: string; value: number; icon: ReactNode }[] = [
    { label: 'Applied', value: 6 + applied.size, icon: <FileText className="size-5 text-[#18a90a]" strokeWidth={1.6} /> },
    { label: 'In Review', value: 2, icon: <Clock3 className="size-5 text-[#7100b3]" strokeWidth={1.8} /> },
    { label: 'Interview', value: 1, icon: <UsersRound className="size-5 text-[#0b5cd5]" strokeWidth={1.8} /> },
  ]
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className={cn('font-semibold text-black', compact ? 'text-[11px]' : 'text-[15px]')}>Application Overview</h2>
        <span className={cn('font-medium text-[#555]', compact ? 'text-[8px]' : 'text-xs')}>Last 30 days</span>
      </div>
      <div className={cn('grid grid-cols-3', compact ? 'mt-2.5 gap-3' : 'mt-[19px] gap-2.5')}>
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              'rounded-lg border border-[#ddd] transition-colors hover:border-brand/40',
              compact ? 'px-2.5 pt-2.5 pb-2' : 'px-3 pt-3.5 pb-3',
            )}
          >
            <span className={cn('block', compact && '[&>svg]:size-3.5')}>{s.icon}</span>
            <p key={s.value} className={cn('animate-pop font-semibold text-black', compact ? 'mt-3 text-xs' : 'mt-1.5 text-xl')}>
              {s.value}
            </p>
            <p className={cn('text-[#333]', compact ? 'text-[8px]' : 'text-xs')}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NotifyCard() {
  const { notifyMatches, setNotifyMatches, showToast } = useStore()
  return (
    <div>
      <Card className="p-3">
        <div className="flex gap-2.5">
          <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-brand">
            <Megaphone className="size-4 text-white" strokeWidth={1.8} />
          </span>
          <div className="pt-1">
            <p className="text-[13px] font-semibold text-black">Notify me about matching opportunities</p>
            <p className="mt-1 text-xs text-[#444]">Get notified when new opportunities match your interests.</p>
          </div>
        </div>
      </Card>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-xs text-[#555]">Turn on to get Notifications</span>
        <Toggle
          on={notifyMatches}
          label="Notify me about matching opportunities"
          onChange={(on) => {
            setNotifyMatches(on)
            showToast(on ? 'Notifications turned on' : 'Notifications turned off')
          }}
        />
      </div>
    </div>
  )
}

const field =
  'h-10 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm text-ink outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/20'

export function PostOpportunityModal() {
  const { postOpportunityOpen, setPostOpportunityOpen, addListing, showToast } = useStore()
  const [form, setForm] = useState({
    title: '',
    company: '',
    city: '',
    type: 'Internship' as ListingType,
    category: 'Hotel Operations' as Category,
    level: 'Beginner' as Level,
    salary: '',
    about: '',
  })
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const close = () => setPostOpportunityOpen(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const listing: Listing = {
      id: `l${Date.now()}`,
      title: form.title.trim(),
      company: form.company.trim(),
      city: form.city.trim(),
      type: form.type,
      workMode: 'On-site',
      experience: form.level === 'Beginner' ? '0-1 Years' : form.level === 'Intermediate' ? '1-3 Years' : '3+ Years',
      salary: form.salary.trim() || 'Not disclosed',
      skills: [form.category],
      applicants: 0,
      posted: 'just now',
      status: 'Open',
      category: form.category,
      level: form.level,
      image: '',
      about: form.about.trim() || 'Details will be shared with shortlisted applicants.',
      tasks: [],
      duration: '—',
      startDate: 'Inediate',
      openings: '1 Position',
      deadline: '—',
      postedByMe: true,
    }
    addListing(listing)
    showToast('Opportunity posted')
    setForm((f) => ({ ...f, title: '', company: '', city: '', salary: '', about: '' }))
    close()
  }

  return (
    <Modal open={postOpportunityOpen} onClose={close} title="Post an Opportunity">
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <label className="col-span-2 text-xs font-medium text-[#555]">
          Role title
          <input required value={form.title} onChange={set('title')} className={cn(field, 'mt-1')} placeholder="e.g. Front Office Trainee" />
        </label>
        <label className="text-xs font-medium text-[#555]">
          Company
          <input required value={form.company} onChange={set('company')} className={cn(field, 'mt-1')} placeholder="Taj Hotel" />
        </label>
        <label className="text-xs font-medium text-[#555]">
          City
          <input required value={form.city} onChange={set('city')} className={cn(field, 'mt-1')} placeholder="Pune" />
        </label>
        <label className="text-xs font-medium text-[#555]">
          Type
          <select value={form.type} onChange={set('type')} className={cn(field, 'mt-1')}>
            {typeTabs.slice(1).map((t) => (
              <option key={t.type}>{t.type}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-[#555]">
          Category
          <select value={form.category} onChange={set('category')} className={cn(field, 'mt-1')}>
            {categoryOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-[#555]">
          Experience level
          <select value={form.level} onChange={set('level')} className={cn(field, 'mt-1')}>
            {levelOptions.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-[#555]">
          Stipend / Salary
          <input value={form.salary} onChange={set('salary')} className={cn(field, 'mt-1')} placeholder="₹ 12,000 / month" />
        </label>
        <label className="col-span-2 text-xs font-medium text-[#555]">
          About the role
          <textarea
            value={form.about}
            onChange={set('about')}
            rows={3}
            className={cn(field, 'mt-1 h-auto resize-none py-2')}
            placeholder="What will this person do?"
          />
        </label>
        <PrimaryButton type="submit" className="col-span-2 mt-1 h-10 text-[15px]">
          Post Opportunity
        </PrimaryButton>
      </form>
    </Modal>
  )
}
