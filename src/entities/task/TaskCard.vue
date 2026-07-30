<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from './Task.types'
import BaseButton from '@/shared/ui/BaseButton.vue'

const props = withDefaults(defineProps<{
  task: Task
  showTags?: boolean
}>(), {
  showTags: true
});

const emit = defineEmits<{
  markDone: [id: string]
  delete: [id: string] 
  toggleSubtask: [taskId: string, subtaskId: string]
  dragStart: [id: string]
  dragOverCard: [id: string]
  dragEnd: []
}>();

const expanded = ref(false);
const isDone = computed(() => props.task.status === 'done');
const hasSubtasks = computed(() => props.task.subtasks.length > 0);
const doneCount = computed(() => props.task.subtasks.filter(s => s.done).length);

const isOverdue = computed(() => {
  if (!props.task.deadline || isDone.value) return false
  return new Date(props.task.deadline) < new Date()
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })
}
</script>

<template>
  <li
    class="ticket" 
    :class="{ done: isDone}"
    draggable="true"
    @dragstart="emit('dragStart', task.id)"
    @dragenter.prevent="emit('dragOverCard', task.id)"
    @dragover.prevent
    @dragend="emit('dragEnd')"
  >
    <div class="ticket__flag" :class="`priority-${task.priority}`"></div>

    <BaseButton 
      class="ticket__delete" 
      variant="danger" 
      @click="emit('delete', task.id)"
      aria-label="Delete task"
    >
      <span class="ticket__delete-x"></span>
    </BaseButton>

    <div class="ticket__body">
      <div class="ticket__top">
        <button
          v-if="!isDone"
          class="ticket__check"
          @click="emit('markDone', task.id)"
          aria-label="Mark done"
        >
          <span class="ticket__check-icon"></span>
        </button>
        <div v-else class="ticket__stamp">DONE</div>
        <h3 class="ticket__title">{{ task.title }}</h3>
      </div>

      <p v-if="task.description" class="ticket__description">{{ task.description }}</p>

      <div v-if="showTags && task.tags.length" class="ticket__tags">
        <span 
          v-for="tag in task.tags"
          :key="tag"
          class="ticket__tag mono"
        >
          {{ tag }}
        </span>
      </div>

      <div class="ticket__meta mono">
        <span v-if="task.deadline" :class="{ overdue: isOverdue }">due: {{ formatDate(task.deadline) }}</span>
        <button 
          v-if="hasSubtasks"
          class="ticket__subs"
          :class="{ active: expanded }"
          @click="expanded = !expanded"
        >
          {{ doneCount }}/{{ task.subtasks.length }} subtasks
        </button>
      </div>

      <div v-if="expanded && hasSubtasks" class="ticket__subtasks">
        <label 
          v-for="st in task.subtasks"
          :key="st.id"
          class="ticket__subtask"
          :class="{ done: st.done }"
        >
          <input 
            type="checkbox"
            :checked="st.done"
            @change="emit('toggleSubtask', task.id, st.id)" 
          />
          <span>{{ st.text }}</span>
        </label>
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
  cursor: grab;
  transition: box-shadow 0.2s ease, opacity 0.2s ease;
  transform: translateZ(0);
}

.ticket:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.ticket__flag {
  width: 6px;
  flex-shrink: 0;
  border-radius: var(--radius) 0 0 var(--radius);
}

.ticket__check-icon {
  display: block;
  width: 8px;
  height: 5px;
  border-left: 2px solid var(--color-text-muted);
  border-bottom: 2px solid var(--color-text-muted);
  transform: rotate(-45deg) translate(1px, -1px);
}

.priority-low {
  background: linear-gradient(180deg, var(--priority-low), color-mix(in srgb, var(--priority-low) 60%, black));
}
.priority-medium {
  background: linear-gradient(180deg, var(--priority-medium), color-mix(in srgb, var(--priority-medium) 60%, black));
}
.priority-high {
  background: linear-gradient(180deg, var(--priority-high), color-mix(in srgb, var(--priority-high) 60%, black));
}

.ticket__delete {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.ticket__delete:hover { 
  background: var(--color-danger); 
}

.ticket__delete-x { 
  position: relative; 
  width: 10px; 
  height: 10px; 
  display: block; 
}

.ticket__delete-x::before, .ticket__delete-x::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 11px; height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.ticket__delete-x::before { 
  transform: translate(-50%, -50%) rotate(45deg); 
}

.ticket__delete-x::after { 
  transform: translate(-50%, -50%) rotate(-45deg); 
}

.ticket__body { 
  flex: 1; 
  padding: 14px 16px 14px 15px; 
  min-width: 0; 
  padding-right: 32px; 
}

.ticket__top { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.ticket__check {
  width: 22px;
  height: 22px;
  border: 1.5px solid var(--color-text-muted);
  border-radius: 50%;
  background: transparent;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.ticket__check:hover { 
  transform: scale(1.15); 
}

.ticket__title { 
  font-size: 15px; 
  font-weight: 600; 
  word-break: break-word; 
}

.ticket.done .ticket__title { 
  text-decoration: line-through; 
  color: var(--color-text-muted); 
}

.ticket__stamp {
  flex-shrink: 0;
  padding: 3px 10px;
  border: 2px solid var(--color-success);
  border-radius: 4px;
  color: var(--color-success);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.1em;
  transform: rotate(-6deg);
}

.ticket__description { 
  margin: 6px 0 0; 
  font-size: 13px; 
  color: var(--color-text-muted); 
}

.ticket__tags { 
  display: flex; 
  gap: 6px; 
  flex-wrap: wrap; 
  margin-top: 8px; 
}

.ticket__tag {
  background: var(--color-secondary);
  color: var(--color-secondary-text);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
}

.ticket__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 9px;
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-wrap: wrap;
}

.ticket__meta .overdue { 
  color: var(--color-danger); 
  font-weight: 700; 
}

.ticket__subs {
  margin-left: auto;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: none;
  cursor: pointer;
  background: var(--color-secondary);
  color: var(--color-secondary-text);
}

.ticket__subs.active { 
  background: var(--color-ink); 
  color: var(--color-ink-text); 
}

.ticket__subtasks {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ticket__subtask { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 12px; 
  cursor: pointer; 
  color: var(--color-text); 
}

.ticket__subtask.done { 
  color: var(--color-text-muted); 
  text-decoration: line-through; 
}
</style>
