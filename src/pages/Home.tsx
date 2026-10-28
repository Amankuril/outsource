import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import brighterTomorrow from '../assets/brighter-tomorrow.webp'
import { Composer, ComposerModal, MobileComposer } from '../components/home/Composer'
import { PostCard } from '../components/home/PostCard'
import { HomeHero, MobileOpportunities, OpportunitiesWidget, ProgressCard, UpcomingActivity } from '../components/home/Widgets'
import { Header } from '../components/Header'
import { MobileNav } from '../components/MobileNav'
import { ProfileCard, QuickLinks } from '../components/Sidebar'
import { Card, PromoBanner } from '../components/ui'
import { currentUser } from '../data'
import { useStore } from '../store'

function Feed({ compact }: { compact?: boolean }) {
  const { posts, savedPosts } = useStore()
  const [params] = useSearchParams()
  const savedOnly = params.get('view') === 'saved'
  const visible = savedOnly ? posts.filter((p) => savedPosts.has(p.id)) : posts
  return (
    <>
      {savedOnly && (
        <div className="flex animate-pop items-center justify-between rounded-xl bg-brand-soft px-4 py-2.5 text-sm text-brand-deep">
          <span className="font-medium">Showing saved posts ({visible.length})</span>
          <Link to="/" className="flex items-center gap-1 font-semibold hover:underline">
            <X className="size-4" /> Clear
          </Link>
        </div>
      )}
      {visible.map((p) => (
        <PostCard key={p.id} post={p} compact={compact} />
      ))}
      {visible.length === 0 && (
        <Card className="px-6 py-10 text-center text-sm text-muted">
          {savedOnly ? 'No saved posts yet — tap the bookmark on a post to save it.' : 'No posts yet. Share your first update!'}
        </Card>
      )}
    </>
  )
}

export default function Home() {
  const { setComposerOpen } = useStore()
  const openComposer = () => setComposerOpen(true)

  return (
    <div className="min-h-screen bg-page-mobile lg:bg-page">
      <Header onCreate={openComposer} />

      {/* Desktop */}
      <main className="mx-auto hidden max-w-[1440px] grid-cols-[220px_minmax(0,1fr)_300px] items-start gap-3 pt-4 pr-7 pb-6 pl-10 lg:grid xl:grid-cols-[242px_minmax(0,1fr)_347px]">
        <aside className="space-y-3">
          <ProfileCard />
          <QuickLinks variant="list" />
          <PromoBanner src={brighterTomorrow} className="aspect-[242/302]" />
        </aside>
        <div className="space-y-3">
          <HomeHero />
          <Composer />
          <Feed />
        </div>
        <aside className="space-y-3">
          <OpportunitiesWidget />
          <ProgressCard />
          <UpcomingActivity />
        </aside>
      </main>

      {/* Mobile */}
      <main className="mx-auto max-w-xl pb-28 lg:hidden">
        <div className="flex animate-fade-up items-end justify-between px-4 pt-3 pb-4">
          <div>
            <p className="text-[11px] font-semibold text-black">WELCOME BACK</p>
            <p className="text-[28px] leading-8 font-semibold text-black">{currentUser.firstName}</p>
            <p className="mt-1 text-[11px] text-[#555]">Same Passion. Bigger Opportunities.</p>
          </div>
          <div className="flex gap-4 pb-4 text-center">
            <div>
              <p className="text-[22px] leading-6 font-semibold text-brand">{currentUser.posts}</p>
              <p className="text-[11px] text-[#333]">Posts</p>
            </div>
            <div>
              <p className="text-[22px] leading-6 font-semibold text-[#00c83f]">{currentUser.impactPoints}</p>
              <p className="text-[11px] text-[#333]">Impact</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 px-4">
          <MobileComposer />
          <MobileOpportunities />
          <Feed compact />
          <ProgressCard compact />
          <UpcomingActivity />
        </div>
      </main>
      <MobileNav accent="teal" onFab={openComposer} />
      <ComposerModal />
    </div>
  )
}
