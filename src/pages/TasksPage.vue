<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'
import { useTasks } from '@/entities/task/useTasks'
import TaskCreateForm from '@/features/task-create/TaskCreateForm.vue'

const { logout, user } = useAuth();
const { tasks, isLoading, error, fetchTasks } = useTasks();
const router = useRouter();

onMounted(() => {
  fetchTasks()
});

async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>

<template>
    <p>Tasks page. Hello, {{ user?.email?.split('@')[0] }}</p>
    <button @click="handleLogout">
      EXIT
    </button>

    <hr />

    <TaskCreateForm />

    <p v-if="isLoading">Loading Tasks ・・・</p>
    <p v-else-if="error">Tasks Error: {{ error }}</p>
    <p v-else-if="tasks.length === 0">There are no tasks yet.</p>

    <ul v-else>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} - {{ task.priority }} - {{ task.status }}
      </li>
    </ul>
</template>
