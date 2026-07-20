export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'done'
  deadline: string | null
  create_at: string
}

export type NewTask = Pick<Task, 'title' | 'description' | 'priority' | 'deadline'>
