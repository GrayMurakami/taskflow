<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'
import { useTasks } from '@/entities/task/useTasks'
import TaskCreateForm from '@/features/task-create/TaskCreateForm.vue'

const filter = ref<'all' | 'active' | 'done'>('all');
const { logout, user } = useAuth();
const { tasks, isLoading, error, fetchTasks, updateTask, deleteTask } = useTasks();
const router = useRouter();

const filteredTasks = computed(() => {
  if (filter.value === 'all') return tasks.value;
  return tasks.value.filter((task) => task.status === filter.value);
});

onMounted(() => {
  fetchTasks()
});

async function handleLogout() {
  await logout();
  router.push('/login');
}

async function toggleStatus(id: string, currentStatus: 'active' | 'done') {
  const newStatus = currentStatus === 'active' ? 'done' : 'active';
  const success = await updateTask(id, { status: newStatus });

  if (!success) {
    console.error('Failed to update the task status!');
  }
}

async function handleDelete(id: string) {
  const success = await deleteTask(id);

  if (!success) {
    console.error('Failed to delete the task!')
  }
}
</script>

<template>
    <p>Tasks page. Hello, {{ user?.email?.split('@')[0] }}</p>
    <button @click="handleLogout">
      EXIT
    </button>

    <hr />

    <TaskCreateForm />

    <div>
      <button @click="filter = 'all'" :class="{ active: filter === 'all' }">All</button>
      <button @click="filter = 'active'" :class="{ active: filter === 'active' }">Active</button>
      <button @click="filter = 'done'" :class="{ active: filter === 'done' }">Done</button>
    </div>

    <p v-if="error" class="error">Error: {{ error }}</p>

    <p v-if="isLoading">Loading Tasks ・・・</p>
    <p v-else-if="filteredTasks.length === 0">
      {{ filter === 'all' ? "There are no tasks yet" : filter === 'active' ? "No active tasks" : "No completed tasks" }}
    </p>

    <ul v-else>
      <li v-for="task in filteredTasks" :key="task.id">
        <input
          type="checkbox"
          :checked="task.status === 'done'"
          @change="toggleStatus(task.id, task.status)" 
        />
        <span :class="{ done: task.status === 'done' }">
          {{ task.title }} - {{ task.priority }}
        </span>
        <button @click="handleDelete(task.id)">
          Delete
        </button>
      </li>
    </ul>
</template>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}

button.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>