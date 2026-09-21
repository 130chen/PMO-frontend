import SectionHeader from '@/components/common/SectionHeader'
import DashboardCard from '@/components/common/DashboardCard'
import MetricCard from '@/components/common/MetricCard'
import ProjectTable from '@/components/common/ProjectTable'
import TrendLineChart from '@/components/charts/TrendLineChart'
import {
  staffInvestmentKpis,
  staffInvestmentTrendData,
  staffInvestmentTrendSeries,
  staffProjectDistribution,
  staffLoadRows,
  staffLoadColumns,
} from '@/data/mockData'

const MAX_STAFF_COUNT = Math.max(...staffProjectDistribution.map((item) => item.count))

export default function StaffInvestment() {
  return (
    <div className="space-y-6">
      <SectionHeader title="人员投入" description="查看项目人员配置和工作负荷" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {staffInvestmentKpis.map((kpi) => (
          <MetricCard key={kpi.id} data={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <DashboardCard title="人员投入趋势" description="全部在研项目投入人数变化" className="xl:col-span-2">
          <TrendLineChart data={staffInvestmentTrendData} xKey="month" series={staffInvestmentTrendSeries} />
        </DashboardCard>

        <DashboardCard title="项目人员分布" description="按项目统计投入人数">
          <div className="space-y-4">
            {staffProjectDistribution.map((item) => (
              <div key={item.project} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-sm text-muted-foreground">{item.project}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.count / MAX_STAFF_COUNT) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="人员负荷表" description="人员投入率及超负荷情况" bodyClassName="pt-4">
        <ProjectTable columns={staffLoadColumns} rows={staffLoadRows} />
      </DashboardCard>
    </div>
  )
}
