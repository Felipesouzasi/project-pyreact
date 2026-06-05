import { useState, useEffect, useCallback } from 'react'

const BASE_URL = '/api'

// Consultor fixo por enquanto – futuramente virá do contexto de autenticação
export const CONSULTOR_ID = 40000958

// ─── fetch genérico ───────────────────────────────────────────────────────────
async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

// ─── hook genérico ────────────────────────────────────────────────────────────
export function useApi(path, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    if (!path) return
    setLoading(true)
    setError(null)
    try {
      const json = await apiFetch(path)
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => { load() }, [load, ...deps])

  return { data, loading, error, reload: load }
}

// ─── hooks específicos ────────────────────────────────────────────────────────
export function useMetas(consultorId) {
  return useApi(`/consultor/${consultorId}/metas`)
}

export function useTopClientes(consultorId, page = 1, pageSize = 10) {
  return useApi(`/consultor/${consultorId}/top-clientes?page=${page}&page_size=${pageSize}`, [page, pageSize])
}

export function useTopProdutos(consultorId, page = 1, pageSize = 10) {
  return useApi(`/consultor/${consultorId}/top-produtos?page=${page}&page_size=${pageSize}`, [page, pageSize])
}

export function useTopGrupos(consultorId) {
  return useApi(`/consultor/${consultorId}/top-grupos`)
}

export function useTopSubgrupos(consultorId, page = 1, pageSize = 12) {
  return useApi(`/consultor/${consultorId}/top-subgrupos?page=${page}&page_size=${pageSize}`, [page, pageSize])
}