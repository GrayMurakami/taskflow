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
const tagDraft = ref('');
const tagMenuOpen = ref(false);
const selectedTags = ref<string[]>([]);
const subTaskInput = ref('');

const emit = defineEmits<{
  created: []
}>();

const existingTags = computed(() => 
  Array.from(new Set(tasks.value.flatMap((t) => t.tags))).sort()
);

const draftLower = computed(() => tagDraft.value.trim().toLowerCase());

const tagSuggestions = computed(() =>
  existingTags.value
    .filter((t) => !selectedTags.value.includes(t))
    .filter((t) => !draftLower.value || t.toLowerCase().includes(draftLower.value))
);

const showCreateTagOption = computed(() =>
  draftLower.value.length > 0 && !existingTags.value.some((t) => t.toLowerCase() === draftLower.value)
);

function addTag(name: string) {
  const clean = name.trim().toLowerCase();

  if (!clean) return
  if (!selectedTags.value.includes(clean)) {
    selectedTags.value.push(clean);
  }
  tagDraft.value = '';
}

function removeTag(name: string) {
  selectedTags.value = selectedTags.value.filter((t) => t !== name);
}

function onTagKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addTag(tagDraft.value);
  } else if (e.key === 'Backspace' && !tagDraft.value && selectedTags.value.length) {
    selectedTags.value.pop();
  }
}

async function handleSubmit() {
  const tags = selectedTags.value.slice();

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
    selectedTags.value = [];
    tagDraft.value = '';
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
      autofocus
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

    <div class="tag-picker">
      <div
        class="tag-picker__field"
        @click="tagMenuOpen = true"
      >
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="tag-picker__chip mono"
        >
          {{ tag }}
            <span
              class="tag-picker__chip-remove"
              @click.stop="removeTag(tag)"
            >×</span>
        </span>

        <input
          v-model="tagDraft"
          class="tag-picker__input"
          :placeholder="selectedTags.length ? 'Add another…' : 'Tags, comma separated (optional)'"
          @keydown="onTagKeyDown"
          @focus="tagMenuOpen = true"
          maxlength="30"
        />
      </div>

      <div
        v-if="tagMenuOpen && (tagSuggestions.length || showCreateTagOption)"
        class="tag-picker__backdrop"
        @click="tagMenuOpen = false"
      ></div>

      <div
        v-if="tagMenuOpen  && (tagSuggestions.length || showCreateTagOption)"
        class="tag-picker__menu"
      >
        <button
          v-for="s in tagSuggestions"
          :key="s"
          type="button"
          class="tag-picker__item"
          @click="addTag(s); tagMenuOpen = false"
        >
          {{ s }}
        </button>
        <button
          v-if="showCreateTagOption"
          type="button"
          class="tag-picker__item tag-picker__item--create"
          @click="addTag(tagDraft); tagMenuOpen = false"
        >
          + Create "{{ tagDraft }}"
        </button>
      </div>
    </div>

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

.tag-picker { 
  position: relative;
}

.tag-picker__field {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  min-height: 42px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface-raised);
  cursor: text;
}

.tag-picker__chip {
  background: var(--color-secondary);
  color: var(--color-secondary-text);
  font-size: 11px;
  padding: 3px 6px 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tag-picker__chip-remove { 
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
}

.tag-picker__input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 90px;
  font-size: 14px;
  font-family: var(--font-body);
  background: transparent;
  color: var(--color-text);
  padding: 2px 0;
}

.tag-picker__backdrop { 
  position: fixed;
  inset: 0;
  z-index: 9;
}

.tag-picker__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--color-surface-raised);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  padding: 6px;
  z-index: 10;
  max-height: 160px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tag-picker__item {
  text-align: left;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-family: var(--font-body);
  cursor: pointer;
  background: transparent;
  color: var(--color-text);
}

.tag-picker__item:hover { 
  background: rgba(127, 127, 127, 0.22);
}

.tag-picker__item--create { 
  color: var(--color-ink);
  font-weight: 600;
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
