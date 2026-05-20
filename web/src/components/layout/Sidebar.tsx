import { useEffect, useState } from 'react'
import {
  Plus, ChevronRight, ChevronDown,
  FolderOpen, LayoutDashboard,
} from 'lucide-react'
import { useUIStore } from '../../stores/ui'
import { useDiagramStore } from '../../stores/diagram'
import { api } from '../../lib/api'
import { TECH_REGISTRY, CATEGORIES } from '../../lib/techRegistry'
import type { NodeCategory } from '../../types/diagram'

// ── Node palette ─────────────────────────────────────────────────────

function PaletteItem({ technology, label, Icon, colors }: (typeof TECH_REGISTRY)[0]) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/reactflow/tech', technology)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md border ${colors.border}
        cursor-grab active:cursor-grabbing hover:brightness-110 transition-all select-none
        bg-[#1a1c2e]/60`}
    >
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
      <Icon className={`w-3 h-3 shrink-0 ${colors.icon}`} />
      <span className="text-[11px] text-[#c8cadb] font-medium truncate">{label}</span>
    </div>
  )
}

function CategorySection({ id, label }: { id: NodeCategory; label: string }) {
  const [open, setOpen] = useState(true)
  const items = TECH_REGISTRY.filter((t) => t.category === id)

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 py-1 text-[10px] font-semibold
          uppercase tracking-widest text-[#5a5d75] hover:text-[#8b8fa8] transition-colors"
      >
        {open
          ? <ChevronDown className="w-2.5 h-2.5" />
          : <ChevronRight className="w-2.5 h-2.5" />}
        {label}
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 mb-2">
          {items.map((item) => <PaletteItem key={item.technology} {...item} />)}
        </div>
      )}
    </div>
  )
}

// ── Project tree ──────────────────────────────────────────────────────

function ProjectTree() {
  const {
    projects, activeDiagrams, loadingProjects,
    setProjects, setActiveProject, setActiveDiagrams, setLoadingProjects,
  } = useUIStore()
  const { loadDiagram } = useDiagramStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    setLoadingProjects(true)
    api.projects.list()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoadingProjects(false))
  }, [])

  async function createProject() {
    if (!newName.trim()) return
    const p = await api.projects.create({ name: newName.trim() })
    setProjects([p, ...projects])
    setNewName('')
    setCreating(false)
  }

  async function toggleProject(id: string) {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    setActiveProject(id)
    const diagrams = await api.projects.diagrams(id).catch(() => [])
    setActiveDiagrams(diagrams)
  }

  async function openDiagram(id: string, projectId: string, name: string) {
    try {
      const d = await api.diagrams.get(id)
      loadDiagram({
        id,
        projectId,
        name,
        nodes: JSON.parse(d.nodesJson || '[]'),
        edges: JSON.parse(d.edgesJson || '[]'),
      })
    } catch (e) {
      console.error('Failed to load diagram', e)
    }
  }

  async function createDiagram(projectId: string) {
    const name = prompt('Diagram name:')
    if (!name) return
    const d = await api.diagrams.create({ projectId, name })
    setActiveDiagrams([d, ...activeDiagrams])
    openDiagram(d.id, projectId, d.name)
  }

  return (
    <div className="flex flex-col gap-0.5">
      {loadingProjects && (
        <p className="text-[11px] text-[#5a5d75] px-1 py-2">Loading…</p>
      )}

      {projects.map((p) => (
        <div key={p.id}>
          <button
            onClick={() => toggleProject(p.id)}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs
              text-[#8b8fa8] hover:text-[#e2e4f0] hover:bg-[#22253a] transition-colors"
          >
            {expanded === p.id
              ? <ChevronDown className="w-3 h-3 shrink-0" />
              : <ChevronRight className="w-3 h-3 shrink-0" />}
            <FolderOpen className="w-3.5 h-3.5 shrink-0 text-[#5a5d75]" />
            <span className="truncate">{p.name}</span>
          </button>

          {expanded === p.id && (
            <div className="ml-5 flex flex-col gap-0.5 mt-0.5">
              {activeDiagrams.map((d) => (
                <button
                  key={d.id}
                  onClick={() => openDiagram(d.id, p.id, d.name)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs
                    text-[#5a5d75] hover:text-[#e2e4f0] hover:bg-[#22253a] transition-colors"
                >
                  <LayoutDashboard className="w-3 h-3 shrink-0" />
                  <span className="truncate">{d.name}</span>
                </button>
              ))}
              <button
                onClick={() => createDiagram(p.id)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs
                  text-[#5a5d75] hover:text-indigo-400 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New diagram
              </button>
            </div>
          )}
        </div>
      ))}

      {creating ? (
        <div className="flex items-center gap-1 px-1 mt-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') createProject()
              if (e.key === 'Escape') setCreating(false)
            }}
            placeholder="Project name…"
            className="flex-1 bg-[#22253a] border border-[#2d3150] rounded px-2 py-1
              text-xs text-[#e2e4f0] placeholder-[#5a5d75] focus:outline-none focus:border-indigo-500/60"
          />
          <button onClick={createProject} className="text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 mt-1 rounded-md text-xs
            text-[#5a5d75] hover:text-indigo-400 hover:bg-[#22253a] transition-colors"
        >
          <Plus className="w-3 h-3" />
          New project
        </button>
      )}
    </div>
  )
}

// ── Sidebar root ──────────────────────────────────────────────────────

export function Sidebar() {
  const { sidebarOpen } = useUIStore()
  if (!sidebarOpen) return null

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-[#2d3150] bg-[#12141f] overflow-hidden">
      {/* Component palette */}
      <section className="flex-1 overflow-y-auto p-3 border-b border-[#2d3150]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">
          Components
        </p>
        {CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} id={cat.id} label={cat.label} />
        ))}
        <p className="text-[10px] text-[#5a5d75] mt-1">Drag onto canvas</p>
      </section>

      {/* Projects */}
      <section className="flex-1 overflow-y-auto p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">
          Projects
        </p>
        <ProjectTree />
      </section>
    </aside>
  )
}
