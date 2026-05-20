CREATE TABLE IF NOT EXISTS projects (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS diagrams (
    id          TEXT PRIMARY KEY,
    project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    nodes_json  TEXT NOT NULL DEFAULT '[]',
    edges_json  TEXT NOT NULL DEFAULT '[]',
    puml_source TEXT NOT NULL DEFAULT '',
    viewport    TEXT NOT NULL DEFAULT '{"x":0,"y":0,"zoom":1}',
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS plugin_configs (
    id          TEXT PRIMARY KEY,
    diagram_id  TEXT NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
    node_id     TEXT NOT NULL,
    plugin_type TEXT NOT NULL,
    config_json TEXT NOT NULL DEFAULT '{}',
    enabled     INTEGER NOT NULL DEFAULT 1,
    created_at  DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS metric_snapshots (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    plugin_config_id TEXT NOT NULL REFERENCES plugin_configs(id) ON DELETE CASCADE,
    data_json        TEXT NOT NULL,
    captured_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_diagrams_project
    ON diagrams(project_id);

CREATE INDEX IF NOT EXISTS idx_plugin_configs_diagram
    ON plugin_configs(diagram_id);

CREATE INDEX IF NOT EXISTS idx_snapshots_config_time
    ON metric_snapshots(plugin_config_id, captured_at DESC);
