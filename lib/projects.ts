export interface Project {
  id: number
  name: string
  uuid: string
  created_at: string
  deadline: string | null
  ownerId: string
  orgId: string | null
  settings: T | null
}

