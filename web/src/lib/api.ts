import type { Project, DiagramSummary, Diagram } from '../types/diagram'

const BASE = '/api'

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  projects: {
    list: () => req<Project[]>('/projects'),
    create: (data: { name: string; description?: string }) =>
      req<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => req<Project>(`/projects/${id}`),
    update: (id: string, data: Partial<Pick<Project, 'name' | 'description'>>) =>
      req<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => req<void>(`/projects/${id}`, { method: 'DELETE' }),
    diagrams: (projectId: string) =>
      req<DiagramSummary[]>(`/projects/${projectId}/diagrams`),
  },
  diagrams: {
    create: (data: {
      projectId: string
      name: string
      nodesJson?: string
      edgesJson?: string
      pumlSource?: string
      viewport?: string
    }) => req<Diagram>('/diagrams', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => req<Diagram>(`/diagrams/${id}`),
    update: (
      id: string,
      data: Partial<Pick<Diagram, 'name' | 'nodesJson' | 'edgesJson' | 'pumlSource' | 'viewport'>>
    ) => req<Diagram>(`/diagrams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => req<void>(`/diagrams/${id}`, { method: 'DELETE' }),
  },
}
