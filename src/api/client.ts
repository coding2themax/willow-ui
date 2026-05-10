const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export function getAdminToken(): string {
  return sessionStorage.getItem('willow_admin_token') ?? ''
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem('willow_admin_token', token)
}

export function clearAdminToken(): void {
  sessionStorage.removeItem('willow_admin_token')
}

interface RequestOptions extends RequestInit {
  /** Set true when body is FormData so Content-Type is omitted (browser sets it with boundary). */
  isMultipart?: boolean
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { isMultipart, ...init } = options

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  }

  const token = getAdminToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isMultipart) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
