import { useEffect, useState } from 'react'
import { X, Trash2, Plus, ChevronDown, ChevronRight, Maximize2 } from 'lucide-react'
import { useUIStore } from '../../stores/ui'
import { useDiagramStore } from '../../stores/diagram'
import { getTech } from '../../lib/techRegistry'
import type { NodeData, DatabaseEntry, SchemaEntry } from '../../types/diagram'

// ── Shared input style ────────────────────────────────────────────────
const inputCls =
  'w-full bg-[#1a1c2e] border border-[#2d3150] rounded-md px-2.5 py-1.5 text-xs ' +
  'text-[#e2e4f0] placeholder-[#5a5d75] focus:outline-none focus:border-indigo-500/60 transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Schema editor (inside a database) ────────────────────────────────

function SchemasEditor({
  schemas,
  onChange,
}: {
  schemas: SchemaEntry[]
  onChange: (s: SchemaEntry[]) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  function addSchema() {
    const s: SchemaEntry = { id: crypto.randomUUID(), name: '', tables: [] }
    onChange([...schemas, s])
    setExpanded(s.id)
  }

  function removeSchema(id: string) {
    onChange(schemas.filter((s) => s.id !== id))
  }

  function updateName(id: string, name: string) {
    onChange(schemas.map((s) => (s.id === id ? { ...s, name } : s)))
  }

  function updateTables(id: string, raw: string) {
    const tables = raw.split(',').map((t) => t.trim()).filter(Boolean)
    onChange(schemas.map((s) => (s.id === id ? { ...s, tables } : s)))
  }

  return (
    <div className="flex flex-col gap-1 ml-2 mt-1">
      {schemas.map((schema) => (
        <div key={schema.id} className="rounded border border-[#2d3150]/60 overflow-hidden">
          <div className="flex items-center gap-1 px-2 py-1 bg-[#12141f]">
            <button
              onClick={() => setExpanded(expanded === schema.id ? null : schema.id)}
              className="text-[#5a5d75] hover:text-[#8b8fa8] transition-colors"
            >
              {expanded === schema.id
                ? <ChevronDown className="w-2.5 h-2.5" />
                : <ChevronRight className="w-2.5 h-2.5" />}
            </button>
            <input
              value={schema.name}
              onChange={(e) => updateName(schema.id, e.target.value)}
              placeholder="schema_name"
              className="flex-1 bg-transparent text-[10px] text-[#c8cadb] placeholder-[#5a5d75]
                focus:outline-none font-mono"
            />
            <span className="text-[9px] text-[#5a5d75] mr-1">schema</span>
            <button
              onClick={() => removeSchema(schema.id)}
              className="text-[#5a5d75] hover:text-red-400 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>

          {expanded === schema.id && (
            <div className="px-2 py-1.5 border-t border-[#2d3150]/60 bg-[#0d0f1a]">
              <label className="block text-[9px] uppercase tracking-widest text-[#5a5d75] mb-1">
                Tables (comma-separated)
              </label>
              <input
                value={schema.tables.join(', ')}
                onChange={(e) => updateTables(schema.id, e.target.value)}
                placeholder="users, orders, sessions"
                className={`${inputCls} font-mono text-[10px]`}
              />
              {schema.tables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {schema.tables.map((t) => (
                    <span key={t}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-[#22253a] border border-[#2d3150] text-[#8b8fa8] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addSchema}
        className="flex items-center gap-1 text-[10px] text-[#5a5d75] hover:text-indigo-400
          transition-colors py-0.5"
      >
        <Plus className="w-2.5 h-2.5" />
        Add schema
      </button>
    </div>
  )
}

// ── Database list editor ──────────────────────────────────────────────

function DatabasesEditor({
  databases,
  onChange,
}: {
  databases: DatabaseEntry[]
  onChange: (dbs: DatabaseEntry[]) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [schemaMode, setSchemaMode] = useState<Record<string, boolean>>({})

  function addDb() {
    const entry: DatabaseEntry = { id: crypto.randomUUID(), name: '', schemas: [], tables: [] }
    onChange([...databases, entry])
    setExpanded(entry.id)
  }

  function removeDb(id: string) {
    onChange(databases.filter((d) => d.id !== id))
  }

  function updateName(id: string, name: string) {
    onChange(databases.map((d) => (d.id === id ? { ...d, name } : d)))
  }

  function updateTables(id: string, raw: string) {
    const tables = raw.split(',').map((t) => t.trim()).filter(Boolean)
    onChange(databases.map((d) => (d.id === id ? { ...d, tables } : d)))
  }

  function updateSchemas(id: string, schemas: SchemaEntry[]) {
    onChange(databases.map((d) => (d.id === id ? { ...d, schemas } : d)))
  }

  function toggleSchemaMode(id: string) {
    setSchemaMode((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-1">
      {databases.map((db) => (
        <div key={db.id} className="rounded-md border border-[#2d3150] overflow-hidden">
          <div className="flex items-center gap-1 px-2 py-1.5 bg-[#1a1c2e]">
            <button
              onClick={() => setExpanded(expanded === db.id ? null : db.id)}
              className="text-[#5a5d75] hover:text-[#8b8fa8] transition-colors"
            >
              {expanded === db.id
                ? <ChevronDown className="w-3 h-3" />
                : <ChevronRight className="w-3 h-3" />}
            </button>
            <input
              value={db.name}
              onChange={(e) => updateName(db.id, e.target.value)}
              placeholder="database_name"
              className="flex-1 bg-transparent text-xs text-[#e2e4f0] placeholder-[#5a5d75]
                focus:outline-none font-mono"
            />
            <button
              onClick={() => removeDb(db.id)}
              className="text-[#5a5d75] hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {expanded === db.id && (
            <div className="px-2 py-1.5 border-t border-[#2d3150] bg-[#12141f]">
              {/* Toggle: flat tables vs schemas */}
              <div className="flex items-center gap-2 mb-1.5">
                <button
                  onClick={() => toggleSchemaMode(db.id)}
                  className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${
                    schemaMode[db.id]
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-[#1a1c2e] border-[#2d3150] text-[#5a5d75] hover:border-indigo-500/30 hover:text-indigo-400'
                  }`}
                >
                  {schemaMode[db.id] ? 'Schemas mode' : 'Simple tables'}
                </button>
              </div>

              {schemaMode[db.id] ? (
                <SchemasEditor
                  schemas={db.schemas ?? []}
                  onChange={(s) => updateSchemas(db.id, s)}
                />
              ) : (
                <>
                  <label className="block text-[9px] uppercase tracking-widest text-[#5a5d75] mb-1">
                    Tables (comma-separated)
                  </label>
                  <input
                    value={db.tables.join(', ')}
                    onChange={(e) => updateTables(db.id, e.target.value)}
                    placeholder="users, orders, sessions"
                    className={`${inputCls} font-mono`}
                  />
                  {db.tables.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {db.tables.map((t) => (
                        <span key={t}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-[#22253a] border border-[#2d3150] text-[#8b8fa8] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addDb}
        className="flex items-center gap-1 text-[11px] text-[#5a5d75] hover:text-indigo-400
          transition-colors py-0.5"
      >
        <Plus className="w-3 h-3" />
        Add database
      </button>
    </div>
  )
}

// ── Topics list editor (broker) ───────────────────────────────────────

function StringListEditor({
  values,
  onChange,
  placeholder,
  tagClass,
}: {
  values: string[]
  onChange: (v: string[]) => void
  placeholder: string
  tagClass: string
}) {
  const [input, setInput] = useState(values.join(', '))

  function commit() {
    onChange(input.split(',').map((t) => t.trim()).filter(Boolean))
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={commit}
        rows={2}
        placeholder={placeholder}
        className={`${inputCls} resize-none font-mono`}
      />
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {values.map((t) => (
            <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${tagClass}`}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Inspector root ────────────────────────────────────────────────────

export function NodeInspector() {
  const { inspector, clearSelection, setDrillTarget } = useUIStore()
  const { nodes, updateNodeData, deleteNode } = useDiagramStore()

  const nodeId = inspector?.kind === 'node' ? inspector.id : null
  const node = nodes.find((n) => n.id === nodeId)

  const [form, setForm] = useState<Partial<NodeData>>({})

  useEffect(() => {
    if (node) {
      setForm({
        label:           node.data.label,
        description:     node.data.description ?? '',
        host:            node.data.host ?? '',
        port:            node.data.port ?? '',
        metricsEndpoint: node.data.metricsEndpoint ?? '',
        apiVersion:      node.data.apiVersion ?? '',
        apiDocsUrl:      node.data.apiDocsUrl ?? '',
        databases:       node.data.databases ?? [],
        topics:          node.data.topics ?? [],
        queues:          node.data.queues ?? [],
      })
    }
  }, [node?.id])

  if (!node) return null

  const tech = getTech(node.data.technology)
  const { colors } = tech

  function patch<K extends keyof NodeData>(key: K, value: NodeData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    updateNodeData(node!.id, { [key]: value })
  }

  function blurPatch(key: keyof NodeData) {
    updateNodeData(node!.id, { [key]: form[key] })
  }

  function handleDelete() {
    deleteNode(node!.id)
    clearSelection()
  }

  const isDatastore = node.data.category === 'datastore' || node.data.category === 'analytics'
  const isBroker    = node.data.category === 'broker'
  const isService   = node.data.category === 'service'
  // RabbitMQ / ActiveMQ use queues; Kafka / others use topics
  const usesQueues  = node.data.technology === 'rabbitmq' || node.data.technology === 'activemq'
  const usesTopics  = isBroker && !usesQueues

  return (
    <aside className="w-64 shrink-0 flex flex-col border-l border-[#2d3150] bg-[#12141f]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#2d3150]">
        <div className={`p-1 rounded bg-[#1a1c2e]`}>
          <tech.Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${colors.tag}`}>
          {tech.label}
        </span>
        <div className="flex-1" />
        <button onClick={() => clearSelection()} className="text-[#5a5d75] hover:text-[#8b8fa8] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable fields */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Identity */}
        <Field label="Label">
          <input className={inputCls} value={form.label ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            onBlur={() => blurPatch('label')} />
        </Field>

        <Field label="Description">
          <textarea className={`${inputCls} resize-none`} rows={2}
            placeholder="What does this component do?"
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            onBlur={() => blurPatch('description')} />
        </Field>

        {/* Connection */}
        <div className="pt-1 border-t border-[#2d3150]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">Connection</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[9px] text-[#5a5d75] mb-1">Host / IP</label>
              <input className={inputCls} placeholder="127.0.0.1"
                value={form.host ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
                onBlur={() => blurPatch('host')} />
            </div>
            <div className="w-16">
              <label className="block text-[9px] text-[#5a5d75] mb-1">Port</label>
              <input className={inputCls} placeholder={tech.defaultPort ?? '—'}
                value={form.port ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))}
                onBlur={() => blurPatch('port')} />
            </div>
          </div>
        </div>

        {/* Datastore: Databases → Schemas → Tables */}
        {isDatastore && (
          <div className="pt-1 border-t border-[#2d3150]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">Databases</p>
            <DatabasesEditor
              databases={(form.databases as DatabaseEntry[]) ?? []}
              onChange={(dbs) => patch('databases', dbs)}
            />
          </div>
        )}

        {/* Broker: Topics */}
        {usesTopics && (
          <div className="pt-1 border-t border-[#2d3150]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">Topics</p>
            <StringListEditor
              values={(form.topics as string[]) ?? []}
              onChange={(t) => patch('topics', t)}
              placeholder="topic-a, topic-b, topic-c"
              tagClass="bg-amber-500/10 border-amber-500/30 text-amber-300"
            />
          </div>
        )}

        {/* Broker: Queues (RabbitMQ / ActiveMQ) */}
        {usesQueues && (
          <div className="pt-1 border-t border-[#2d3150]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">Queues</p>
            <StringListEditor
              values={(form.queues as string[]) ?? []}
              onChange={(q) => patch('queues', q)}
              placeholder="order-queue, notify-queue"
              tagClass="bg-orange-500/10 border-orange-500/30 text-orange-300"
            />
          </div>
        )}

        {/* Service: API fields */}
        {isService && (
          <div className="pt-1 border-t border-[#2d3150]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">API</p>
            <div className="space-y-2">
              <Field label="Version">
                <input className={inputCls} placeholder="v1.0.0"
                  value={form.apiVersion ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, apiVersion: e.target.value }))}
                  onBlur={() => blurPatch('apiVersion')} />
              </Field>
              <Field label="Docs URL">
                <input className={inputCls} placeholder="https://…/swagger"
                  value={form.apiDocsUrl ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, apiDocsUrl: e.target.value }))}
                  onBlur={() => blurPatch('apiDocsUrl')} />
              </Field>
            </div>
          </div>
        )}

        {/* Monitoring */}
        <div className="pt-1 border-t border-[#2d3150]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">Monitoring</p>
          <Field label="Metrics Endpoint">
            <input className={inputCls} placeholder="http://host:port/metrics"
              value={form.metricsEndpoint ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, metricsEndpoint: e.target.value }))}
              onBlur={() => blurPatch('metricsEndpoint')} />
          </Field>
        </div>

        {/* Sub-Architecture */}
        <div className="pt-1 border-t border-[#2d3150]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5d75] mb-2">
            Sub-Architecture
          </p>
          {node.data.childDiagramId ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] text-[#8b8fa8]">
                This component has an underlying architecture diagram.
              </p>
              <button
                onClick={() => setDrillTarget(node.id)}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs
                  font-medium text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/10 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Open sub-diagram
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] text-[#5a5d75]">
                No sub-diagram yet. Click to create one.
              </p>
              <button
                onClick={() => setDrillTarget(node.id)}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs
                  font-medium text-[#5a5d75] border border-[#2d3150] hover:border-indigo-500/40
                  hover:text-indigo-400 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Create sub-diagram
              </button>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="pt-1 border-t border-[#2d3150]">
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-md text-xs
              font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete component
          </button>
        </div>
      </div>
    </aside>
  )
}
