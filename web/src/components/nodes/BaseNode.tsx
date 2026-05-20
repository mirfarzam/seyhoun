import { Handle, Position, type NodeProps } from '@xyflow/react'
import { X, Maximize2 } from 'lucide-react'
import type { ArchNode } from '../../types/diagram'
import { getTech } from '../../lib/techRegistry'
import { useDiagramStore } from '../../stores/diagram'
import { useUIStore } from '../../stores/ui'

interface BaseNodeProps extends NodeProps<ArchNode> {
  onDrillIn?: (nodeId: string) => void
}

export function BaseNode({ data, selected, id }: BaseNodeProps) {
  const { deleteNode } = useDiagramStore()
  const { clearSelection, setDrillTarget } = useUIStore()
  const tech = getTech(data.technology)
  const { colors, Icon, label: techLabel } = tech

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    deleteNode(id)
    clearSelection()
  }

  function handleDrillIn(e: React.MouseEvent) {
    e.stopPropagation()
    setDrillTarget(id)
  }

  return (
    <>
      {/* All 4 positions — both source and target so connections work in any direction */}
      <Handle type="target" position={Position.Top}    id="top-t"    className="arch-handle" />
      <Handle type="source" position={Position.Top}    id="top-s"    className="arch-handle" />
      <Handle type="target" position={Position.Left}   id="left-t"   className="arch-handle" />
      <Handle type="source" position={Position.Left}   id="left-s"   className="arch-handle" />

      {/* Delete button — top-right, only when selected */}
      {selected && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full
            bg-[#1a1c2e] border border-red-500/40 text-red-400
            hover:bg-red-500/20 hover:border-red-400 flex items-center justify-center
            transition-colors"
          title="Delete node"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}

      {/* Drill-in button — top-left, only when selected */}
      {selected && (
        <button
          onClick={handleDrillIn}
          className={`absolute -top-2 -left-2 z-10 w-5 h-5 rounded-full
            bg-[#1a1c2e] flex items-center justify-center transition-colors
            ${data.childDiagramId
              ? 'border border-indigo-500/60 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400'
              : 'border border-[#2d3150] text-[#5a5d75] hover:border-indigo-500/40 hover:text-indigo-400'
            }`}
          title={data.childDiagramId ? 'Open sub-diagram' : 'Create sub-diagram'}
        >
          <Maximize2 className="w-2.5 h-2.5" />
        </button>
      )}

      {/* Node card */}
      <div
        className={`
          relative min-w-[152px] max-w-[224px] rounded-xl border bg-[#1a1c2e]
          px-3 pt-2.5 pb-2 select-none transition-all duration-150
          ${colors.border}
          ${selected ? `ring-1 ${colors.ring} shadow-lg shadow-black/40` : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#22253a] shrink-0">
            <Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#e2e4f0] truncate leading-tight">
              {data.label}
            </p>
            {data.host && (
              <p className="text-[10px] text-[#5a5d75] truncate leading-tight mt-0.5 font-mono">
                {data.host}{data.port ? `:${data.port}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p className="mt-1.5 text-[10px] text-[#8b8fa8] line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}

        {/* Databases summary (datastore) */}
        {data.category === 'datastore' && data.databases && data.databases.length > 0 && (
          <p className="mt-1.5 text-[10px] text-[#5a5d75]">
            {data.databases.length} db{data.databases.length > 1 ? 's' : ''}
            {data.databases.flatMap((d) => [
              ...(d.schemas?.flatMap((s) => s.tables) ?? []),
              ...d.tables,
            ]).length > 0
              ? ` · ${data.databases.flatMap((d) => [
                  ...(d.schemas?.flatMap((s) => s.tables) ?? []),
                  ...d.tables,
                ]).length} tables`
              : ''}
          </p>
        )}

        {/* Topics summary (broker) */}
        {data.category === 'broker' && (
          <>
            {data.topics && data.topics.length > 0 && (
              <p className="mt-1.5 text-[10px] text-[#5a5d75]">
                {data.topics.length} topic{data.topics.length > 1 ? 's' : ''}
              </p>
            )}
            {data.queues && data.queues.length > 0 && (
              <p className="mt-1.5 text-[10px] text-[#5a5d75]">
                {data.queues.length} queue{data.queues.length > 1 ? 's' : ''}
              </p>
            )}
          </>
        )}

        {/* Footer: tech badge + sub-diagram indicator + health */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${colors.tag}`}>
            {techLabel}
          </span>
          {data.childDiagramId && (
            <span className="text-[9px] text-indigo-400/70 ml-auto">sub-arch</span>
          )}
          {data.health && (
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ml-auto ${
              data.health === 'healthy' ? 'bg-emerald-400' :
              data.health === 'warning'  ? 'bg-amber-400'   : 'bg-red-400'
            }`} />
          )}
          {data.metricsEndpoint && (
            <span className="text-[9px] text-[#5a5d75] ml-auto">metrics</span>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Bottom} id="bottom-t"  className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom-s"  className="arch-handle" />
      <Handle type="target" position={Position.Right}  id="right-t"   className="arch-handle" />
      <Handle type="source" position={Position.Right}  id="right-s"   className="arch-handle" />
    </>
  )
}
