export interface LineItem {
  id: string,
  created_at: string,
  project_id: string,
  name: string | null,
  start_date: string | null,
  end_date: string | null,
  assignee: string | null,
  estimated_hours: number | null,
  complexity: number | null,
  status: text | null
}
