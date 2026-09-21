import { useMemo, useState } from 'react'
import Header from './components/layout/Header'
import AIChatDrawer from './components/ai/AIChatDrawer'
import Overview from './pages/Overview'
import ProjectProgress from './pages/project-management/ProjectProgress'
import StaffInvestment from './pages/project-management/StaffInvestment'
import FocusProjects from './pages/system-config/FocusProjects'
import GenericFeaturePage from './pages/GenericFeaturePage'
import { genericPageConfigs } from './data/mockData'

const DEDICATED_PAGES: Record<string, React.ComponentType> = {
  overview: Overview,
  'project-progress': ProjectProgress,
  'staff-investment': StaffInvestment,
  'focus-projects': FocusProjects,
}

function App() {
  const [activePageId, setActivePageId] = useState('overview')
  const [aiOpen, setAiOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      <Header activePageId={activePageId} onNavigate={setActivePageId} onOpenAI={() => setAiOpen(true)} />

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

      <AIChatDrawer open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}

export default App
