export interface Subtask {
  id: string
  text: string
  done: boolean
}
export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'inprogress' | 'done'
  tags: string[]
  deadline: string | null
  created_at: string
  subtasks: Subtask[]
  order: number
}

export type NewTask = Pick<Task, 'title' | 'description' | 'priority' | 'deadline' | 'tags' | 'subtasks'>
