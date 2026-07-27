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
  <div class="page">
    <div class="page-header">
      <div>
        <h1>TaskFlow</h1>
        <span class="user-tag mono">{{ user?.email?.split('@')[0] }}</span>
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

    <TaskBoard />
  </div>
</template>

<style scoped>
.page-header__actions {
  display: flex;
  gap: 10px;
  align-items: center;
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
</style>