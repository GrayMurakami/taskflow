<script setup lang="ts">
import { onMounted, ref, computed} from 'vue'
import { useTasks } from '@/entities/task/useTasks'
import TaskCard from '@/entities/task/TaskCard.vue'
import TaskCreateForm from '@/features/task-create/TaskCreateForm.vue'
import TaskFilter from '@/features/task-filter/TaskFilter.vue'

const { tasks, isLoading, error, fetchTasks, updateTask, deleteTask } = useTasks();

const filter = ref<'all' | 'active' | 'done'>('all');

const filteredTasks = computed(() => {
  if (filter.value === 'all') return tasks.value;
  return tasks.value.filter((task) => task.status === filter.value);
});

onMounted(() => {
  fetchTasks()
});

async function handleToggleStatus(id: string, currentStatus: 'active' | 'done') {
  const newStatus = currentStatus === 'active' ? 'done' : 'active';
  const success = await updateTask(id, { status: newStatus });

  if (!success) {
    console.error("Failed to update the task status!");
  }
}

async function handleDelete(id: string) {
  const success = await deleteTask(id);

  if (!success) {
    console.error("Failed to delete the task!");
  }
}
</script>

<template>
  <TaskCreateForm />

  <TaskFilter v-model="filter" />

  <p v-if="error" class="error">Error: {{ error }}</p>

  <p v-if="isLoading">Loading Tasks ・・・</p>
  <p v-else-if="filteredTasks.length === 0">
    {{
      filter === 'all'
        ? 'There are no tasks yet'
        : filter === 'active'
          ? 'No active tasks'
          : 'No completed tasks'
    }}
  </p>

  <ul v-else>
    <TaskCard
      v-for="task in filteredTasks"
      :key="task.id"
      :task="task"
      @toggle-status="handleToggleStatus"
      @delete="handleDelete"
    />
  </ul>
</template>

<style scoped>

</style>
