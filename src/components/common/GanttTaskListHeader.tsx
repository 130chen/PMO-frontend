// gantt-task-react 的默认表头硬编码为英文 Name/From/To，这里用库自带的私有 CSS 类名
// （来自已全局引入的 gantt-task-react/dist/index.css）复刻其样式，仅替换文案为中文。
interface GanttTaskListHeaderProps {
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
}

export default function GanttTaskListHeader({ headerHeight, rowWidth, fontFamily, fontSize }: GanttTaskListHeaderProps) {
  return (
    <div className="_3_ygE" style={{ fontFamily, fontSize }}>
      <div className="_1nBOt" style={{ height: headerHeight - 2 }}>
        <div className="_WuQ0f" style={{ minWidth: rowWidth }}>
          &nbsp;名称
        </div>
        <div className="_2eZzQ" style={{ height: headerHeight * 0.5, marginTop: headerHeight * 0.2 }} />
        <div className="_WuQ0f" style={{ minWidth: rowWidth }}>
          &nbsp;开始
        </div>
        <div className="_2eZzQ" style={{ height: headerHeight * 0.5, marginTop: headerHeight * 0.25 }} />
        <div className="_WuQ0f" style={{ minWidth: rowWidth }}>
          &nbsp;结束
        </div>
      </div>
    </div>
  )
}
