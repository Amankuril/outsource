import { useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChartNoAxesColumn, FileText, IdCard, Image, X } from 'lucide-react'
import { currentUser } from '../../data'
import { useStore } from '../../store'
import { Avatar, Card, Modal, PrimaryButton, cn } from '../ui'

type Kind = 'Project' | 'Poll' | 'Experience'

const actions: { label: 'Photo' | Kind; icon: LucideIcon }[] = [
  { label: 'Photo', icon: Image },
  { label: 'Project', icon: FileText },
  { label: 'Poll', icon: ChartNoAxesColumn },
  { label: 'Experience', icon: IdCard },
]

function useComposer(onDone?: () => void) {
  const { addPost, showToast } = useStore()
  const [text, setText] = useState('')
  const [image, setImage] = useState<string>()
  const [kind, setKind] = useState<Kind | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)

  const pickImage = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const submit = () => {
    const body = text.trim()
    if (!body && !image) {
      textarea.current?.focus()
      return
    }
    addPost(kind ? `${body}\n#${kind}` : body, image)
    setText('')
    setImage(undefined)
    setKind(null)
    showToast('Your post is live')
    onDone?.()
  }

  const onAction = (label: 'Photo' | Kind) => {
    if (label === 'Photo') fileInput.current?.click()
    else setKind((k) => (k === label ? null : label))
  }

  const fileField = (
    <input
      ref={fileInput}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        pickImage(e.target.files?.[0])
        e.target.value = ''
      }}
    />
  )

  const attachments = (image || kind) && (
    <div className="mt-3 flex animate-pop flex-wrap items-start gap-3">
      {image && (
        <div className="relative">
          <img src={image} alt="" className="h-20 rounded-lg object-cover" />
          <button
            aria-label="Remove photo"
            onClick={() => setImage(undefined)}
            className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-black/70 text-white"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
      {kind && (
        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-brand-soft px-2.5 text-xs font-medium text-brand-deep">
          {kind}
          <button aria-label={`Remove ${kind}`} onClick={() => setKind(null)}>
            <X className="size-3" />
          </button>
        </span>
      )}
    </div>
  )

  return { text, setText, image, kind, submit, onAction, fileField, attachments, textarea }
}

export function Composer() {
  const c = useComposer()
  const [focused, setFocused] = useState(false)
  return (
    <Card className="px-6 pt-[18px] pb-5">
      {c.fileField}
      <div className="flex gap-[22px]">
        <Avatar src={currentUser.avatar} size={48} />
        <textarea
          ref={c.textarea}
          value={c.text}
          onChange={(e) => c.setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) c.submit()
          }}
          rows={1}
          placeholder={`what’s on your mind, ${currentUser.firstName}?`}
          className={cn(
            'flex-1 resize-none rounded-[25px] bg-field px-3.5 py-[13px] text-base leading-6 text-ink outline-none transition-all duration-300 placeholder:text-muted',
            (focused || c.text) && 'min-h-24 rounded-2xl ring-2 ring-brand/25',
          )}
        />
      </div>
      <div className="pl-[76px]">{c.attachments}</div>
      <div className="mt-4 flex items-center pl-1.5 sm:pl-[76px]">
        <div className="flex flex-1 flex-wrap items-center gap-x-[30px] gap-y-2">
          {actions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => c.onAction(label)}
              className={cn(
                'flex items-center gap-2 text-base font-medium transition-colors hover:text-brand-strong',
                c.kind === label ? 'text-brand-strong' : 'text-[#555]',
              )}
            >
              <Icon className="size-5" strokeWidth={1.6} />
              {label}
            </button>
          ))}
        </div>
        <PrimaryButton onClick={c.submit} className="h-9 w-[90px] text-[13px]">
          Post
        </PrimaryButton>
      </div>
    </Card>
  )
}

export function MobileComposer() {
  const { setComposerOpen } = useStore()
  return (
    <Card className="px-4 pt-4 pb-3">
      <div className="flex items-center gap-2.5">
        <Avatar src={currentUser.avatar} size={36} />
        <button
          onClick={() => setComposerOpen(true)}
          className="h-9 flex-1 rounded-full bg-field px-4 text-left text-[13px] text-muted"
        >
          Share an Update...
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between px-1">
        {actions.slice(0, 3).map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setComposerOpen(true)}
            className="flex items-center gap-2.5 text-[13px] text-[#555]"
          >
            <Icon className="size-4" strokeWidth={1.6} />
            {label}
          </button>
        ))}
      </div>
    </Card>
  )
}

export function ComposerModal() {
  const { composerOpen, setComposerOpen } = useStore()
  const close = () => setComposerOpen(false)
  const c = useComposer(close)
  return (
    <Modal open={composerOpen} onClose={close} title="Create a post">
      {c.fileField}
      <div className="flex gap-3">
        <Avatar src={currentUser.avatar} size={40} />
        <textarea
          ref={c.textarea}
          autoFocus
          value={c.text}
          onChange={(e) => c.setText(e.target.value)}
          rows={5}
          placeholder={`what’s on your mind, ${currentUser.firstName}?`}
          className="flex-1 resize-none rounded-xl bg-field px-3.5 py-3 text-[15px] text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-brand/25"
        />
      </div>
      {c.attachments}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => c.onAction(label)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-strong',
              c.kind === label ? 'text-brand-strong' : 'text-[#555]',
            )}
          >
            <Icon className="size-[18px]" strokeWidth={1.6} />
            {label}
          </button>
        ))}
        <PrimaryButton onClick={c.submit} className="ml-auto h-9 w-[90px] text-[13px]">
          Post
        </PrimaryButton>
      </div>
    </Modal>
  )
}
