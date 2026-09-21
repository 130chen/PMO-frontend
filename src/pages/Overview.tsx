import SectionHeader from '@/components/common/SectionHeader'
import DashboardCard from '@/components/common/DashboardCard'
import MetricCard from '@/components/common/MetricCard'
import ProjectTable from '@/components/common/ProjectTable'
import ProgressRing from '@/components/charts/ProgressRing'
import TrendLineChart from '@/components/charts/TrendLineChart'
import { Badge } from '@/components/ui/badge'
import {
  overviewKpis,
  overviewCompletionRate,
  overviewStatusDistribution,
  overviewTrendData,
  overviewTrendSeries,
  overviewRisks,
  keyProjects,
  keyProjectColumns,
} from '@/data/mockData'

export default function Overview() {
  return (
    <div className="space-y-6">
      <SectionHeader title="项目总览" description="统一掌握研发项目进度、质量、资源与风险" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {overviewKpis.map((kpi) => (
          <MetricCard key={kpi.id} data={kpi} />
        ))}
      </div>

      <DashboardCard title="项目进度概览" description="整体完成率与项目状态分布">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <ProgressRing value={overviewCompletionRate} sublabel="项目整体完成率" />
          </div>
          <div className="space-y-4">
            {overviewStatusDistribution.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.colorVar }}
                />
                <span className="w-14 shrink-0 text-sm text-muted-foreground">{item.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.value / 42) * 100}%`,
                      backgroundColor: item.colorVar,
                    }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <DashboardCard title="项目进度趋势" description="计划进度 vs 实际进度（1月-6月）" className="xl:col-span-2">
          <TrendLineChart data={overviewTrendData} xKey="month" series={overviewTrendSeries} />
        </DashboardCard>

        <DashboardCard title="重点风险" description="需要重点关注的项目风险">
          <div className="space-y-3">
            {overviewRisks.map((risk) => (
              <div
                key={risk.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border p-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{risk.project}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{risk.issue}</p>
                </div>
                <Badge variant={risk.level === 'high' ? 'danger' : 'warning'} className="shrink-0">
                  {risk.level === 'high' ? '高风险' : '中风险'}
                </Badge>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="重点项目" description="核心研发项目进展一览" bodyClassName="pt-4">
        <ProjectTable columns={keyProjectColumns} rows={keyProjects} />
      </DashboardCard>
    </div>
  )
}
