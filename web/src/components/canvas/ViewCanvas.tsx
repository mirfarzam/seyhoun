import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useDiagramStore } from '../../stores/diagram'
import { BaseNode } from '../nodes/BaseNode'
import { TECH_MAP } from '../../lib/techRegistry'

const NODE_TYPES: NodeTypes = Object.fromEntries(
  Array.from(TECH_MAP.keys()).map((tech) => [tech, BaseNode])
)

const EDGE_BASE = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: '#4a4f6a' },
  style: { stroke: '#4a4f6a', strokeWidth: 1.5 },
}

interface ViewCanvasProps {
  /** Animate all edges — used by monitor mode to show data flow */
  animateEdges?: boolean
  onNodeClick?: (nodeId: string) => void
}

export function ViewCanvas({ animateEdges = false, onNodeClick }: ViewCanvasProps) {
  const { nodes, edges } = useDiagramStore()

  const viewEdges = useMemo(
    () => edges.map((e) => ({ ...e, animated: animateEdges })),
    [edges, animateEdges]
  )

  return (
    // arch-readonly disables handle visibility via CSS
    <div className="flex-1 h-full arch-readonly">
      <ReactFlow
        nodes={nodes}
        edges={viewEdges}
        nodeTypes={NODE_TYPES}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.15}
        maxZoom={2.5}
        defaultEdgeOptions={EDGE_BASE}
        onNodeClick={onNodeClick ? (_, n) => onNodeClick(n.id) : undefined}
        className="bg-[#0d0f1a]"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#2d3150" />
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
