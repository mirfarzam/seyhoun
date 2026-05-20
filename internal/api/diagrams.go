package api

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"seyhoun/internal/models"
)

type DiagramHandler struct {
	db *sql.DB
}

func NewDiagramHandler(db *sql.DB) *DiagramHandler {
	return &DiagramHandler{db: db}
}

func (h *DiagramHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProjectID  string `json:"projectId"`
		Name       string `json:"name"`
		NodesJSON  string `json:"nodesJson"`
		EdgesJSON  string `json:"edgesJson"`
		PumlSource string `json:"pumlSource"`
		Viewport   string `json:"viewport"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, 400, "invalid request body")
		return
	}
	if req.ProjectID == "" || req.Name == "" {
		writeError(w, 400, "projectId and name are required")
		return
	}
	if req.NodesJSON == "" {
		req.NodesJSON = "[]"
	}
	if req.EdgesJSON == "" {
		req.EdgesJSON = "[]"
	}
	if req.Viewport == "" {
		req.Viewport = `{"x":0,"y":0,"zoom":1}`
	}

	now := time.Now()
	d := models.Diagram{
		ID:         uuid.New().String(),
		ProjectID:  req.ProjectID,
		Name:       req.Name,
		NodesJSON:  req.NodesJSON,
		EdgesJSON:  req.EdgesJSON,
		PumlSource: req.PumlSource,
		Viewport:   req.Viewport,
		CreatedAt:  now,
		UpdatedAt:  now,
	}
	_, err := h.db.ExecContext(r.Context(),
		`INSERT INTO diagrams (id, project_id, name, nodes_json, edges_json, puml_source, viewport, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		d.ID, d.ProjectID, d.Name, d.NodesJSON, d.EdgesJSON, d.PumlSource, d.Viewport, d.CreatedAt, d.UpdatedAt)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	writeJSON(w, 201, d)
}

func (h *DiagramHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var d models.Diagram
	err := h.db.QueryRowContext(r.Context(),
		`SELECT id, project_id, name, nodes_json, edges_json, puml_source, viewport, created_at, updated_at
		 FROM diagrams WHERE id = ?`, id).
		Scan(&d.ID, &d.ProjectID, &d.Name, &d.NodesJSON, &d.EdgesJSON, &d.PumlSource, &d.Viewport, &d.CreatedAt, &d.UpdatedAt)
	if err == sql.ErrNoRows {
		writeError(w, 404, "diagram not found")
		return
	}
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	writeJSON(w, 200, d)
}

func (h *DiagramHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req struct {
		Name       string `json:"name"`
		NodesJSON  string `json:"nodesJson"`
		EdgesJSON  string `json:"edgesJson"`
		PumlSource string `json:"pumlSource"`
		Viewport   string `json:"viewport"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, 400, "invalid request body")
		return
	}
	_, err := h.db.ExecContext(r.Context(),
		`UPDATE diagrams
		 SET name = ?, nodes_json = ?, edges_json = ?, puml_source = ?, viewport = ?, updated_at = ?
		 WHERE id = ?`,
		req.Name, req.NodesJSON, req.EdgesJSON, req.PumlSource, req.Viewport, time.Now(), id)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	h.Get(w, r)
}

func (h *DiagramHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	_, err := h.db.ExecContext(r.Context(), `DELETE FROM diagrams WHERE id = ?`, id)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	w.WriteHeader(204)
}
