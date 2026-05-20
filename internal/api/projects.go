package api

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"seyhoun/internal/models"
)

type ProjectHandler struct {
	db *sql.DB
}

func NewProjectHandler(db *sql.DB) *ProjectHandler {
	return &ProjectHandler{db: db}
}

func (h *ProjectHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.QueryContext(r.Context(),
		`SELECT id, name, description, created_at, updated_at
		 FROM projects ORDER BY created_at DESC`)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	defer rows.Close()

	projects := []models.Project{}
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.CreatedAt, &p.UpdatedAt); err != nil {
			writeError(w, 500, err.Error())
			return
		}
		projects = append(projects, p)
	}
	writeJSON(w, 200, projects)
}

func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, 400, "invalid request body")
		return
	}
	if req.Name == "" {
		writeError(w, 400, "name is required")
		return
	}

	now := time.Now()
	p := models.Project{
		ID:          uuid.New().String(),
		Name:        req.Name,
		Description: req.Description,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	_, err := h.db.ExecContext(r.Context(),
		`INSERT INTO projects (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
		p.ID, p.Name, p.Description, p.CreatedAt, p.UpdatedAt)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	writeJSON(w, 201, p)
}

func (h *ProjectHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var p models.Project
	err := h.db.QueryRowContext(r.Context(),
		`SELECT id, name, description, created_at, updated_at FROM projects WHERE id = ?`, id).
		Scan(&p.ID, &p.Name, &p.Description, &p.CreatedAt, &p.UpdatedAt)
	if err == sql.ErrNoRows {
		writeError(w, 404, "project not found")
		return
	}
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	writeJSON(w, 200, p)
}

func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, 400, "invalid request body")
		return
	}
	_, err := h.db.ExecContext(r.Context(),
		`UPDATE projects SET name = ?, description = ?, updated_at = ? WHERE id = ?`,
		req.Name, req.Description, time.Now(), id)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	h.Get(w, r)
}

func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	_, err := h.db.ExecContext(r.Context(), `DELETE FROM projects WHERE id = ?`, id)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	w.WriteHeader(204)
}

func (h *ProjectHandler) ListDiagrams(w http.ResponseWriter, r *http.Request) {
	projectID := r.PathValue("projectId")
	rows, err := h.db.QueryContext(r.Context(),
		`SELECT id, project_id, name, created_at, updated_at
		 FROM diagrams WHERE project_id = ? ORDER BY created_at DESC`, projectID)
	if err != nil {
		writeError(w, 500, err.Error())
		return
	}
	defer rows.Close()

	diagrams := []models.DiagramSummary{}
	for rows.Next() {
		var d models.DiagramSummary
		if err := rows.Scan(&d.ID, &d.ProjectID, &d.Name, &d.CreatedAt, &d.UpdatedAt); err != nil {
			writeError(w, 500, err.Error())
			return
		}
		diagrams = append(diagrams, d)
	}
	writeJSON(w, 200, diagrams)
}
