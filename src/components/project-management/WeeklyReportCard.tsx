import type { ReactNode } from 'react'
import { AlertTriangle, Ban, Clock, ExternalLink, Flag, ListChecks, TrendingUp, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ProgressBar from '@/components/common/ProgressBar'
import type { WeeklyReport, WeeklyReportPerson } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'muted' }> = {
  green: { label: '正常', variant: 'success' },
  yellow: { label: '预警', variant: 'warning' },
  red: { label: '风险', variant: 'danger' },
}

const RISK_LEVEL_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'muted' }> = {
  high: { label: '高', variant: 'danger' },
  medium: { label: '中', variant: 'warning' },
  low: { label: '低', variant: 'muted' },
}

function ownerNames(owners?: WeeklyReportPerson[]): string {
  if (!owners || owners.length === 0) return ''
  return owners.map((owner) => owner.name).filter(Boolean).join('、')
}

const SECTION_TONE_CLASSES: Record<'primary' | 'danger' | 'warning' | 'muted', string> = {
  primary: 'bg-primary-soft text-primary',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  muted: 'bg-muted text-muted-foreground',
}

function ReportSection({
  icon,
  title,
  tone = 'primary',
  children,
}: {
  icon: ReactNode
  title: string
  tone?: 'primary' | 'danger' | 'warning' | 'muted'
  children: ReactNode
}) {
  return (
    <div className="border-t border-border pt-4">
      <div className="mb-3 flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${SECTION_TONE_CLASSES[tone]}`}>
          {icon}
        </span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="space-y-2 pl-1">{children}</div>
    </div>
  )
}

export default function WeeklyReportCard({ report }: { report: WeeklyReport }) {
  const status = report.status?.normalized_status ?? ''
  const statusConfig = STATUS_CONFIG[status]

  const period = report.report_period
  const periodLabel =
    period?.week != null
      ? `第 ${period.week} 周${period.start_date && period.end_date ? `（${period.start_date} ~ ${period.end_date}）` : ''}`
      : undefined

  const title = report.source?.page_title || report.project?.project_name || '未命名周报'

  const progress = report.progress ?? []
  const risks = report.risks ?? []
  const blockers = report.blockers ?? []
  const milestones = report.milestones ?? []
  const nextActions = report.next_actions ?? []

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/40 hover:shadow-menu">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base font-semibold text-foreground">{title}</h4>
          {periodLabel && <Badge variant="muted">{periodLabel}</Badge>}
          {statusConfig && <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>}
        </div>
        {report.source?.page_url && (
          <a
            href={report.source.page_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
          >
            查看原文
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        )}
      </div>

      {progress.length > 0 && (
        <ReportSection icon={<TrendingUp className="h-4 w-4" strokeWidth={2} />} title="进展" tone="primary">
          {progress.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2"
            >
              <span className="text-sm text-foreground">{item.title}</span>
              {ownerNames(item.owners) && (
                <span className="text-xs text-muted-foreground">{ownerNames(item.owners)}</span>
              )}
            </div>
          ))}
        </ReportSection>
      )}

      {risks.length > 0 && (
        <ReportSection icon={<AlertTriangle className="h-4 w-4" strokeWidth={2} />} title="风险" tone="danger">
          {risks.map((risk) => {
            const levelConfig = risk.level ? RISK_LEVEL_CONFIG[risk.level] : undefined
            return (
              <div key={risk.id} className="rounded-xl bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  {risk.title}
                  {levelConfig && <Badge variant={levelConfig.variant}>{levelConfig.label}</Badge>}
                </div>
                {risk.impact && <p className="mt-1 text-xs text-muted-foreground">{risk.impact}</p>}
              </div>
            )
          })}
        </ReportSection>
      )}

      {blockers.length > 0 && (
        <ReportSection icon={<Ban className="h-4 w-4" strokeWidth={2} />} title="阻塞" tone="warning">
          {blockers.map((blocker) => (
            <div key={blocker.id} className="rounded-xl bg-muted/50 px-3 py-2">
              <div className="text-sm text-foreground">{blocker.title}</div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {blocker.impact && <span>{blocker.impact}</span>}
                {blocker.expected_resolve_date && <span>预计解决：{blocker.expected_resolve_date}</span>}
              </div>
            </div>
          ))}
        </ReportSection>
      )}

      {milestones.length > 0 && (
        <ReportSection icon={<Flag className="h-4 w-4" strokeWidth={2} />} title="里程碑" tone="primary">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-xl bg-muted/50 px-3 py-2">
              <div className="flex items-center justify-between gap-3 text-sm text-foreground">
                <span>{milestone.title}</span>
                {milestone.target_date && (
                  <span className="text-xs text-muted-foreground">目标：{milestone.target_date}</span>
                )}
              </div>
              {milestone.progress_percent != null && (
                <ProgressBar value={milestone.progress_percent} showLabel className="mt-1.5" />
              )}
            </div>
          ))}
        </ReportSection>
      )}

      {nextActions.length > 0 && (
        <ReportSection icon={<ListChecks className="h-4 w-4" strokeWidth={2} />} title="下一步" tone="muted">
          {nextActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2 text-sm text-foreground"
            >
              <span>{action.title}</span>
              <span className="flex items-center gap-3 text-xs text-muted-foreground">
                {ownerNames(action.owners) && <span>{ownerNames(action.owners)}</span>}
                {action.due_date && <span>{action.due_date}</span>}
              </span>
            </div>
          ))}
        </ReportSection>
      )}

      {(report.source?.created_by || report.source?.created_at || report.source?.updated_at) && (
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          {report.source?.created_by && (
            <span className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" strokeWidth={2} />
              {report.source.created_by}
            </span>
          )}
          {report.source?.created_at && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              创建于 {report.source.created_at}
            </span>
          )}
          {report.source?.updated_at && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              更新于 {report.source.updated_at}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
