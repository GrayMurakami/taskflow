<script setup lang="ts">
import { ref } from 'vue'
import { useTasks } from '@/entities/task/useTasks'
import type { NewTask } from '@/entities/task/Task.types'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'

const { createTask, isLoading, error } = useTasks();

const title = ref('');
const description = ref('');
const priority = ref<NewTask['priority']>('medium');
const deadline = ref('');
const tagsInput = ref('');
const subTaskInput = ref('');

const emit = defineEmits<{
  created: []
}>();

async function handleSubmit() {
  const tags = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const subtasks = subTaskInput.value
    .split('\n')
    .map(t => t.trim())
    .filter(Boolean)
    .map((text, i) => ({ id: `new-${Date.now()}-${i}`, text, done: false }));

  const success = await createTask({
    title: title.value,
    description: description.value || null,
    priority: priority.value,
    deadline: deadline.value || null,
    tags,
    subtasks,
  });

  if (success) {
    title.value = ''
    description.value = ''
    priority.value = 'medium'
    deadline.value = ''
    tagsInput.value = ''
    subTaskInput.value = ''
    emit('created')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="create-form">
    <BaseInput
      v-model="title"
      type="text"
      placeholder="Task name"
      required 
    />
    <BaseTextarea 
      v-model="description" 
      placeholder="Description (optional)"
      class="create-form__area"
    />

    <div class="priority-switch">
      <button
        type="button"
        class="priority-switch__opt"
        :class="{ active: priority === 'low' }"
        @click="priority = 'low'"
        style="--pc: var(--priority-low)"
      >
        Low
      </button>
      <button
        type="button"
        class="priority-switch__opt"
        :class="{ active: priority === 'medium' }"
        @click="priority = 'medium'"
        style="--pc: var(--priority-medium)"
      >
        Medium
      </button>
      <button
        type="button"
        class="priority-switch__opt"
        :class="{ active: priority === 'high' }"
        @click="priority = 'high'"
        style="--pc: var(--priority-high)"
      >
        High
      </button>
    </div>

    <BaseInput
      v-model="deadline"
      type="date"
    />
    <BaseInput
      v-model="tagsInput"
      type="text"
      placeholder="Tags, comma separated (optional)"
    />
    <BaseTextarea
      v-model="subTaskInput"
      placeholder="Subtasks, one per line (optional)"
      class="create-form__area"
    />

    <p v-if="error" class="error">{{ error }}</p>

    <BaseButton type="submit" :disabled="isLoading">
      Add task
    </BaseButton>
  </form>
</template>

<style scoped>
.create-form { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  margin-bottom: 24px; 
}

.create-form__area { 
  resize: vertical; 
  min-height: 56px; 
}

.priority-switch { 
  display: flex; 
  gap: 6px; 
  background: var(--color-secondary); 
  border-radius: var(--radius); 
  padding: 4px; 
}

.priority-switch__opt {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  background: transparent;
  color: var(--color-text-muted);
}
.priority-switch__opt.active { 
  background: var(--pc); 
  color: var(--color-ink-text); 
}

.error { 
  color: var(--color-danger); 
  font-size: 13px; 
  margin: 0; 
}
</style>
