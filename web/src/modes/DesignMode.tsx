import { useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { ArchCanvas } from '../components/canvas/ArchCanvas'
import { NodeInspector } from '../components/panels/NodeInspector'
import { EdgeInspector } from '../components/panels/EdgeInspector'
import { useUIStore } from '../stores/ui'
import { useDiagramStore } from '../stores/diagram'
import { api } from '../lib/api'

export function DesignMode() {
  const { inspector, drillTarget, setDrillTarget } = useUIStore()
  const {
    diagramId, diagramName, projectId,
    nodes, edges,
    isDirty, markSaved,
    updateNodeData, loadDiagram,
    pushBreadcrumb,
  } = useDiagramStore()

  // Handle drill-in when user clicks the Maximize2 button on a node
  useEffect(() => {
    if (!drillTarget) return

    async function drillIn() {
      const node = nodes.find((n) => n.id === drillTarget)
      if (!node || !projectId) { setDrillTarget(null); return }

      // Auto-save current diagram before navigating
      if (diagramId && isDirty) {
        try {
          await api.diagrams.update(diagramId, {
            name: diagramName,
            nodesJson: JSON.stringify(nodes),
            edgesJson: JSON.stringify(edges),
          })
          markSaved()
        } catch (e) {
          console.error('Auto-save before drill-in failed', e)
        }
      }

      let childId = node.data.childDiagramId as string | undefined

      if (!childId) {
        // Create a new sub-diagram for this node
        try {
          const childDiagram = await api.diagrams.create({
            projectId,
            name: `${node.data.label} — Sub-Architecture`,
          })
          childId = childDiagram.id
          // Link the node to the new diagram
          updateNodeData(drillTarget!, { childDiagramId: childId })
          // Persist that link immediately
          const updatedNodes = nodes.map((n) =>
            n.id === drillTarget ? { ...n, data: { ...n.data, childDiagramId: childId } } : n
          )
          if (diagramId) {
            await api.diagrams.update(diagramId, {
              nodesJson: JSON.stringify(updatedNodes),
              edgesJson: JSON.stringify(edges),
            }).catch(console.error)
          }
        } catch (e) {
          console.error('Failed to create sub-diagram', e)
          setDrillTarget(null)
          return
        }
      }

      // Push current context onto breadcrumb
      pushBreadcrumb({
        diagramId: diagramId!,
        diagramName: diagramName,
        fromNodeId: drillTarget!,
      })

      // Load the child diagram
      try {
        const child = await api.diagrams.get(childId)
        loadDiagram({
          id: child.id,
          projectId: child.projectId,
          name: child.name,
          nodes: JSON.parse(child.nodesJson || '[]'),
          edges: JSON.parse(child.edgesJson || '[]'),
        })
      } catch (e) {
        console.error('Failed to load sub-diagram', e)
      }

      setDrillTarget(null)
    }

    drillIn()
  }, [drillTarget]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ReactFlowProvider>
      <div className="flex flex-1 overflow-hidden">
        <ArchCanvas />
        {inspector?.kind === 'node' && <NodeInspector />}
        {inspector?.kind === 'edge' && <EdgeInspector />}
      </div>
    </ReactFlowProvider>
  )
}
