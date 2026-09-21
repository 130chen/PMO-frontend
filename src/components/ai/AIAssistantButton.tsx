import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AIAssistantButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="soft"
      size="sm"
      className="hidden items-center gap-1.5 rounded-xl px-3 sm:flex"
      onClick={onClick}
    >
      <Sparkles className="h-4 w-4" strokeWidth={2} />
      AI助手
    </Button>
  )
}
