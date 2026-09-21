import SectionHeader from '@/components/common/SectionHeader'
import DashboardCard from '@/components/common/DashboardCard'
import MetricCard from '@/components/common/MetricCard'
import ProjectTable from '@/components/common/ProjectTable'
import TrendLineChart from '@/components/charts/TrendLineChart'
import {
  projectProgressKpis,
  projectProgressTrendData,
  overviewTrendSeries,
  keyProjects,
  keyProjectColumns,
} from '@/data/mockData'

export default function ProjectProgress() {
  return (
    <div className="space-y-6">
      <SectionHeader title="项目进度" description="查看项目整体进度、里程碑及延期情况" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {projectProgressKpis.map((kpi) => (
          <MetricCard key={kpi.id} data={kpi} />
        ))}
      </div>

      <DashboardCard title="项目进度趋势" description="计划进度 vs 实际进度（1月-6月）">
        <TrendLineChart data={projectProgressTrendData} xKey="month" series={overviewTrendSeries} />
      </DashboardCard>

      <DashboardCard title="项目进度表" description="各项目计划与实际进度对比" bodyClassName="pt-4">
        <ProjectTable columns={keyProjectColumns} rows={keyProjects} />
      </DashboardCard>
    </div>
  )
}
