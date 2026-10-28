import { Link } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { ComposerModal } from '../components/home/Composer'
import { Header } from '../components/Header'
import { MobileNav } from '../components/MobileNav'
import { ProfileCard, QuickLinks } from '../components/Sidebar'
import { Card } from '../components/ui'
import { useStore } from '../store'

export default function ComingSoon({ title }: { title: string }) {
  const { setComposerOpen } = useStore()
  return (
    <div className="min-h-screen bg-page-mobile lg:bg-page">
      <Header onCreate={() => setComposerOpen(true)} />
      <main className="mx-auto grid max-w-[1440px] items-start gap-3 px-4 pt-4 pb-28 lg:grid-cols-[220px_minmax(0,1fr)] lg:pr-7 lg:pb-6 lg:pl-10 xl:grid-cols-[242px_minmax(0,1fr)]">
        <aside className="hidden space-y-3 lg:block">
          <ProfileCard />
          <QuickLinks variant="list" />
        </aside>
        <Card className="grid place-items-center px-6 py-20 text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft">
              <Construction className="size-7 text-brand-strong" strokeWidth={1.6} />
            </span>
            <h1 className="mt-4 font-display text-3xl text-ink">{title}</h1>
            <p className="mt-2 text-sm text-muted">This section isn’t in the design yet — it’s coming soon.</p>
            <Link
              to="/opportunities"
              className="mt-5 inline-flex h-9 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-[#f57f0c]"
            >
              Browse Opportunities
            </Link>
          </div>
        </Card>
      </main>
      <MobileNav accent="brand" onFab={() => setComposerOpen(true)} />
      <ComposerModal />
    </div>
  )
}
