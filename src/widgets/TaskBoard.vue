<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useTasks } from '@/entities/task/useTasks'
import TaskCard from '@/entities/task/TaskCard.vue'

const { tasks, isLoading, error, fetchTasks, updateTask, deleteTask } = useTasks();

const search = ref('');
const sortBy = ref<'created' | 'deadline' | 'manual' | 'priority'>('manual');
const sortMenuOpen = ref(false);
const activeTag = ref<string | null>(null);
const showTags = ref(true);
const draggedId = ref<string | null>(null);

onMounted(() => {
  fetchTasks()
});

const sortOptions: { value: 'created' | 'deadline' | 'manual' | 'priority'; label: string }[] = [ 
  {
    value: 'created', 
    label: 'Newest first'
  },
  { 
    value: 'deadline', 
    label: 'By deadline'
  },
  {
    value: 'manual',
    label: 'Custom order'
  },
  {
    value: 'priority',
    label: 'By priority'
  },
];

const sortLabel = computed(() => sortOptions.find(o => o.value === sortBy.value)?.label ?? '');

const allTags = computed(() => Array.from(new Set(tasks.value.flatMap(t => t.tags))));

const rank = {
  low: 0,
  medium: 1,
  high: 2
};

const filteredSorted = computed(() => {
  const q = search.value.trim().toLowerCase();
  let list = tasks.value.filter(t => {
    if (q && !(t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q))) return false;
    if (activeTag.value && !t.tags.includes(activeTag.value)) return false;
    return true;
  });

  if (sortBy.value === 'manual') {
    list = list.slice().sort((a, b) => a.order - b.order);
  } else if (sortBy.value === 'priority') {
    list = list.slice().sort((a, b) => rank[b.priority] - rank[a.priority]);
  } else if (sortBy.value === 'deadline') {
    list = list.slice().sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  } else { 
    list = list.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  return list;
});

const colTodo = computed(() => filteredSorted.value.filter(t => t.status === 'todo'));
const colProgress = computed(() => filteredSorted.value.filter(t => t.status === 'inprogress'));
const colDone = computed(() => filteredSorted.value.filter(t => t.status === 'done'));

const stats = computed(() => {
  const total = tasks.value.length;
  const done = tasks.value.filter(t => t.status === 'done').length;
  const progress = tasks.value.filter(t => t.status === 'inprogress').length;
  const overdue = tasks.value.filter(t => t.deadline && t.status !== 'done' && new Date(t.deadline) < new Date()).length;
  return {
    total,
    progress,
    overdue,
    pct: total ? Math.round((done / total) * 100) : 0
  };
});

async function handleMarkDone(id: string) {
  await updateTask(id, { status: 'done' });
}

async function handleDelete(id: string) {
  const success = await deleteTask(id);

  if (!success) {
    console.error("Failed to delete the task!");
  }
}

async function handleToggleSubtask(taskId: string, subtaskId: string) {
  const task = tasks.value.find(t => t.id === taskId);
  if (!task) return;
  
  const subtasks = task.subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s);
  await updateTask(taskId, { subtasks });
}

function onDragStart(id: string) {
  draggedId.value = id;
  sortBy.value = 'manual';
}

function onDragEnd() {
  draggedId.value = null;
}

async function reorderWithin(targetId: string) {
  if (!draggedId.value || draggedId.value === targetId) return;
  const dragged = tasks.value.find(t => t.id === draggedId.value);
  const target = tasks.value.find(t => t.id === targetId);
  if (!dragged || !target) return;
  await updateTask(dragged.id, { status: target.status, order: target.order - 0.5 });
}

async function dropOnColumn(status: 'todo' | 'inprogress' | 'done') {
  if (!draggedId.value) return;

  await updateTask(draggedId.value, { status });
  draggedId.value = null;
}
</script>

<template>
  <div class="stats">
    <div class="stat-card">
      <span class="stat-card__label mono">
        Total
      </span>
      <span class="stat-card__value">
        {{ stats.total }}
      </span>
    </div>
    <div class="stat-card">
      <span class="stat-card__label mono">
        In Progress
      </span>
      <span 
        class="stat-card__value"
        style="color: var(--priority-medium)"
      >
        {{ stats.progress }}
      </span>
    </div>
    <div class="stat-card">
      <span class="stat-card__label mono">
        Overdue
      </span>
      <span 
        class="stat-card__value"
        style="color: var(--color-danger)"
      >
        {{ stats.overdue }}
      </span>
    </div>
    <div class="stat-card">
      <div class="stat-card__row">
        <span class="stat-card__label mono">
          Completion
        </span>
        <span class="stat-card__value stat-card__value--sm">
          {{ stats.pct }}%
        </span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-bar__fill"
          :style="{ width: stats.pct + '%' }"
        ></div>
      </div>
    </div>
  </div>

  <div class="toolbar">
    <input
      v-model="search"
      placeholder="Search tasks..."
      class="toolbar__search"    
    />
    <div class="sort-dropdown">
      <button
        type="button"
        class="sort-dropdown__trigger"
        @click="sortMenuOpen = !sortMenuOpen"      
      >
        {{ sortLabel }}
        <span
          class="sort-dropdown__chevron"
          :class="{ open: sortMenuOpen }"        
        ></span>
      </button>
      <div
        v-if="sortMenuOpen"
        class="sort-dropdown__backdrop"
        @click="sortMenuOpen = false"
      ></div>
      <div
        v-if="sortMenuOpen"
        class="sort-dropdown__menu"
      >
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          type="button"
          class="sort-dropdown__item"
          :class="{active: sortBy === opt.value }"
          @click="sortBy = opt.value; sortMenuOpen = false"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>

  <div class="tags-row">
    <button
      class="tags-toggle mono"
      @click="showTags = !showTags"
    >
      {{ showTags ? 'Hide tags' : 'Show tags'}}
    </button>
    <div
      v-if="showTags"
      class="tags-row__scroll"
    >
      <button
        class="tag-chip mono"
        :class="{ active: !activeTag }"
        @click="activeTag = null"
      >
        All
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-chip mono"
        :class="{ active: activeTag === tag }"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>
  </div>



  <p v-if="error" class="error">Error: {{ error }}</p>

  <p v-if="isLoading">Loading Tasks ・・・</p>

  <div v-else class="board">
    <div
      class="column"
      @dragover.prevent
      @drop="dropOnColumn('todo')"
    >
      <div class="column__head">
        <span
          class="column__dot"
          style="background: var(--priority-low)"
        ></span>
          To Do
        <span class="column__count mono">
          {{ colTodo.length }}
        </span>
      </div>
      <ul class="column__list">
        <TaskCard
          v-for="task in colTodo"
          :key="task.id"
          :task="task"
          :show-tags="showTags"
          @mark-done="handleMarkDone"
          @delete="handleDelete"
          @toggle-subtask="handleToggleSubtask"
          @drag-start="onDragStart"
          @drag-over-card="reorderWithin"
          @drag-end="onDragEnd"
        />
      </ul>
      <p v-if="!colTodo.length" class="column__empty">No tasks here</p>
    </div>

    <div
      class="column"
      @dragover.prevent
      @drop="dropOnColumn('inprogress')"
    >
      <div class="column__head">
        <span
          class="column__dot"
          style="background: var(--priority-medium)"
        ></span>
          In Progress
        <span class="column__count mono">
          {{ colProgress.length }}
        </span>
      </div>
      <ul class="column__list">
        <TaskCard
          v-for="task in colProgress"
          :key="task.id"
          :task="task"
          :show-tags="showTags"
          @mark-done="handleMarkDone"
          @delete="handleDelete"
          @toggle-subtask="handleToggleSubtask"
          @drag-start="onDragStart"
          @drag-over-card="reorderWithin"
          @drag-end="onDragEnd"
        />
      </ul>
      <p v-if="!colProgress.length" class="column__empty">No tasks here</p>
    </div>

    <div
      class="column"
      @dragover.prevent
      @drop="dropOnColumn('done')"
    >
      <div class="column__head">
        <span
          class="column__dot"
          style="background: var(--color-success)"
        ></span>
          Done
        <span class="column__count mono">
          {{ colDone.length }}
        </span>
      </div>
      <ul class="column__list">
        <TaskCard
          v-for="task in colDone"
          :key="task.id"
          :task="task"
          :show-tags="showTags"
          @mark-done="handleMarkDone"
          @delete="handleDelete"
          @toggle-subtask="handleToggleSubtask"
          @drag-start="onDragStart"
          @drag-over-card="reorderWithin"
          @drag-end="onDragEnd"
        />
      </ul>
      <p v-if="!colDone.length" class="column__empty">No tasks here</p>
    </div>

  </div>
</template>

<style scoped>
.stats { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); 
  gap: 14px; 
  margin-bottom: 22px; 
}

.stat-card { 
  background: var(--color-surface-raised); 
  border-radius: 14px; 
  padding: 16px 18px; 
  box-shadow: var(--shadow-card); 
}

.stat-card__row { 
  display: flex; 
  justify-content: space-between; 
  align-items: baseline; 
}

.stat-card__label { 
  font-size: 11px; 
  color: var(--color-text-muted); 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
}

.stat-card__value { 
  display: block; 
  font-family: var(--font-display); 
  font-size: 26px; 
  font-weight: 700; 
  margin-top: 4px; 
}

.stat-card__value--sm { 
  font-size: 15px; 
  margin-top: 0; 
}

.progress-bar { 
  height: 6px; 
  border-radius: 3px; 
  background: var(--color-secondary); 
  margin-top: 10px; 
  overflow: hidden; 
}

.progress-bar__fill { 
  height: 100%; 
  border-radius: 3px; 
  background: var(--color-ink); 
  transition: width 0.3s ease; 
}

.toolbar { 
  display: flex; 
  gap: 12px; 
  flex-wrap: wrap; 
  margin-bottom: 14px; 
}

.toolbar__search { 
  flex: 1; 
  min-width: 200px; 
  padding: 10px 14px; 
  border: 1px solid var(--color-border); 
  border-radius: var(--radius); 
  font-size: 14px; 
  font-family: var(--font-body); 
  background: var(--color-surface-raised); 
  color: var(--color-text); 
}

.sort-dropdown { 
  position: relative; 
}

.sort-dropdown__trigger {
  display: flex; 
  align-items: center; 
  gap: 8px;
  padding: 10px 14px; 
  border: 1px solid var(--color-border); 
  border-radius: var(--radius);
  font-size: 13px; 
  font-family: var(--font-body); 
  background: var(--color-surface-raised);
  color: var(--color-text); 
  cursor: pointer; 
  white-space: nowrap;
}

.sort-dropdown__chevron {
  width: 0; height: 0;
  border-left: 4px solid transparent; 
  border-right: 4px solid transparent;
  border-top: 5px solid var(--color-text-muted);
  transition: transform 0.15s ease;
}

.sort-dropdown__chevron.open { 
  transform: rotate(180deg); 
}

.sort-dropdown__backdrop { 
  position: fixed; 
  inset: 0; 
  z-index: 9; 
}

.sort-dropdown__menu {
  position: absolute; 
  top: calc(100% + 6px); 
  right: 0; 
  min-width: 190px;
  background: var(--color-surface-raised); 
  border-radius: 12px; 
  box-shadow: var(--shadow-card);
  padding: 6px; 
  z-index: 10; 
  display: flex; 
  flex-direction: column; 
  gap: 2px;
}

.sort-dropdown__item {
  text-align: left; 
  border: none; 
  border-radius: 8px; 
  padding: 9px 12px;
  font-size: 13px; 
  font-family: var(--font-body); 
  cursor: pointer;
  background: transparent; 
  color: var(--color-text);
}

.sort-dropdown__item:hover { 
  background: rgba(127, 127, 127, 0.22); 
}

.sort-dropdown__item.active { 
  background: var(--color-secondary); 
  color: var(--color-secondary-text); 
  font-weight: 600; 
}

.tags-row { 
  display: flex; 
  gap: 8px; align-items: center; 
  margin-bottom: 22px; 
}

.tags-toggle { 
  flex-shrink: 0; 
  background: transparent; 
  color: var(--color-text-muted); 
  border: 1px dashed var(--color-border); 
  border-radius: 20px; 
  padding: 5px 12px; 
  font-size: 11px; text-transform: uppercase; 
  cursor: pointer; 
}

.tags-row__scroll { 
  display: flex; 
  gap: 8px; 
  overflow-x: auto; 
}

.tag-chip { 
  white-space: nowrap; 
  flex-shrink: 0; 
  background: var(--color-secondary); 
  color: var(--color-secondary-text); 
  border: none; 
  border-radius: 20px; 
  padding: 6px 14px; 
  font-size: 12px; 
  text-transform: uppercase; 
  cursor: pointer; 
}

.tag-chip.active { 
  background: var(--color-ink); color: var(--color-ink-text); 
}

.board { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 18px; 
  align-items: start; 
}

.column {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 14px;
  min-height: 160px;
  box-shadow: 0 1px 4px rgba(23, 31, 27, 0.10), 0 4px 12px rgba(23, 31, 27, 0.06);
}

.column__head { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  margin-bottom: 12px; 
  padding: 0 4px; 
  font-family: var(--font-display); 
  font-weight: 600; 
  font-size: 14px; 
}

.column__dot { 
  width: 8px; 
  height: 8px; 
  border-radius: 50%; 
}

.column__count { 
  margin-left: auto; 
  font-size: 11px; 
  color: var(--color-text-muted); 
}

.column__list { 
  list-style: none; 
  margin: 0; 
  padding: 0; 
}

.column__empty { 
  text-align: center; 
  padding: 24px 8px; 
  font-size: 12px; 
  color: var(--color-text-muted); 
}

.error { 
  color: var(--color-danger); 
  }
</style>
