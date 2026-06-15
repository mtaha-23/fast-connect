import { getFirebaseAuth } from "@/lib/firebase"

export async function getAuthHeaders(extra?: HeadersInit): Promise<HeadersInit> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  if (!user) {
    throw new Error("You must be signed in to continue.")
  }

  const token = await user.getIdToken()
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...extra,
  }
}

export async function testApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders(init?.headers as HeadersInit | undefined)
  const response = await fetch(path, { ...init, headers })

  const data = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`)
  }

  return data
}
