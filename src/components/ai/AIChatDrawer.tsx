import { useState } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const QUICK_ACTIONS = ['项目风险分析', '本周项目总结', '人员投入分析', '项目延期分析', '生成项目周报']

const WELCOME_MESSAGE =
  '你好，我可以帮你分析项目进度、风险、人员、资源和合规情况。'

let idCounter = 0
function nextId() {
  idCounter += 1
  return `msg-${idCounter}`
}

export default function AIChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId(), role: 'assistant', content: WELCOME_MESSAGE },
  ])
  const [input, setInput] = useState('')

  const sendMessage = (content: string) => {
    if (!content.trim()) return
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', content }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: `已收到「${content}」，正在为你汇总相关项目数据，稍后将生成详细分析结果（示例回复，暂未接入真实数据）。`,
        },
      ])
    }, 500)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]" onClick={onClose} />

      <div className="absolute right-0 top-0 flex h-full w-[420px] max-w-full animate-drawerIn flex-col border-l border-border bg-card shadow-menu">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold text-foreground">AI 项目助手</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="关闭">
            <X className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>

        <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-5 py-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">快捷操作</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => sendMessage(action)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
              >
                {action}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage(input)
            }}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="向 AI 助手提问…"
              className="flex-1"
            />
            <Button type="submit" size="icon" aria-label="发送">
              <Send className="h-4 w-4" strokeWidth={2} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
