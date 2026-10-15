import { ExternalLink } from 'lucide-react'
import DashboardCard from '@/components/common/DashboardCard'
import ProgressBar from '@/components/common/ProgressBar'
import StatusBadge from '@/components/common/StatusBadge'
import { focusProjects } from '@/data/mockData'

export default function FocusProjects() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {focusProjects.map((project) => (
          <DashboardCard
            key={project.id}
            title={project.name}
            headerAction={<StatusBadge status={project.health} />}
            bodyClassName="space-y-4 pt-4"
          >
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>当前进度</span>
                <span className="font-medium text-foreground">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">项目负责人</span>
              <span className="font-medium text-foreground">{project.owner}</span>
            </div>

            <div className="flex items-center gap-2 border-t border-border pt-4">
              <a
                href={project.jiraUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
              >
                Jira
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
              <a
                href={project.confluenceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
              >
                Confluence
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  )
}
