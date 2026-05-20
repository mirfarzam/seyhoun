import { TopBar } from './components/layout/TopBar'
import { Sidebar } from './components/layout/Sidebar'
import { DesignMode } from './modes/DesignMode'
import { PresentMode } from './modes/PresentMode'
import { MonitorMode } from './modes/MonitorMode'
import { useUIStore } from './stores/ui'

export function App() {
  const { mode } = useUIStore()

  return (
    <div className="h-screen flex flex-col bg-[#0d0f1a] text-[#e2e4f0] overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar only makes sense in design mode */}
        {mode === 'design' && <Sidebar />}
        <main className="flex flex-1 overflow-hidden">
          {mode === 'design'   && <DesignMode />}
          {mode === 'present'  && <PresentMode />}
          {mode === 'monitor'  && <MonitorMode />}
        </main>
      </div>
    </div>
  )
}
