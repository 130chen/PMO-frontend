import type { Task } from 'gantt-task-react'

// gantt-task-react 的默认 Tooltip 硬编码为英文 "Duration:"/"Progress:"，这里复刻其私有 CSS
// 类名（来自已全局引入的 gantt-task-react/dist/index.css）样式，仅替换文案为中文。
interface GanttTooltipContentProps {
  task: Task
  fontSize: string
  fontFamily: string
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function GanttTooltipContent({ task, fontSize, fontFamily }: GanttTooltipContentProps) {
  const durationDays = Math.round((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24))
  return (
    <div className="_3T42e" style={{ fontSize, fontFamily }}>
      <b style={{ fontSize: `calc(${fontSize} + 6px)` }}>
        {`${task.name}：${formatDate(task.start)} ~ ${formatDate(task.end)}`}
      </b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className="_29NTg">{`工期：${durationDays} 天`}</p>
      )}
      {!!task.progress && <p className="_29NTg">{`完成度：${task.progress}%`}</p>}
    </div>
  )
}
