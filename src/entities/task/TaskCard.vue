<script setup lang="ts">
import type { Task } from './Task.types'
import BaseButton from '@/shared/ui/BaseButton.vue'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggleStatus: [id: string, currentStatus: 'active' | 'done' ]
  delete: [id: string]
}>()

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })
}
</script>

<template>
  <li class="ticket" :class="{ done: task.status === 'done'}">
    <div class="ticket__flag" :class="`priority-${task.priority}`"></div>

    <label class="ticket__check">
      <input
        type="checkbox"
        :checked="task.status === 'done'"
        @change="emit('toggleStatus', task.id, task.status)"
      />
      <span class="ticket__checkmark"></span>
    </label>

    <div class="ticket__perforation"></div>

    <div class="ticket__body">
      <div class="ticket__top">
        <h3 class="ticket__title">{{ task.title }}</h3>
        <div v-if="task.status === 'done'" class="ticket__stamp">DONE</div>
        <BaseButton variant="danger" @click="emit('delete', task.id)">
          Delete
        </BaseButton>
      </div>

      <p v-if="task.description" class="ticket__description">{{ task.description }}</p>

      <div class="ticket__meta mono">
        <span>#{{ task.priority }}</span>
        <span v-if="task.deadline">due {{ formatDate(task.deadline) }}</span>
        <span>{{ formatDate(task.created_at) }}</span>
      </div>
    </div>    
  </li>
</template>

<style scoped>
.ticket {
  position: relative;
  display: flex;
  align-items: stretch;
  background: var(--color-surface-raised);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin-bottom: 12px;
  transition: box-shadow 0.2s ease;
}

.ticket:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.ticket__flag {
  width: 5px;
  flex-shrink: 0;
}

.priority-low {
  background: var(--priority-low);
}
.priority-medium {
  background: var(--priority-medium);
}
.priority-high {
  background: var(--priority-high);
}

.ticket__check {
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
}

.ticket__check input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.ticket__checkmark {
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  display: block;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.ticket__check input:checked + .ticket__checkmark {
  background: var(--color-ink);
  border-color: var(--color-ink);
}

.ticket__check input:checked + .ticket__checkmark::after {
  content: '';
  position: absolute;
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid var(--color-ink-text);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.ticket__perforation {
  width: 0;
  border-left: 2px dashed var(--color-border);
  margin: 12px 0;
}

.ticket__body {
  flex: 1;
  padding: 14px 16px;
  min-width: 0;
}

.ticket__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ticket__title {
  font-size: 15px;
  font-weight: 600;
  word-break: break-word;
  flex: 1;
}

.ticket.done .ticket__title {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.ticket__stamp {
  flex-shrink: 0;
  padding: 3px 10px;
  border: 2px solid var(--color-danger);
  border-radius: 4px;
  color: var(--color-danger);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.1em;
  transform: rotate(-6deg);
  opacity: 0.7;
}

.ticket__description {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.ticket__meta {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
</style>
