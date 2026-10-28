import { useCallback, useRef, useState } from 'react'
import { Bookmark, Ellipsis, EyeOff, Heart, Link2, MessageCircle, Pencil, Share2, Trash2 } from 'lucide-react'
import type { Post } from '../../data'
import { currentUser, users } from '../../data'
import { useStore } from '../../store'
import { Avatar, Card, PrimaryButton, Tag, cn, useClickOutside } from '../ui'

export function PostCard({ post, compact }: { post: Post; compact?: boolean }) {
  const { liked, savedPosts, toggleLike, toggleSavePost, sharePost, deletePost, updatePost, showToast } = useStore()
  const author = users[post.authorId]
  const isMine = post.authorId === currentUser.id
  const isLiked = liked.has(post.id)
  const isSaved = savedPosts.has(post.id)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(post.body)
  const [hidden, setHidden] = useState(false)
  const [likeAnim, setLikeAnim] = useState(0)
  const menu = useRef<HTMLDivElement>(null)
  useClickOutside(menu, useCallback(() => setMenuOpen(false), []), menuOpen)

  if (hidden) return null

  const body = post.body.replace(/\n?#(\w+)\s*$/g, '')

  const actions = (
    <div className={cn('flex items-center', compact ? 'mt-3 gap-5' : 'mt-5 gap-[38px]')}>
      <button
        onClick={() => {
          toggleLike(post.id)
          setLikeAnim((n) => n + 1)
        }}
        aria-pressed={isLiked}
        className={cn('flex items-center gap-1.5', isLiked ? 'text-[#e50000]' : 'text-[#555]', compact ? 'text-[13px]' : 'text-base')}
      >
        <Heart
          key={likeAnim}
          className={cn(compact ? 'size-[18px]' : 'size-[22px]', likeAnim > 0 && 'animate-heart')}
          fill={isLiked ? '#ff0000' : 'none'}
          stroke={isLiked ? '#ff0000' : '#555'}
          strokeWidth={isLiked ? 0 : 1.75}
        />
        {post.likes}
      </button>
      <button
        onClick={() => showToast('Comments coming soon')}
        className={cn('flex items-center gap-1.5 text-[#555] hover:text-black', compact ? 'text-[13px]' : 'text-base')}
      >
        <MessageCircle className={compact ? 'size-4' : 'size-[18px]'} strokeWidth={1.6} />
        {post.comments}
      </button>
      <button
        onClick={() => sharePost(post.id)}
        className={cn('flex items-center gap-1.5 text-[#555] hover:text-black', compact ? 'text-[13px]' : 'text-base')}
      >
        <Share2 className={compact ? 'size-4' : 'size-[18px]'} strokeWidth={1.6} />
        {post.shares}
      </button>
      {post.image && (
        <button
          onClick={() => {
            toggleSavePost(post.id)
            showToast(isSaved ? 'Removed from saved posts' : 'Saved to your posts')
          }}
          aria-label={isSaved ? 'Unsave post' : 'Save post'}
          className="ml-auto text-[#333] transition-transform active:scale-90"
        >
          <Bookmark
            className={compact ? 'size-[18px]' : 'size-6'}
            strokeWidth={1.6}
            fill={isSaved ? 'currentColor' : 'none'}
          />
        </button>
      )}
    </div>
  )

  const menuItems = isMine
    ? [
        { label: 'Edit', icon: Pencil, color: 'text-[#16a34a]', run: () => setEditing(true) },
        { label: 'Delete', icon: Trash2, color: 'text-[#ef4444]', run: () => deletePost(post.id) },
      ]
    : [
        {
          label: isSaved ? 'Unsave' : 'Save',
          icon: Bookmark,
          color: 'text-[#555]',
          run: () => toggleSavePost(post.id),
        },
        { label: 'Copy link', icon: Link2, color: 'text-[#555]', run: () => sharePost(post.id) },
        { label: 'Hide', icon: EyeOff, color: 'text-[#555]', run: () => setHidden(true) },
      ]

  return (
    <Card className={compact ? 'px-4 pt-4 pb-4' : 'pt-[25px] pr-6 pb-[25px] pl-6'}>
      <div className="flex gap-[22px] max-sm:gap-2.5">
        <Avatar src={author.avatar} size={compact ? 36 : 48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(compact ? 'text-[13px] leading-4' : 'text-[13px] leading-6', !post.image && !compact && '-ml-[7px]')}>
              <span className="font-semibold text-black">{author.name}</span>
              {compact ? <br /> : ' '}
              <span className="text-subtle">
                @{author.handle} . {post.date}
              </span>
            </p>
            <div ref={menu} className="relative">
              <button
                aria-label="Post options"
                onClick={() => setMenuOpen((o) => !o)}
                className="grid h-6 w-7 place-items-center rounded-md text-[#333] hover:bg-field"
              >
                <Ellipsis className="size-5" strokeWidth={2.5} />
              </button>
              {menuOpen &&
                (isMine ? (
                  <div className="absolute top-7 right-1 z-20 flex animate-pop flex-col gap-2 rounded bg-white px-1 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                    {menuItems.map(({ label, icon: Icon, color, run }) => (
                      <button
                        key={label}
                        aria-label={label}
                        title={label}
                        onClick={() => {
                          setMenuOpen(false)
                          run()
                        }}
                        className={cn('grid size-5 place-items-center rounded hover:bg-field', color)}
                      >
                        <Icon className="size-3.5" strokeWidth={2} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="absolute top-7 right-0 z-20 w-40 animate-pop rounded-lg bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                    {menuItems.map(({ label, icon: Icon, run }) => (
                      <button
                        key={label}
                        onClick={() => {
                          setMenuOpen(false)
                          run()
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-ink hover:bg-page"
                      >
                        <Icon className="size-4 text-muted" strokeWidth={1.8} />
                        {label}
                      </button>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {!compact && renderBody()}
        </div>
      </div>
      {compact && renderBody()}
    </Card>
  )

  function renderBody() {
    return (
      <div className={compact ? 'mt-2.5' : 'mt-1.5'}>
        {editing ? (
          <div className="animate-pop">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl bg-field px-3 py-2.5 text-sm leading-6 text-body outline-none focus:ring-2 focus:ring-brand/25"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setDraft(post.body)
                  setEditing(false)
                }}
                className="h-8 rounded-lg px-3 text-[13px] font-medium text-[#555] hover:bg-field"
              >
                Cancel
              </button>
              <PrimaryButton
                onClick={() => {
                  if (draft.trim()) updatePost(post.id, draft.trim())
                  setEditing(false)
                }}
                className="h-8 px-4 text-[13px]"
              >
                Save
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <p
            className={cn(
              'whitespace-pre-line',
              compact ? 'text-xs leading-[18px] text-[#222]' : 'text-sm leading-[23px] text-body',
            )}
          >
            {compact ? body.replace(/\n/g, ' ') : body}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className={cn('flex flex-wrap gap-y-2', compact ? 'mt-2.5 gap-x-2' : 'mt-[15px] gap-x-4')}>
            {post.tags.map((t) => (
              <Tag key={t} compact={compact}>
                {t}
              </Tag>
            ))}
          </div>
        )}
        {post.image && (
          <div className={cn('group overflow-hidden', compact ? 'mt-2.5 rounded' : 'mt-[9px] rounded-lg')}>
            <img
              src={post.image}
              alt=""
              className={cn(
                'w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]',
                compact ? 'aspect-[244/74]' : 'aspect-[641/194]',
              )}
            />
          </div>
        )}
        {actions}
      </div>
    )
  }
}
