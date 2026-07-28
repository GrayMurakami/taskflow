<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'
import TaskBoard from '@/widgets/TaskBoard.vue'
import TaskCreateForm from '@/features/task-create/TaskCreateForm.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const { logout, user } = useAuth();
const router = useRouter();
const showModal = ref(false);

async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>

<template>
  <div class="page-header">
    <div class="page-header__inner">
      <div class="brand-row">
        <h1>
          <span class="brand-task">Task</span>
          <span class="brand-flow">Flow</span>
        </h1>
        <span class="user-tag mono">
          {{ user?.email?.split('@')[0] }}
        </span>
      </div>
      <div class="page-header__actions">
        <BaseButton
          @click="showModal = true"
        >
          + New Task
        </BaseButton>
        <ThemeToggle />
        <BaseButton 
          variant="secondary" 
          @click="handleLogout"
        >
          Exit
        </BaseButton>
      </div>
    </div>
  </div>

  <div 
    v-if="showModal"
    class="modal-overlay"
    @click="showModal = false"
  >
    <div
      class="modal-card"
      @click.stop
    >
      <TaskCreateForm
        @created="showModal = false"
      />
    </div>
  </div>

  <div class="page">
    <TaskBoard />
  </div>
</template>

<style scoped>
.page-header {
  background: var(--color-surface-raised);
  border-bottom: 1px solid var(--color-border);
  padding: 14px 24px;
}

.page-header__inner {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header__actions {
  display: flex;
  gap: 13px;
  align-items: center;
}

.brand-flow { 
  color: var(--color-ink); 
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-tag {
  border-left: 1px solid var(--color-border);
  padding-left: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  top: 1px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 12, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 50;
}

.modal-card {
  background: var(--color-surface-raised);
  border-radius: 18px;
  padding: 28px;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-card);
  max-height: 86vh;
  overflow: auto;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 80px;
}

@media (max-width: 480px) {
  .page-header__inner {
    flex-wrap: wrap;
    gap: 10px;
    row-gap: 8px;
  }
  .page-header__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>