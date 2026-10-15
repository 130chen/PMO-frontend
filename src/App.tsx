import { useEffect, useMemo, useState } from 'react'
import { parseHash, setHash } from '@/lib/route'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import AIChatDrawer from './components/ai/AIChatDrawer'
import Overview from './pages/Overview'
import ProjectProgress from './pages/project-management/ProjectProgress'
import StaffInvestment from './pages/project-management/StaffInvestment'
import KeySummary from './pages/project-management/KeySummary'
import ProjectList from './pages/project-management/ProjectList'
import FocusProjects from './pages/system-config/FocusProjects'
import FieldMapping from './pages/system-config/FieldMapping'
import GenericFeaturePage from './pages/GenericFeaturePage'
import { genericPageConfigs } from './data/mockData'

const DEDICATED_PAGES: Record<string, React.ComponentType> = {
  overview: Overview,
  'project-progress': ProjectProgress,
  'staff-investment': StaffInvestment,
  'key-summary': KeySummary,
  'jira-projects': ProjectList,
  'focus-projects': FocusProjects,
  'field-mapping': FieldMapping,
}

const PAGE_META: Record<string, { title: string; description: string }> = {
  overview: { title: '项目总览', description: '统一掌握研发项目进度、质量、资源与风险' },
  'project-progress': { title: '项目进度', description: '查看项目整体进度、里程碑及延期情况' },
  'staff-investment': { title: '人员投入', description: '查看项目人员配置和工作负荷' },
  'key-summary': { title: '重点总结', description: '来自 Confluence 的项目周报与重点总结' },
  'jira-projects': { title: '项目列表', description: '查看配置的项目清单，点击详情可查看任务排期' },
  'focus-projects': { title: '关注项目', description: '管理个人重点关注项目以及 Jira / Confluence 链接' },
  'field-mapping': { title: '字段映射', description: '选择项目后，按字段条件筛选故障记录' },
}

function App() {
  const [activePageId, setActivePageId] = useState(() => parseHash().pageId)
  const [aiOpen, setAiOpen] = useState(false)

  useEffect(() => {
    function handleHashChange() {
      setActivePageId(parseHash().pageId)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function navigate(id: string) {
    setHash(id)
    setActivePageId(id)
  }

  const PageComponent = useMemo(() => {
    if (DEDICATED_PAGES[activePageId]) {
      return DEDICATED_PAGES[activePageId]
    }
    return null
  }, [activePageId])

  const genericConfig = useMemo(
    () => genericPageConfigs.find((page) => page.id === activePageId),
    [activePageId],
  )

  const pageMeta = useMemo(() => {
    const dedicated = PAGE_META[activePageId]
    if (dedicated) return dedicated
    if (genericConfig) return { title: genericConfig.title, description: genericConfig.description }
    return { title: '', description: '' }
  }, [activePageId, genericConfig])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePageId={activePageId} onNavigate={navigate} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={pageMeta.title} description={pageMeta.description} onOpenAI={() => setAiOpen(true)} />

        <main className="mx-auto w-full max-w-content px-6 pb-20 pt-8 lg:px-10">
          <div key={activePageId} className="animate-fadeIn">
            {PageComponent ? (
              <PageComponent />
            ) : genericConfig ? (
              <GenericFeaturePage config={genericConfig} />
            ) : (
              <Overview />
            )}
          </div>
        </main>
      </div>

      <AIChatDrawer open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}

export default App
