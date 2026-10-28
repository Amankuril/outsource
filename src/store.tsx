import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { currentUser, initialListings, initialPosts, upcomingEvent } from './data'
import type { Listing, Post } from './data'

type Store = {
  posts: Post[]
  liked: Set<string>
  savedPosts: Set<string>
  addPost: (body: string, image?: string) => void
  updatePost: (id: string, body: string) => void
  deletePost: (id: string) => void
  toggleLike: (id: string) => void
  toggleSavePost: (id: string) => void
  sharePost: (id: string) => void

  listings: Listing[]
  addListing: (listing: Listing) => void
  savedListings: Set<string>
  toggleSaveListing: (id: string) => void
  applied: Set<string>
  apply: (id: string) => void

  joinedEvent: boolean
  toggleJoinEvent: () => void
  eventGoing: number

  notifyMatches: boolean
  setNotifyMatches: (on: boolean) => void
  unreadNotifications: number
  markNotificationsRead: () => void

  composerOpen: boolean
  setComposerOpen: (open: boolean) => void
  postOpportunityOpen: boolean
  setPostOpportunityOpen: (open: boolean) => void

  toast: string | null
  showToast: (message: string) => void
}

const StoreContext = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`techlinked:${key}`)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback))
  useEffect(() => {
    try {
      localStorage.setItem(`techlinked:${key}`, JSON.stringify(value))
    } catch {
      // storage unavailable — state stays in memory
    }
  }, [key, value])
  return [value, setValue] as const
}

function toggleIn(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storedPosts, setPosts] = usePersisted<Post[]>('posts', initialPosts)
  // Asset URLs are hashed per build, so seed posts always take their image from the bundle.
  const posts = useMemo(
    () => storedPosts.map((p) => ({ ...p, image: initialPosts.find((s) => s.id === p.id)?.image ?? p.image })),
    [storedPosts],
  )
  const [liked, setLiked] = usePersisted<string[]>('liked', ['p1', 'p2'])
  const [savedPosts, setSavedPosts] = usePersisted<string[]>('savedPosts', [])
  const [extraListings, setExtraListings] = usePersisted<Listing[]>('listings', [])
  const [savedListings, setSavedListings] = usePersisted<string[]>('savedListings', [])
  const [applied, setApplied] = usePersisted<string[]>('applied', [])
  const [joinedEvent, setJoinedEvent] = usePersisted('joinedEvent', false)
  const [notifyMatches, setNotifyMatches] = usePersisted('notifyMatches', true)
  const [unreadNotifications, setUnread] = useState(3)
  const [composerOpen, setComposerOpen] = useState(false)
  const [postOpportunityOpen, setPostOpportunityOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>(undefined)

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  const value = useMemo<Store>(
    () => ({
      posts,
      liked: new Set(liked),
      savedPosts: new Set(savedPosts),
      addPost: (body, image) =>
        setPosts((p) => [
          {
            id: `p${Date.now()}`,
            authorId: currentUser.id,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            body,
            tags: (body.match(/#(\w+)/g) ?? []).map((t) => t.slice(1)),
            image,
            likes: 0,
            comments: 0,
            shares: 0,
          },
          ...p,
        ]),
      updatePost: (id, body) => setPosts((p) => p.map((x) => (x.id === id ? { ...x, body } : x))),
      deletePost: (id) => setPosts((p) => p.filter((x) => x.id !== id)),
      toggleLike: (id) => {
        const wasLiked = liked.includes(id)
        setLiked((l) => toggleIn(l, id))
        setPosts((p) => p.map((x) => (x.id === id ? { ...x, likes: x.likes + (wasLiked ? -1 : 1) } : x)))
      },
      toggleSavePost: (id) => setSavedPosts((s) => toggleIn(s, id)),
      sharePost: (id) => {
        setPosts((p) => p.map((x) => (x.id === id ? { ...x, shares: x.shares + 1 } : x)))
        navigator.clipboard?.writeText(`${location.origin}/?post=${id}`).catch(() => {})
        showToast('Link copied to clipboard')
      },

      listings: [...extraListings, ...initialListings],
      addListing: (listing) => setExtraListings((l) => [listing, ...l]),
      savedListings: new Set(savedListings),
      toggleSaveListing: (id) => setSavedListings((s) => toggleIn(s, id)),
      applied: new Set(applied),
      apply: (id) => setApplied((a) => (a.includes(id) ? a : [...a, id])),

      joinedEvent,
      toggleJoinEvent: () => setJoinedEvent((j) => !j),
      eventGoing: upcomingEvent.going + (joinedEvent ? 1 : 0),

      notifyMatches,
      setNotifyMatches,
      unreadNotifications,
      markNotificationsRead: () => setUnread(0),

      composerOpen,
      setComposerOpen,
      postOpportunityOpen,
      setPostOpportunityOpen,

      toast,
      showToast,
    }),
    [
      posts,
      liked,
      savedPosts,
      extraListings,
      savedListings,
      applied,
      joinedEvent,
      notifyMatches,
      unreadNotifications,
      composerOpen,
      postOpportunityOpen,
      toast,
      showToast,
      setPosts,
      setLiked,
      setSavedPosts,
      setExtraListings,
      setSavedListings,
      setApplied,
      setJoinedEvent,
      setNotifyMatches,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
