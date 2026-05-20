import { Activity, Layout, Layers, Monitor, Save, PanelLeft, ChevronRight } from 'lucide-react'
import { useUIStore, type AppMode } from '../../stores/ui'
import { useDiagramStore } from '../../stores/diagram'
import { api } from '../../lib/api'

const MODES: { key: AppMode; label: string; Icon: typeof Layout }[] = [
  { key: 'design',  label: 'Design',  Icon: Layout },
  { key: 'present', label: 'Present', Icon: Layers },
  { key: 'monitor', label: 'Monitor', Icon: Monitor },
]

export function TopBar() {
  const { mode, setMode, toggleSidebar } = useUIStore()
  const { diagramId, diagramName, nodes, edges, isDirty, markSaved, breadcrumb, popToIndex, loadDiagram } = useDiagramStore()

  async function handleSave() {
    if (!diagramId) return
    try {
      await api.diagrams.update(diagramId, {
        name: diagramName,
        nodesJson: JSON.stringify(nodes),
        edgesJson: JSON.stringify(edges),
      })
      markSaved()
    } catch (e) {
      console.error('Save failed', e)
    }
  }

  async function navigateToBreadcrumb(index: number) {
    // Save current diagram first
    if (diagramId && isDirty) {
      try {
        await api.diagrams.update(diagramId, {
          name: diagramName,
          nodesJson: JSON.stringify(nodes),
          edgesJson: JSON.stringify(edges),
        })
        markSaved()
      } catch (e) {
        console.error('Auto-save failed before navigating', e)
      }
    }

    const target = breadcrumb[index]
    if (!target) return

    try {
      const d = await api.diagrams.get(target.diagramId)
      const projectId = d.projectId
      popToIndex(index)
      loadDiagram({
        id: target.diagramId,
        projectId,
        name: target.diagramName,
        nodes: JSON.parse(d.nodesJson || '[]'),
        edges: JSON.parse(d.edgesJson || '[]'),
      })
    } catch (e) {
      console.error('Failed to navigate to breadcrumb', e)
    }
  }

  const showBreadcrumb = breadcrumb.length > 0

  return (
    <header className="h-12 shrink-0 flex items-center gap-3 px-4 border-b border-[#2d3150] bg-[#0d0f1a]">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="text-[#5a5d75] hover:text-[#8b8fa8] transition-colors"
        title="Toggle sidebar"
      >
        <PanelLeft className="w-4 h-4" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <Activity className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-semibold text-[#e2e4f0] tracking-tight">Seyhoun</span>
      </div>

      <div className="w-px h-5 bg-[#2d3150]" />

      {/* Breadcrumb / current diagram */}
      <div className="flex items-center gap-1 min-w-0 flex-1">
        {showBreadcrumb ? (
          <>
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.diagramId} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => navigateToBreadcrumb(i)}
                  className="text-xs text-[#5a5d75] hover:text-indigo-400 transition-colors truncate max-w-[120px]"
                  title={crumb.diagramName}
                >
                  {crumb.diagramName}
                </button>
                <ChevronRight className="w-3 h-3 text-[#2d3150] shrink-0" />
              </span>
            ))}
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm text-[#8b8fa8] truncate max-w-[200px]">{diagramName}</span>
              {isDirty && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" title="Unsaved changes" />
              )}
            </span>
          </>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm text-[#8b8fa8] truncate max-w-[240px]">{diagramName}</span>
            {isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" title="Unsaved changes" />
            )}
          </div>
        )}
      </div>

      {/* Mode switcher — centred */}
      <div className="flex items-center gap-1 bg-[#1a1c2e] border border-[#2d3150] rounded-lg p-0.5">
        {MODES.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-[#5a5d75] hover:text-[#e2e4f0] hover:bg-[#22253a]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-3">
        <button
          onClick={handleSave}
          disabled={!isDirty || !diagramId}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
            bg-indigo-600 text-white hover:bg-indigo-500 transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
      </div>
    </header>
  )
}
