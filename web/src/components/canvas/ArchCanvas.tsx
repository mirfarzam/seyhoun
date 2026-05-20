import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  MarkerType,
  type NodeTypes,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useDiagramStore } from '../../stores/diagram'
import { useUIStore } from '../../stores/ui'
import { getTech, TECH_MAP } from '../../lib/techRegistry'
import type { ArchNode, NodeTechnology } from '../../types/diagram'
import { BaseNode } from '../nodes/BaseNode'

// One component handles all technology variants — appearance is data-driven via techRegistry
const NODE_TYPES: NodeTypes = Object.fromEntries(
  Array.from(TECH_MAP.keys()).map((tech) => [tech, BaseNode])
)

const EDGE_DEFAULTS = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: '#4a4f6a' },
  style: { stroke: '#4a4f6a', strokeWidth: 1.5 },
}

export function ArchCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useDiagramStore()
  const { selectNode, selectEdge, clearSelection } = useUIStore()
  const { screenToFlowPosition } = useReactFlow()
  const wrapper = useRef<HTMLDivElement>(null)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const tech = e.dataTransfer.getData('application/reactflow/tech') as NodeTechnology
      if (!tech) return

      const def = getTech(tech)
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })

      const node: ArchNode = {
        id: crypto.randomUUID(),
        type: tech,
        position,
        data: {
          label:    def.label,
          technology: tech,
          category: def.category,
          port:     def.defaultPort ?? '',
        },
      }
      addNode(node)
      selectNode(node.id)
    },
    [screenToFlowPosition, addNode, selectNode]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      selectEdge(edge.id)
    },
    [selectEdge]
  )

  const onPaneClick = useCallback(() => clearSelection(), [clearSelection])

  return (
    <div ref={wrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        defaultEdgeOptions={EDGE_DEFAULTS}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.15}
        maxZoom={2.5}
        className="bg-[#0d0f1a]"
        deleteKeyCode={['Backspace', 'Delete']}
        edgesReconnectable
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#2d3150"
        />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          nodeColor="#2d3150"
          maskColor="rgba(13,15,26,0.75)"
          style={{ width: 140, height: 90 }}
        />
      </ReactFlow>
    </div>
  )
}
