import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import type { ArchNode, ArchEdge, NodeData, EdgeData, BreadcrumbItem } from '../types/diagram'

interface DiagramStore {
  nodes: ArchNode[]
  edges: ArchEdge[]
  diagramId: string | null
  projectId: string | null
  diagramName: string
  isDirty: boolean

  // Breadcrumb for drill-down sub-diagrams
  breadcrumb: BreadcrumbItem[]

  setNodes: (nodes: ArchNode[]) => void
  setEdges: (edges: ArchEdge[]) => void
  onNodesChange: (changes: NodeChange<ArchNode>[]) => void
  onEdgesChange: (changes: EdgeChange<ArchEdge>[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: ArchNode) => void
  updateNodeData: (id: string, data: Partial<NodeData>) => void
  deleteNode: (id: string) => void
  updateEdge: (id: string, patch: { label?: string; data?: Partial<EdgeData> }) => void
  deleteEdge: (id: string) => void
  loadDiagram: (opts: {
    id: string
    projectId: string
    name: string
    nodes: ArchNode[]
    edges: ArchEdge[]
  }) => void
  markSaved: () => void
  reset: () => void

  // Breadcrumb navigation
  pushBreadcrumb: (item: BreadcrumbItem) => void
  popToIndex: (index: number) => void
  clearBreadcrumb: () => void
}

const EDGE_DEFAULTS = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 14,
    height: 14,
    color: '#4a4f6a',
  },
  style: { stroke: '#4a4f6a', strokeWidth: 1.5 },
  data: { protocol: '' } as EdgeData,
}

export const useDiagramStore = create<DiagramStore>((set) => ({
  nodes: [],
  edges: [],
  diagramId: null,
  projectId: null,
  diagramName: 'Untitled Diagram',
  isDirty: false,
  breadcrumb: [],

  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes), isDirty: true })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges), isDirty: true })),

  onConnect: (connection) =>
    set((s) => ({
      edges: addEdge({ ...EDGE_DEFAULTS, ...connection }, s.edges),
      isDirty: true,
    })),

  addNode: (node) =>
    set((s) => ({ nodes: [...s.nodes, node], isDirty: true })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
      isDirty: true,
    })),

  deleteNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      isDirty: true,
    })),

  updateEdge: (id, patch) =>
    set((s) => ({
      edges: s.edges.map((e) =>
        e.id === id
          ? { ...e, label: patch.label ?? e.label, data: { ...e.data, ...patch.data } }
          : e
      ),
      isDirty: true,
    })),

  deleteEdge: (id) =>
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      isDirty: true,
    })),

  loadDiagram: ({ id, projectId, name, nodes, edges }) =>
    set({ diagramId: id, projectId, diagramName: name, nodes, edges, isDirty: false }),

  markSaved: () => set({ isDirty: false }),

  reset: () =>
    set({
      nodes: [], edges: [], diagramId: null, projectId: null,
      diagramName: 'Untitled Diagram', isDirty: false, breadcrumb: [],
    }),

  // Push current diagram onto breadcrumb, caller then loads child diagram
  pushBreadcrumb: (item) =>
    set((s) => ({ breadcrumb: [...s.breadcrumb, item] })),

  // Pop back to a specific ancestor (index = position in breadcrumb to restore)
  popToIndex: (index) =>
    set((s) => ({ breadcrumb: s.breadcrumb.slice(0, index) })),

  clearBreadcrumb: () => set({ breadcrumb: [] }),
}))
