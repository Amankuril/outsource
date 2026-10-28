import { useEffect, useRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode, RefObject } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn('rounded-xl bg-white animate-fade-up', className)}>{children}</section>
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('font-serif font-extrabold tracking-[0.02em] leading-none', className)}>
      <span className="text-black">Tech</span>
      <span className="text-brand-strong">Linked</span>
    </span>
  )
}

export function Avatar({
  src,
  size = 48,
  online,
  className,
}: {
  src: string
  size?: number
  online?: boolean
  className?: string
}) {
  return (
    <span className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      <img src={src} alt="" className="size-full rounded-full object-cover object-top" />
      {online && (
        <span className="absolute right-0 bottom-0.5 size-2.5 rounded-full border-2 border-white bg-online" />
      )}
    </span>
  )
}

export function SectionHeader({
  title,
  subtitle = 'Because of your profile',
  action,
  onAction,
}: {
  title: string
  subtitle?: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base leading-5 font-semibold text-black">{title}</h2>
        <p className="mt-0.5 text-xs text-[#4d4d4d]">{subtitle}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="group mt-1.5 flex items-center gap-1 text-sm font-semibold text-teal transition-colors hover:text-teal-from"
        >
          {action}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
        </button>
      )}
    </div>
  )
}

export function Tag({ children, compact }: { children: ReactNode; compact?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-tag font-medium text-tag-ink',
        compact ? 'h-5 px-2 text-[11px]' : 'h-6 px-2.5 text-[13px]',
      )}
    >
      # {children}
    </span>
  )
}

export function Checkbox({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean
  onChange: () => void
  label: string
  className?: string
}) {
  return (
    <label className={cn('group flex cursor-pointer items-center gap-2 text-xs text-[#333]', className)}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        className={cn(
          'grid size-3.5 place-items-center rounded-[3px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40',
          checked ? 'border-[#fe6000] bg-[#fe6000]' : 'border-[#9a9a9a] bg-white group-hover:border-brand',
        )}
      >
        <Check className={cn('size-2.5 text-white transition-transform', checked ? 'scale-100' : 'scale-0')} strokeWidth={3.5} />
      </span>
      {label}
    </label>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full border transition-colors',
        on ? 'border-[#f0e4d8] bg-[#fdf3e8]' : 'border-line bg-[#eee]',
      )}
    >
      <span
        className={cn(
          'absolute top-1/2 size-4 -translate-y-1/2 rounded-full shadow-sm transition-all duration-200',
          on ? 'left-[calc(100%-18px)] bg-brand' : 'left-0.5 bg-white',
        )}
      />
    </button>
  )
}

export function PrimaryButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-white transition-all hover:bg-[#f57f0c] hover:shadow-[0_6px_16px_-6px_rgba(255,140,26,0.7)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void, active = true) {
  useEffect(() => {
    if (!active) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onOutside()
    document.addEventListener('mousedown', handle)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, onOutside, active])
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)
  useClickOutside(panel, onClose, open)
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid animate-fade place-items-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg animate-sheet overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full text-[#555] transition-colors hover:bg-field"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function PromoBanner({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn('group overflow-hidden rounded-xl animate-fade-up', className)}>
      <img
        src={src}
        alt="A brighter hospitality tomorrow"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  )
}
