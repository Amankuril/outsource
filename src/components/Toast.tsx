import { CircleCheck } from 'lucide-react'
import { useStore } from '../store'

export function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div
      role="status"
      key={toast}
      className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 animate-pop items-center gap-2 rounded-full bg-[#1f1f1f] px-4 py-2.5 text-sm text-white shadow-xl lg:bottom-8"
    >
      <CircleCheck className="size-4 text-[#4ade80]" />
      {toast}
    </div>
  )
}
