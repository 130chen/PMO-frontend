import DashboardCard from '@/components/common/DashboardCard'
import MetricCard from '@/components/common/MetricCard'
import ProjectTable from '@/components/common/ProjectTable'
import TrendLineChart from '@/components/charts/TrendLineChart'
import type { GenericPageConfig } from '@/types'

export default function GenericFeaturePage({ config }: { config: GenericPageConfig }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {config.kpis.map((kpi) => (
          <MetricCard key={kpi.id} data={kpi} />
        ))}
      </div>

      <DashboardCard title={config.trendTitle}>
        <TrendLineChart data={config.trendData} xKey="month" series={config.trendSeries} />
      </DashboardCard>

      <DashboardCard title={config.tableTitle} bodyClassName="pt-4">
        <ProjectTable columns={config.tableColumns} rows={config.tableRows} />
      </DashboardCard>
    </div>
  )
}
