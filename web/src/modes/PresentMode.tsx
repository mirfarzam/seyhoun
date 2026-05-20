import { ReactFlowProvider } from '@xyflow/react'
import { Eye } from 'lucide-react'
import { ViewCanvas } from '../components/canvas/ViewCanvas'
import { useDiagramStore } from '../stores/diagram'
import { TECH_REGISTRY } from '../lib/techRegistry'

function Legend() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {TECH_REGISTRY.map(({ technology, label, Icon, colors }) => (
        <div key={technology} className="flex items-center gap-1.5">
          <Icon className={`w-3 h-3 ${colors.icon}`} />
          <span className="text-[10px] text-[#5a5d75]">{label}</span>
        </div>
      ))}
    </div>
  )
}

export function PresentMode() {
  const { diagramName, nodes, edges } = useDiagramStore()
  const isEmpty = nodes.length === 0

  return (
    <ReactFlowProvider>
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <div className="h-9 shrink-0 flex items-center gap-3 px-4 border-b border-[#2d3150] bg-[#12141f]">
          <Eye className="w-3.5 h-3.5 text-[#5a5d75]" />
          <span className="text-xs font-medium text-[#e2e4f0]">{diagramName}</span>
          <div className="w-px h-4 bg-[#2d3150]" />
          <span className="text-[10px] text-[#5a5d75]">
            {nodes.length} components · {edges.length} connections
          </span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-[#1a1c2e] border border-[#2d3150] text-[#5a5d75]">
            Read-only
          </span>
        </div>

        {/* Canvas */}
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-2">
            <Eye className="w-8 h-8 text-[#2d3150]" />
            <p className="text-sm text-[#5a5d75]">No diagram loaded</p>
            <p className="text-xs text-[#5a5d75]">Open a diagram in Design mode first</p>
          </div>
        ) : (
          <ViewCanvas />
        )}

        {/* Legend footer */}
        {!isEmpty && (
          <div className="h-9 shrink-0 flex items-center px-4 border-t border-[#2d3150] bg-[#12141f] overflow-x-auto">
            <Legend />
          </div>
        )}
      </div>
    </ReactFlowProvider>
  )
}
