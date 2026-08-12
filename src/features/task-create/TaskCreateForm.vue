<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasks } from '@/entities/task/useTasks'
import type { NewTask } from '@/entities/task/Task.types'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'

const { tasks, createTask, isLoading, error } = useTasks();

const title = ref('');
const description = ref('');
const priority = ref<NewTask['priority']>('medium');
const deadline = ref('');
const tagsInput = ref('');
const selectedTags = ref<Set<string>>(new Set());
const subTaskInput = ref('');

const emit = defineEmits<{
  created: []
}>();

const existingTags = computed(() => 
  Array.from(new Set(tasks.value.flatMap((t) => t.tags))).sort()
);

function toggleExistingTag(tag: string) {
  if (selectedTags.value.has(tag)) {
    selectedTags.value.delete(tag);
  } else {
    selectedTags.value.add(tag);
  }
}

function normalizeTags(rawList: string[]) {
  const set = new Set<string>();

  for (const raw of rawList) {
    const clean = raw.trim().toLocaleLowerCase();
    if (clean) set.add(clean)
  }
  return Array.from(set);
}

async function handleSubmit() {
  const typedTags = tagsInput.value.split(',');
  const tags = normalizeTags([...selectedTags.value, ...typedTags]);

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
    title.value = '';
    description.value = '';
    priority.value = 'medium';
    deadline.value = '';
    tagsInput.value = '';
    selectedTags.value = new Set();
    subTaskInput.value = '';
    emit('created');
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="create-form">
    <h3 class="create-form__title">
      New Task
    </h3>
    <BaseInput
      v-model="title"
      type="text"
      placeholder="Task name"
      maxlength="50"
      required 
    />
    <BaseTextarea 
      v-model="description" 
      placeholder="Description (optional)"
      class="create-form__area"
      maxlength="200"
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

    <label class="field-label mono">
      Deadline:
    </label>
    <BaseInput
      v-model="deadline"
      type="date"
    />

    <div
      v-if="existingTags.length"
      class="existing-tags" 
    >
      <button
        v-for="tag in existingTags"
        :key="tag"
        type="button"
        class="existing-tag mono"
        :class="{ active: selectedTags.has(tag) }"
        @click="toggleExistingTag(tag)"
      >
        {{ tag }}
      </button>

    </div>
    <BaseInput
      v-model="tagsInput"
      type="text"
      placeholder="Tags, comma separated (optional)"
      maxlength="50"
    />

    <BaseTextarea
      v-model="subTaskInput"
      placeholder="Subtasks, one per line (optional)"
      class="create-form__area"
      maxlength="300"
    />

    <div class="create-form__actions">
      <BaseButton
        type="button"
        variant="secondary"
        @click="emit('created')"
      >
        Cancel
      </BaseButton>
      <BaseButton 
        type="submit" 
        :disabled="isLoading"
      >
        Add task
      </BaseButton>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
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

.create-form__title { 
  font-size: 18px; 
  margin: 0 0 4px; 
}

.create-form__actions { 
  display: flex; 
  gap: 10px; 
  margin-top: 4px; 
}

.create-form__actions .base-button { 
  flex: 1; 
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

.existing-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.existing-tag {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11px;
  text-transform: uppercase;
  cursor: pointer;
}

.existing-tag.active {
  background: var(--color-ink);
  color: var(--color-ink-text);
  border-color: var(--color-ink);
}

.field-label {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: -6px;
}

.error { 
  color: var(--color-danger); 
  font-size: 13px; 
  margin: 0; 
}
</style>
