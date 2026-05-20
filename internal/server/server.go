package server

import (
	"database/sql"
	"net/http"
	"os"
	"path/filepath"
	"seyhoun/internal/api"
)

type Server struct {
	db  *sql.DB
	mux *http.ServeMux
}

func New(db *sql.DB) *Server {
	s := &Server{db: db}
	s.mux = s.buildMux()
	return s
}

func (s *Server) Start(addr string) error {
	return http.ListenAndServe(addr, corsMiddleware(s.mux))
}

func (s *Server) buildMux() *http.ServeMux {
	mux := http.NewServeMux()

	ph := api.NewProjectHandler(s.db)
	dh := api.NewDiagramHandler(s.db)

	mux.HandleFunc("GET /api/projects", ph.List)
	mux.HandleFunc("POST /api/projects", ph.Create)
	mux.HandleFunc("GET /api/projects/{id}", ph.Get)
	mux.HandleFunc("PUT /api/projects/{id}", ph.Update)
	mux.HandleFunc("DELETE /api/projects/{id}", ph.Delete)
	mux.HandleFunc("GET /api/projects/{projectId}/diagrams", ph.ListDiagrams)

	mux.HandleFunc("POST /api/diagrams", dh.Create)
	mux.HandleFunc("GET /api/diagrams/{id}", dh.Get)
	mux.HandleFunc("PUT /api/diagrams/{id}", dh.Update)
	mux.HandleFunc("DELETE /api/diagrams/{id}", dh.Delete)

	// Serve the built frontend from web/dist (production / after `make build`)
	const distDir = "web/dist"
	if _, err := os.Stat(distDir); err == nil {
		mux.Handle("/", spaHandler(distDir))
	}

	return mux
}

// spaHandler serves static files and falls back to index.html for SPA routes.
func spaHandler(distDir string) http.Handler {
	fs := http.FileServer(http.Dir(distDir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(distDir, filepath.Clean(r.URL.Path))
		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
			return
		}
		fs.ServeHTTP(w, r)
	})
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
