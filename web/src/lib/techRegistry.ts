import {
  Database, Zap, Search, GitBranch, MessageSquare, Radio,
  Globe, Cpu, Share2, Timer, Package,
  Shield, SlidersHorizontal, Server, Network,
  ExternalLink, Monitor,
  BarChart3, HardDrive, Eye, GitMerge, Brain,
  Cloud, Boxes, Lock, Layers, Activity, Play,
  FlaskConical, Container, Workflow, Sigma,
  type LucideIcon,
} from 'lucide-react'
import type { NodeCategory, NodeTechnology } from '../types/diagram'

export interface TechColors {
  border: string
  ring:   string
  icon:   string
  tag:    string
  dot:    string
}

export interface TechDef {
  technology: NodeTechnology
  category:   NodeCategory
  label:      string
  Icon:       LucideIcon
  colors:     TechColors
  defaultPort?: string
}

const mk = (
  border: string, ring: string, icon: string, tag: string, dot: string
): TechColors => ({ border, ring, icon, tag, dot })

export const TECH_REGISTRY: TechDef[] = [
  // ── Data Stores ───────────────────────────────────────────────────
  {
    technology: 'postgresql', category: 'datastore', label: 'PostgreSQL', Icon: Database,
    defaultPort: '5432',
    colors: mk('border-sky-500/40', 'ring-sky-500/30', 'text-sky-400', 'bg-sky-500/15 text-sky-300', 'bg-sky-500'),
  },
  {
    technology: 'mysql', category: 'datastore', label: 'MySQL', Icon: Database,
    defaultPort: '3306',
    colors: mk('border-orange-500/40', 'ring-orange-500/30', 'text-orange-400', 'bg-orange-500/15 text-orange-300', 'bg-orange-500'),
  },
  {
    technology: 'mongodb', category: 'datastore', label: 'MongoDB', Icon: Database,
    defaultPort: '27017',
    colors: mk('border-green-500/40', 'ring-green-500/30', 'text-green-400', 'bg-green-500/15 text-green-300', 'bg-green-500'),
  },
  {
    technology: 'redis', category: 'datastore', label: 'Redis', Icon: Zap,
    defaultPort: '6379',
    colors: mk('border-red-500/40', 'ring-red-500/30', 'text-red-400', 'bg-red-500/15 text-red-300', 'bg-red-500'),
  },
  {
    technology: 'elasticsearch', category: 'datastore', label: 'Elasticsearch', Icon: Search,
    defaultPort: '9200',
    colors: mk('border-yellow-500/40', 'ring-yellow-500/30', 'text-yellow-400', 'bg-yellow-500/15 text-yellow-300', 'bg-yellow-500'),
  },
  {
    technology: 'cassandra', category: 'datastore', label: 'Cassandra', Icon: Database,
    defaultPort: '9042',
    colors: mk('border-purple-500/40', 'ring-purple-500/30', 'text-purple-400', 'bg-purple-500/15 text-purple-300', 'bg-purple-500'),
  },
  {
    technology: 'sqlite', category: 'datastore', label: 'SQLite', Icon: Database,
    colors: mk('border-slate-500/40', 'ring-slate-500/30', 'text-slate-400', 'bg-slate-500/15 text-slate-300', 'bg-slate-500'),
  },
  {
    technology: 'dynamodb', category: 'datastore', label: 'DynamoDB', Icon: Database,
    colors: mk('border-amber-600/40', 'ring-amber-600/30', 'text-amber-500', 'bg-amber-600/15 text-amber-400', 'bg-amber-600'),
  },
  {
    technology: 'couchdb', category: 'datastore', label: 'CouchDB', Icon: Database,
    defaultPort: '5984',
    colors: mk('border-red-400/40', 'ring-red-400/30', 'text-red-300', 'bg-red-400/15 text-red-200', 'bg-red-400'),
  },
  {
    technology: 'neo4j', category: 'datastore', label: 'Neo4j', Icon: Share2,
    defaultPort: '7687',
    colors: mk('border-cyan-500/40', 'ring-cyan-500/30', 'text-cyan-400', 'bg-cyan-500/15 text-cyan-300', 'bg-cyan-500'),
  },
  {
    technology: 'influxdb', category: 'datastore', label: 'InfluxDB', Icon: Activity,
    defaultPort: '8086',
    colors: mk('border-violet-400/40', 'ring-violet-400/30', 'text-violet-300', 'bg-violet-400/15 text-violet-200', 'bg-violet-400'),
  },
  {
    technology: 'memcached', category: 'datastore', label: 'Memcached', Icon: Zap,
    defaultPort: '11211',
    colors: mk('border-lime-500/40', 'ring-lime-500/30', 'text-lime-400', 'bg-lime-500/15 text-lime-300', 'bg-lime-500'),
  },
  {
    technology: 'hazelcast', category: 'datastore', label: 'Hazelcast', Icon: Zap,
    defaultPort: '5701',
    colors: mk('border-emerald-400/40', 'ring-emerald-400/30', 'text-emerald-300', 'bg-emerald-400/15 text-emerald-200', 'bg-emerald-400'),
  },
  {
    technology: 'cockroachdb', category: 'datastore', label: 'CockroachDB', Icon: Database,
    defaultPort: '26257',
    colors: mk('border-teal-400/40', 'ring-teal-400/30', 'text-teal-300', 'bg-teal-400/15 text-teal-200', 'bg-teal-400'),
  },
  {
    technology: 'scylladb', category: 'datastore', label: 'ScyllaDB', Icon: Database,
    defaultPort: '9042',
    colors: mk('border-fuchsia-500/40', 'ring-fuchsia-500/30', 'text-fuchsia-400', 'bg-fuchsia-500/15 text-fuchsia-300', 'bg-fuchsia-500'),
  },

  // ── Message Brokers ───────────────────────────────────────────────
  {
    technology: 'kafka', category: 'broker', label: 'Kafka', Icon: GitBranch,
    defaultPort: '9092',
    colors: mk('border-amber-500/40', 'ring-amber-500/30', 'text-amber-400', 'bg-amber-500/15 text-amber-300', 'bg-amber-500'),
  },
  {
    technology: 'rabbitmq', category: 'broker', label: 'RabbitMQ', Icon: MessageSquare,
    defaultPort: '5672',
    colors: mk('border-orange-400/40', 'ring-orange-400/30', 'text-orange-300', 'bg-orange-400/15 text-orange-200', 'bg-orange-400'),
  },
  {
    technology: 'nats', category: 'broker', label: 'NATS', Icon: Radio,
    defaultPort: '4222',
    colors: mk('border-blue-500/40', 'ring-blue-500/30', 'text-blue-400', 'bg-blue-500/15 text-blue-300', 'bg-blue-500'),
  },
  {
    technology: 'pulsar', category: 'broker', label: 'Pulsar', Icon: Radio,
    defaultPort: '6650',
    colors: mk('border-sky-400/40', 'ring-sky-400/30', 'text-sky-300', 'bg-sky-400/15 text-sky-200', 'bg-sky-400'),
  },
  {
    technology: 'activemq', category: 'broker', label: 'ActiveMQ', Icon: MessageSquare,
    defaultPort: '61616',
    colors: mk('border-red-600/40', 'ring-red-600/30', 'text-red-500', 'bg-red-600/15 text-red-400', 'bg-red-600'),
  },
  {
    technology: 'sqs', category: 'broker', label: 'SQS', Icon: MessageSquare,
    colors: mk('border-yellow-600/40', 'ring-yellow-600/30', 'text-yellow-500', 'bg-yellow-600/15 text-yellow-400', 'bg-yellow-600'),
  },
  {
    technology: 'pubsub', category: 'broker', label: 'Pub/Sub', Icon: Radio,
    colors: mk('border-blue-400/40', 'ring-blue-400/30', 'text-blue-300', 'bg-blue-400/15 text-blue-200', 'bg-blue-400'),
  },
  {
    technology: 'kinesis', category: 'broker', label: 'Kinesis', Icon: GitBranch,
    colors: mk('border-violet-500/40', 'ring-violet-500/30', 'text-violet-400', 'bg-violet-500/15 text-violet-300', 'bg-violet-500'),
  },

  // ── Services ─────────────────────────────────────────────────────
  {
    technology: 'rest-api', category: 'service', label: 'REST API', Icon: Globe,
    colors: mk('border-indigo-500/40', 'ring-indigo-500/30', 'text-indigo-400', 'bg-indigo-500/15 text-indigo-300', 'bg-indigo-500'),
  },
  {
    technology: 'grpc', category: 'service', label: 'gRPC', Icon: Cpu,
    colors: mk('border-violet-500/40', 'ring-violet-500/30', 'text-violet-400', 'bg-violet-500/15 text-violet-300', 'bg-violet-500'),
  },
  {
    technology: 'graphql', category: 'service', label: 'GraphQL', Icon: Share2,
    colors: mk('border-pink-500/40', 'ring-pink-500/30', 'text-pink-400', 'bg-pink-500/15 text-pink-300', 'bg-pink-500'),
  },
  {
    technology: 'microservice', category: 'service', label: 'Service', Icon: Package,
    colors: mk('border-blue-500/40', 'ring-blue-500/30', 'text-blue-400', 'bg-blue-500/15 text-blue-300', 'bg-blue-500'),
  },
  {
    technology: 'worker', category: 'service', label: 'Worker', Icon: Timer,
    colors: mk('border-slate-400/40', 'ring-slate-400/30', 'text-slate-400', 'bg-slate-400/15 text-slate-300', 'bg-slate-400'),
  },

  // ── Infrastructure ────────────────────────────────────────────────
  {
    technology: 'api-gateway', category: 'infrastructure', label: 'API Gateway', Icon: Shield,
    colors: mk('border-violet-600/40', 'ring-violet-600/30', 'text-violet-400', 'bg-violet-600/15 text-violet-300', 'bg-violet-600'),
  },
  {
    technology: 'load-balancer', category: 'infrastructure', label: 'Load Balancer', Icon: SlidersHorizontal,
    colors: mk('border-sky-600/40', 'ring-sky-600/30', 'text-sky-400', 'bg-sky-600/15 text-sky-300', 'bg-sky-500'),
  },
  {
    technology: 'nginx', category: 'infrastructure', label: 'Nginx', Icon: Server,
    colors: mk('border-emerald-500/40', 'ring-emerald-500/30', 'text-emerald-400', 'bg-emerald-500/15 text-emerald-300', 'bg-emerald-500'),
  },
  {
    technology: 'cdn', category: 'infrastructure', label: 'CDN', Icon: Network,
    colors: mk('border-teal-500/40', 'ring-teal-500/30', 'text-teal-400', 'bg-teal-500/15 text-teal-300', 'bg-teal-500'),
  },
  {
    technology: 'kubernetes', category: 'infrastructure', label: 'Kubernetes', Icon: Boxes,
    colors: mk('border-blue-600/40', 'ring-blue-600/30', 'text-blue-500', 'bg-blue-600/15 text-blue-400', 'bg-blue-600'),
  },
  {
    technology: 'docker', category: 'infrastructure', label: 'Docker', Icon: Container,
    colors: mk('border-cyan-600/40', 'ring-cyan-600/30', 'text-cyan-500', 'bg-cyan-600/15 text-cyan-400', 'bg-cyan-600'),
  },
  {
    technology: 'consul', category: 'infrastructure', label: 'Consul', Icon: Network,
    colors: mk('border-rose-500/40', 'ring-rose-500/30', 'text-rose-400', 'bg-rose-500/15 text-rose-300', 'bg-rose-500'),
  },
  {
    technology: 'vault', category: 'infrastructure', label: 'Vault', Icon: Lock,
    colors: mk('border-yellow-700/40', 'ring-yellow-700/30', 'text-yellow-600', 'bg-yellow-700/15 text-yellow-500', 'bg-yellow-700'),
  },
  {
    technology: 'istio', category: 'infrastructure', label: 'Istio', Icon: Network,
    colors: mk('border-indigo-400/40', 'ring-indigo-400/30', 'text-indigo-300', 'bg-indigo-400/15 text-indigo-200', 'bg-indigo-400'),
  },
  {
    technology: 'envoy', category: 'infrastructure', label: 'Envoy', Icon: Shield,
    colors: mk('border-purple-400/40', 'ring-purple-400/30', 'text-purple-300', 'bg-purple-400/15 text-purple-200', 'bg-purple-400'),
  },

  // ── External ──────────────────────────────────────────────────────
  {
    technology: 'external', category: 'external', label: 'External', Icon: ExternalLink,
    colors: mk('border-slate-500/40', 'ring-slate-500/30', 'text-slate-400', 'bg-slate-500/15 text-slate-300', 'bg-slate-500'),
  },
  {
    technology: 'client', category: 'external', label: 'Client', Icon: Monitor,
    colors: mk('border-gray-500/40', 'ring-gray-500/30', 'text-gray-400', 'bg-gray-500/15 text-gray-300', 'bg-gray-500'),
  },

  // ── Big Data ─────────────────────────────────────────────────────
  {
    technology: 'hadoop', category: 'bigdata', label: 'Hadoop', Icon: HardDrive,
    colors: mk('border-yellow-600/40', 'ring-yellow-600/30', 'text-yellow-500', 'bg-yellow-600/15 text-yellow-400', 'bg-yellow-600'),
  },
  {
    technology: 'spark', category: 'bigdata', label: 'Spark', Icon: Zap,
    colors: mk('border-orange-500/40', 'ring-orange-500/30', 'text-orange-400', 'bg-orange-500/15 text-orange-300', 'bg-orange-500'),
  },
  {
    technology: 'flink', category: 'bigdata', label: 'Flink', Icon: Cpu,
    colors: mk('border-red-500/40', 'ring-red-500/30', 'text-red-400', 'bg-red-500/15 text-red-300', 'bg-red-500'),
  },
  {
    technology: 'hive', category: 'bigdata', label: 'Hive', Icon: Database,
    colors: mk('border-amber-600/40', 'ring-amber-600/30', 'text-amber-500', 'bg-amber-600/15 text-amber-400', 'bg-amber-600'),
  },
  {
    technology: 'trino', category: 'bigdata', label: 'Trino', Icon: Search,
    colors: mk('border-indigo-600/40', 'ring-indigo-600/30', 'text-indigo-500', 'bg-indigo-600/15 text-indigo-400', 'bg-indigo-600'),
  },
  {
    technology: 'kafka-streams', category: 'bigdata', label: 'Kafka Streams', Icon: Layers,
    colors: mk('border-amber-500/40', 'ring-amber-500/30', 'text-amber-400', 'bg-amber-500/15 text-amber-300', 'bg-amber-500'),
  },
  {
    technology: 'airflow', category: 'bigdata', label: 'Airflow', Icon: Workflow,
    colors: mk('border-teal-600/40', 'ring-teal-600/30', 'text-teal-500', 'bg-teal-600/15 text-teal-400', 'bg-teal-600'),
  },
  {
    technology: 'dbt', category: 'bigdata', label: 'dbt', Icon: GitBranch,
    colors: mk('border-orange-600/40', 'ring-orange-600/30', 'text-orange-500', 'bg-orange-600/15 text-orange-400', 'bg-orange-600'),
  },
  {
    technology: 'beam', category: 'bigdata', label: 'Apache Beam', Icon: Cpu,
    colors: mk('border-blue-600/40', 'ring-blue-600/30', 'text-blue-500', 'bg-blue-600/15 text-blue-400', 'bg-blue-600'),
  },
  {
    technology: 'nifi', category: 'bigdata', label: 'Apache NiFi', Icon: Network,
    colors: mk('border-purple-600/40', 'ring-purple-600/30', 'text-purple-500', 'bg-purple-600/15 text-purple-400', 'bg-purple-600'),
  },

  // ── Analytics / Data Warehouse ────────────────────────────────────
  {
    technology: 'snowflake', category: 'analytics', label: 'Snowflake', Icon: Sigma,
    colors: mk('border-sky-500/40', 'ring-sky-500/30', 'text-sky-400', 'bg-sky-500/15 text-sky-300', 'bg-sky-500'),
  },
  {
    technology: 'bigquery', category: 'analytics', label: 'BigQuery', Icon: BarChart3,
    colors: mk('border-blue-600/40', 'ring-blue-600/30', 'text-blue-500', 'bg-blue-600/15 text-blue-400', 'bg-blue-600'),
  },
  {
    technology: 'redshift', category: 'analytics', label: 'Redshift', Icon: Database,
    colors: mk('border-red-700/40', 'ring-red-700/30', 'text-red-600', 'bg-red-700/15 text-red-500', 'bg-red-700'),
  },
  {
    technology: 'databricks', category: 'analytics', label: 'Databricks', Icon: Zap,
    colors: mk('border-red-500/40', 'ring-red-500/30', 'text-red-400', 'bg-red-500/15 text-red-300', 'bg-red-500'),
  },
  {
    technology: 'clickhouse', category: 'analytics', label: 'ClickHouse', Icon: Database,
    colors: mk('border-yellow-500/40', 'ring-yellow-500/30', 'text-yellow-400', 'bg-yellow-500/15 text-yellow-300', 'bg-yellow-500'),
  },
  {
    technology: 'druid', category: 'analytics', label: 'Druid', Icon: BarChart3,
    colors: mk('border-purple-500/40', 'ring-purple-500/30', 'text-purple-400', 'bg-purple-500/15 text-purple-300', 'bg-purple-500'),
  },

  // ── Object Storage ────────────────────────────────────────────────
  {
    technology: 's3', category: 'storage', label: 'S3', Icon: HardDrive,
    colors: mk('border-green-600/40', 'ring-green-600/30', 'text-green-500', 'bg-green-600/15 text-green-400', 'bg-green-600'),
  },
  {
    technology: 'gcs', category: 'storage', label: 'GCS', Icon: Cloud,
    colors: mk('border-blue-500/40', 'ring-blue-500/30', 'text-blue-400', 'bg-blue-500/15 text-blue-300', 'bg-blue-500'),
  },
  {
    technology: 'minio', category: 'storage', label: 'MinIO', Icon: HardDrive,
    colors: mk('border-pink-500/40', 'ring-pink-500/30', 'text-pink-400', 'bg-pink-500/15 text-pink-300', 'bg-pink-500'),
  },
  {
    technology: 'azure-blob', category: 'storage', label: 'Azure Blob', Icon: Cloud,
    colors: mk('border-sky-600/40', 'ring-sky-600/30', 'text-sky-500', 'bg-sky-600/15 text-sky-400', 'bg-sky-600'),
  },

  // ── Monitoring / Observability ────────────────────────────────────
  {
    technology: 'prometheus', category: 'monitoring', label: 'Prometheus', Icon: Activity,
    defaultPort: '9090',
    colors: mk('border-orange-500/40', 'ring-orange-500/30', 'text-orange-400', 'bg-orange-500/15 text-orange-300', 'bg-orange-500'),
  },
  {
    technology: 'grafana', category: 'monitoring', label: 'Grafana', Icon: BarChart3,
    defaultPort: '3000',
    colors: mk('border-orange-400/40', 'ring-orange-400/30', 'text-orange-300', 'bg-orange-400/15 text-orange-200', 'bg-orange-400'),
  },
  {
    technology: 'jaeger', category: 'monitoring', label: 'Jaeger', Icon: Eye,
    defaultPort: '16686',
    colors: mk('border-sky-500/40', 'ring-sky-500/30', 'text-sky-400', 'bg-sky-500/15 text-sky-300', 'bg-sky-500'),
  },
  {
    technology: 'datadog', category: 'monitoring', label: 'Datadog', Icon: Eye,
    colors: mk('border-purple-500/40', 'ring-purple-500/30', 'text-purple-400', 'bg-purple-500/15 text-purple-300', 'bg-purple-500'),
  },
  {
    technology: 'opentelemetry', category: 'monitoring', label: 'OpenTelemetry', Icon: Activity,
    colors: mk('border-blue-400/40', 'ring-blue-400/30', 'text-blue-300', 'bg-blue-400/15 text-blue-200', 'bg-blue-400'),
  },
  {
    technology: 'elk', category: 'monitoring', label: 'ELK Stack', Icon: Search,
    defaultPort: '5601',
    colors: mk('border-yellow-500/40', 'ring-yellow-500/30', 'text-yellow-400', 'bg-yellow-500/15 text-yellow-300', 'bg-yellow-500'),
  },
  {
    technology: 'loki', category: 'monitoring', label: 'Loki', Icon: Eye,
    defaultPort: '3100',
    colors: mk('border-emerald-500/40', 'ring-emerald-500/30', 'text-emerald-400', 'bg-emerald-500/15 text-emerald-300', 'bg-emerald-500'),
  },
  {
    technology: 'zipkin', category: 'monitoring', label: 'Zipkin', Icon: Eye,
    defaultPort: '9411',
    colors: mk('border-rose-500/40', 'ring-rose-500/30', 'text-rose-400', 'bg-rose-500/15 text-rose-300', 'bg-rose-500'),
  },

  // ── CI/CD ──────────────────────────────────────────────────────────
  {
    technology: 'github-actions', category: 'cicd', label: 'GitHub Actions', Icon: GitMerge,
    colors: mk('border-slate-400/40', 'ring-slate-400/30', 'text-slate-300', 'bg-slate-400/15 text-slate-200', 'bg-slate-400'),
  },
  {
    technology: 'jenkins', category: 'cicd', label: 'Jenkins', Icon: Play,
    defaultPort: '8080',
    colors: mk('border-red-400/40', 'ring-red-400/30', 'text-red-300', 'bg-red-400/15 text-red-200', 'bg-red-400'),
  },
  {
    technology: 'argocd', category: 'cicd', label: 'ArgoCD', Icon: GitMerge,
    defaultPort: '8080',
    colors: mk('border-orange-500/40', 'ring-orange-500/30', 'text-orange-400', 'bg-orange-500/15 text-orange-300', 'bg-orange-500'),
  },
  {
    technology: 'gitlab-ci', category: 'cicd', label: 'GitLab CI', Icon: GitMerge,
    colors: mk('border-orange-600/40', 'ring-orange-600/30', 'text-orange-500', 'bg-orange-600/15 text-orange-400', 'bg-orange-600'),
  },
  {
    technology: 'tekton', category: 'cicd', label: 'Tekton', Icon: GitBranch,
    colors: mk('border-blue-500/40', 'ring-blue-500/30', 'text-blue-400', 'bg-blue-500/15 text-blue-300', 'bg-blue-500'),
  },

  // ── ML / AI ───────────────────────────────────────────────────────
  {
    technology: 'mlflow', category: 'ml', label: 'MLflow', Icon: FlaskConical,
    defaultPort: '5000',
    colors: mk('border-sky-500/40', 'ring-sky-500/30', 'text-sky-400', 'bg-sky-500/15 text-sky-300', 'bg-sky-500'),
  },
  {
    technology: 'feature-store', category: 'ml', label: 'Feature Store', Icon: Database,
    colors: mk('border-teal-500/40', 'ring-teal-500/30', 'text-teal-400', 'bg-teal-500/15 text-teal-300', 'bg-teal-500'),
  },
  {
    technology: 'model-serving', category: 'ml', label: 'Model Serving', Icon: Brain,
    colors: mk('border-purple-600/40', 'ring-purple-600/30', 'text-purple-500', 'bg-purple-600/15 text-purple-400', 'bg-purple-600'),
  },
  {
    technology: 'ray', category: 'ml', label: 'Ray', Icon: Cpu,
    colors: mk('border-blue-500/40', 'ring-blue-500/30', 'text-blue-400', 'bg-blue-500/15 text-blue-300', 'bg-blue-500'),
  },
  {
    technology: 'kubeflow', category: 'ml', label: 'Kubeflow', Icon: Brain,
    colors: mk('border-indigo-500/40', 'ring-indigo-500/30', 'text-indigo-400', 'bg-indigo-500/15 text-indigo-300', 'bg-indigo-500'),
  },
]

export const TECH_MAP = new Map<NodeTechnology, TechDef>(
  TECH_REGISTRY.map((t) => [t.technology, t])
)

export function getTech(tech: NodeTechnology): TechDef {
  return TECH_MAP.get(tech) ?? TECH_REGISTRY[0]
}

export const CATEGORIES: { id: NodeCategory; label: string }[] = [
  { id: 'datastore',      label: 'Data Stores' },
  { id: 'broker',         label: 'Message Brokers' },
  { id: 'service',        label: 'Services' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'bigdata',        label: 'Big Data' },
  { id: 'analytics',      label: 'Analytics & Warehouse' },
  { id: 'storage',        label: 'Object Storage' },
  { id: 'monitoring',     label: 'Monitoring & Observability' },
  { id: 'cicd',           label: 'CI / CD' },
  { id: 'ml',             label: 'ML / AI' },
  { id: 'external',       label: 'External' },
]
