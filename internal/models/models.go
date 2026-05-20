package models

import "time"

type Project struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type DiagramSummary struct {
	ID        string    `json:"id"`
	ProjectID string    `json:"projectId"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Diagram struct {
	ID         string    `json:"id"`
	ProjectID  string    `json:"projectId"`
	Name       string    `json:"name"`
	NodesJSON  string    `json:"nodesJson"`
	EdgesJSON  string    `json:"edgesJson"`
	PumlSource string    `json:"pumlSource"`
	Viewport   string    `json:"viewport"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
