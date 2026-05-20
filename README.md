# Seyhoun

Architecture design, presentation, and monitoring tool. Draw your system, present it read-only, and watch live health overlays on your components.

## Modes

**Design** — drag-and-drop canvas for building architecture diagrams. Add nodes, connect them, and drill into any component to create nested sub-diagrams. Changes auto-save before navigation.

**Present** — read-only view of your diagram for sharing or walkthroughs. No editing controls, just the architecture.

**Monitor** — live view with animated data-flow edges and a health legend. Plugin integrations for PostgreSQL, Kafka, and Redis are coming in Phase 4.

## Requirements

- Go 1.22+
- Node.js 18+ and npm

No CGo required — SQLite is bundled via `modernc/sqlite`.

## Getting started

```bash
# Install frontend dependencies
make install

# Terminal 1 — Go API server (default port 1995)
make dev-api

# Terminal 2 — Vite dev server with API proxy (port 5173)
make dev-web
```

Open [http://localhost:5173](http://localhost:5173).

## Production build

```bash
make build   # builds web/dist, then compiles ./seyhoun binary
./seyhoun    # serves everything on :1995
```

Set `PORT` to change the listening port:

```bash
PORT=8080 ./seyhoun
```

## Project structure

```
cmd/          Go entrypoint
internal/
  api/        HTTP handlers (projects, diagrams)
  db/         SQLite schema and connection
  models/     Shared types
  server/     Router setup
web/src/
  modes/      DesignMode, PresentMode, MonitorMode
  components/ Canvas, panels, UI primitives
  stores/     Zustand state (diagram, UI)
  lib/        API client
```

## Data

Projects and diagrams are stored in `seyhoun.db` (SQLite) in the working directory. The database is created automatically on first run.

To reset all data:

```bash
make clean   # removes web/dist, the binary, and seyhoun.db
```
