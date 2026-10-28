import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { navItems } from './Header'
import { cn } from './ui'

type Accent = 'teal' | 'brand'

export function MobileNav({ accent, onFab }: { accent: Accent; onFab: () => void }) {
  return (
    <div className="lg:hidden">
      <button
        onClick={onFab}
        aria-label="Create"
        className={cn(
          'fixed right-4 bottom-[84px] z-30 grid size-12 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95',
          accent === 'teal' ? 'bg-teal-fab' : 'bg-brand',
        )}
      >
        <Plus className="size-7" strokeWidth={1.75} />
      </button>
      <nav className="fixed inset-x-2 bottom-2 z-30 flex h-[66px] items-center justify-around rounded-xl border border-[#eee] bg-white px-1 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex h-[50px] min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-1.5 text-[8px] font-medium text-black transition-colors',
                isActive && (accent === 'teal' ? 'bg-[#e3f1ea] text-teal' : 'bg-brand-soft text-brand-strong'),
              )
            }
          >
            <Icon className="size-6" strokeWidth={1.6} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
