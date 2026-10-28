import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Check, ChevronDown, Clock } from 'lucide-react'
import listingRestaurant from '../../assets/listing-restaurant.webp'
import type { Listing } from '../../data'
import { useStore } from '../../store'
import { cn } from '../ui'

function useListingActions(listing: Listing) {
  const { applied, apply, savedListings, toggleSaveListing, showToast } = useStore()
  const isApplied = applied.has(listing.id)
  const isSaved = savedListings.has(listing.id)
  return {
    isApplied,
    isSaved,
    onApply: () => {
      if (isApplied) return
      apply(listing.id)
      showToast(`Applied to ${listing.title} at ${listing.company}`)
    },
    onSave: () => {
      toggleSaveListing(listing.id)
      showToast(isSaved ? 'Removed from saved opportunities' : 'Saved to your opportunities')
    },
  }
}

function Meta({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-[15px] gap-y-1 text-xs text-[#555]', className)}>
      <span className="flex items-center gap-1">
        <BriefcaseBusiness className="size-3.5" strokeWidth={1.6} />
        {listing.type}
      </span>
      <span className="flex items-center gap-1">
        <Building2 className="size-3.5" strokeWidth={1.6} />
        {listing.workMode}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="size-3.5" strokeWidth={1.6} />
        {listing.experience}
      </span>
    </div>
  )
}

function Skills({ listing }: { listing: Listing }) {
  return (
    <div className="flex flex-wrap gap-2">
      {listing.skills.map((s) => (
        <span key={s} className="inline-flex h-5 items-center rounded-sm bg-brand-softer px-2.5 text-[10px] text-[#737373]">
          {s}
        </span>
      ))}
    </div>
  )
}

function SaveButton({ isSaved, onSave, className }: { isSaved: boolean; onSave: () => void; className?: string }) {
  return (
    <button
      onClick={onSave}
      aria-label={isSaved ? 'Unsave opportunity' : 'Save opportunity'}
      className={cn(
        'grid size-[34px] place-items-center rounded-full border transition-all active:scale-90',
        isSaved ? 'border-brand/40 bg-brand-soft text-brand-strong' : 'border-[#d9d9d9] text-[#333] hover:border-[#bbb]',
        className,
      )}
    >
      <Bookmark className="size-[18px]" strokeWidth={1.6} fill={isSaved ? 'currentColor' : 'none'} />
    </button>
  )
}

function ApplyButton({ isApplied, onApply, className }: { isApplied: boolean; onApply: () => void; className?: string }) {
  return (
    <button
      onClick={onApply}
      disabled={isApplied}
      className={cn(
        'group flex items-center justify-center gap-2.5 rounded-md text-[13px] font-medium text-white transition-all',
        isApplied
          ? 'cursor-default bg-teal-from'
          : 'bg-brand hover:bg-[#f57f0c] hover:shadow-[0_6px_16px_-6px_rgba(255,140,26,0.7)] active:scale-[0.98]',
        className,
      )}
    >
      {isApplied ? (
        <>
          Applied <Check className="size-4" strokeWidth={2.5} />
        </>
      ) : (
        <>
          Apply Now <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </>
      )}
    </button>
  )
}

function Details({ listing, open }: { listing: Listing; open: boolean }) {
  return (
    <div className={cn('grid transition-[grid-template-rows] duration-300 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
      <div className="overflow-hidden">
        <div className={cn('transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}>
          <div className="mt-[11px] h-px bg-[#ffe3c7]" />
          <h3 className="mt-3 text-sm font-semibold text-black">About the role</h3>
          <p className="mt-0.5 text-xs leading-[18px] whitespace-pre-line text-[#444]">{listing.about}</p>
          <h3 className="mt-3 text-sm font-semibold text-black">What you’ll do</h3>
          <ul className="mt-1 space-y-[5px] text-xs text-[#444]">
            {listing.tasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-black">Opportunity Details</h3>
            {listing.status === 'Open' && (
              <span className="inline-flex h-5 items-center rounded-full bg-[#e9fee7] px-3 text-[11px] font-medium text-online">
                Actively hiring
              </span>
            )}
          </div>
          <dl className="mt-1 space-y-[5px] text-xs text-[#444]">
            {[
              ['Duration', listing.duration],
              ['Start Date', listing.startDate],
              ['Openings', listing.openings],
              ['Application Deadline', listing.deadline],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="inline font-medium text-black">{k}:</dt> <dd className="inline">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

function ViewDetailsToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={open}
      className="flex items-center gap-1.5 text-[11px] text-[#333] transition-colors hover:text-brand-strong"
    >
      View Details
      <ChevronDown className={cn('size-3 transition-transform duration-300', open && 'rotate-180')} strokeWidth={2} />
    </button>
  )
}

type CardProps = { listing: Listing; open: boolean; onToggle: () => void; index: number }

export function ListingCard({ listing, open, onToggle, index }: CardProps) {
  const a = useListingActions(listing)
  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        'animate-fade-up rounded-lg border bg-white px-4 pt-[15px] pb-3 transition-[border-color,box-shadow] duration-300',
        open ? 'border-[#ffc285]' : 'border-transparent hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]',
      )}
    >
      <div className="flex gap-4">
        <div className="group h-[133px] w-[190px] shrink-0 overflow-hidden rounded">
          <img
            src={listing.image || listingRestaurant}
            alt=""
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-2xl leading-7 font-medium text-black">{listing.title}</h2>
              <p className="mt-0.5 text-lg leading-6 text-[#222]">
                {listing.company} . {listing.city}
              </p>
            </div>
            <SaveButton isSaved={a.isSaved} onSave={a.onSave} />
          </div>
          <div className="mt-[7px] flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-[15px]">
              <Meta listing={listing} />
              <span className="text-[13px] font-semibold text-brand-strong">{listing.salary}</span>
            </div>
            <ApplyButton isApplied={a.isApplied} onApply={a.onApply} className="h-[35px] w-[116px] shrink-0" />
          </div>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div>
              <Skills listing={listing} />
              <p className="mt-[9px] text-xs text-[#555]">
                {listing.applicants} applicants . Posted {listing.posted}
              </p>
            </div>
            <div className="mt-2 mr-4">
              <ViewDetailsToggle open={open} onToggle={onToggle} />
            </div>
          </div>
        </div>
      </div>
      <Details listing={listing} open={open} />
    </article>
  )
}

export function MobileListingCard({ listing, open, onToggle, index }: CardProps) {
  const a = useListingActions(listing)
  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        'animate-fade-up rounded-lg border bg-white px-2 pt-2 pb-3 transition-colors duration-300',
        open ? 'border-[#ffc285]' : 'border-transparent',
      )}
    >
      <img src={listing.image || listingRestaurant} alt="" className="aspect-[250/107] w-full rounded object-cover" />
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-[18px] leading-6 font-medium text-black">{listing.title}</h2>
          <p className="text-sm text-[#222]">
            {listing.company} . {listing.city}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-brand-strong">{listing.salary}</p>
        </div>
        <SaveButton isSaved={a.isSaved} onSave={a.onSave} className="size-7 border-[#e5e5e5]" />
      </div>
      <Meta listing={listing} className="mt-2" />
      <div className="mt-2">
        <Skills listing={listing} />
      </div>
      <p className="mt-2 text-xs text-[#555]">
        {listing.applicants} applicants . Posted {listing.posted}
      </p>
      <ApplyButton isApplied={a.isApplied} onApply={a.onApply} className="mt-3 h-9 w-full" />
      <div className="mt-2.5 flex justify-center">
        <ViewDetailsToggle open={open} onToggle={onToggle} />
      </div>
      <Details listing={listing} open={open} />
    </article>
  )
}
