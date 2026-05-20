import { Node, Edge } from '@xyflow/react'

// ── Node taxonomy ────────────────────────────────────────────────────

export type NodeCategory =
  | 'datastore'
  | 'broker'
  | 'service'
  | 'infrastructure'
  | 'external'
  | 'bigdata'
  | 'analytics'
  | 'storage'
  | 'monitoring'
  | 'cicd'
  | 'ml'

export type NodeTechnology =
  // Datastores
  | 'postgresql' | 'mysql' | 'mongodb' | 'redis'
  | 'elasticsearch' | 'sqlite' | 'cassandra'
  | 'dynamodb' | 'couchdb' | 'neo4j' | 'influxdb'
  | 'memcached' | 'hazelcast' | 'cockroachdb' | 'scylladb'
  // Brokers
  | 'kafka' | 'rabbitmq' | 'nats' | 'pulsar'
  | 'activemq' | 'sqs' | 'pubsub' | 'kinesis'
  // Services
  | 'rest-api' | 'grpc' | 'graphql' | 'worker' | 'microservice'
  // Infrastructure
  | 'api-gateway' | 'load-balancer' | 'nginx' | 'cdn'
  | 'kubernetes' | 'docker' | 'consul' | 'vault' | 'istio' | 'envoy'
  // External
  | 'external' | 'client'
  // Big Data
  | 'hadoop' | 'spark' | 'flink' | 'hive' | 'trino'
  | 'kafka-streams' | 'airflow' | 'dbt' | 'beam' | 'nifi'
  // Analytics / Warehouse
  | 'snowflake' | 'bigquery' | 'redshift' | 'databricks' | 'clickhouse' | 'druid'
  // Object Storage
  | 's3' | 'gcs' | 'minio' | 'azure-blob'
  // Monitoring / Observability
  | 'prometheus' | 'grafana' | 'jaeger' | 'datadog' | 'opentelemetry' | 'elk' | 'loki' | 'zipkin'
  // CI/CD
  | 'github-actions' | 'jenkins' | 'argocd' | 'gitlab-ci' | 'tekton'
  // ML / AI
  | 'mlflow' | 'feature-store' | 'model-serving' | 'ray' | 'kubeflow'

// ── Layered data structures ──────────────────────────────────────────

export interface SchemaEntry {
  id: string
  name: string      // e.g. "public"
  tables: string[]  // e.g. ["users", "orders"]
}

export interface DatabaseEntry {
  id: string
  name: string       // e.g. "users_db"
  schemas?: SchemaEntry[]
  tables: string[]   // flat tables (no schema) — kept for simple mode
}

// ── Rich node data ───────────────────────────────────────────────────

// Must extend Record<string, unknown> for @xyflow/react v12
export interface NodeData extends Record<string, unknown> {
  label: string
  technology: NodeTechnology
  category: NodeCategory
  description?: string

  // Connection
  host?: string
  port?: string

  // Monitoring
  metricsEndpoint?: string
  health?: 'healthy' | 'warning' | 'error' | null

  // Datastore-specific
  databases?: DatabaseEntry[]

  // Broker-specific
  topics?: string[]
  queues?: string[]   // RabbitMQ / AMQP / ActiveMQ

  // Service-specific
  apiVersion?: string
  apiDocsUrl?: string

  // Drill-down: reference to a child diagram (sub-architecture)
  childDiagramId?: string
}

// ── Edge data ────────────────────────────────────────────────────────

export interface EdgeData extends Record<string, unknown> {
  protocol?: string
  // Sub-resource targeting on the destination node
  targetTopic?: string     // for broker targets
  targetQueue?: string     // for AMQP/RabbitMQ targets
  targetDatabase?: string  // for datastore targets
  targetSchema?: string    // for SQL datastore targets
  targetTable?: string     // for datastore targets
}

export type ArchNode = Node<NodeData>
export type ArchEdge = Edge<EdgeData>

// ── Project / Diagram models ─────────────────────────────────────────

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface DiagramSummary {
  id: string
  projectId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Diagram extends DiagramSummary {
  nodesJson: string
  edgesJson: string
  pumlSource: string
  viewport: string
}

export interface Viewport {
  x: number
  y: number
  zoom: number
}

// ── Breadcrumb ───────────────────────────────────────────────────────

export interface BreadcrumbItem {
  diagramId: string
  diagramName: string
  /** The node that was double-clicked to drill into this level */
  fromNodeId?: string
}
