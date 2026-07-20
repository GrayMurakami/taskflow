import { ref } from 'vue'
import { supabase } from '@/shared/api/supabase'
import type { Task, NewTask } from './Task.types'

const tasks = ref<Task[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchTasks() {
  isLoading.value = true;
  error.value = null;

  const { data, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (fetchError) {
    error.value = fetchError.message;
  } else {
    tasks.value = data;
  }

  isLoading.value = false;
}

async function createTask(newTask: NewTask) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    error.value = 'Not authorized!';
    return false
  }

  const { data, error: insertError } = await supabase
    .from('tasks')
    .insert({ ...newTask, user_id: userData.user.id })
    .select()
    .single()

  if (insertError) {
    error.value = insertError.message;
    return false
  }

  tasks.value.unshift(data);
  return true
}

async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error: updateError } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    error.value = updateError.message;
    return false
  }

  const index = tasks.value.findIndex((t) => t.id === id);
  if (index !== -1) tasks.value[index] = data;
  return true
}

async function deleteTask(id: string) {
  const { error: deleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (deleteError) {
    error.value = deleteError.message;
    return false
  }

  tasks.value = tasks.value.filter((t) => t.id !== id);
  return true
}

export function useTasks() {
  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}
