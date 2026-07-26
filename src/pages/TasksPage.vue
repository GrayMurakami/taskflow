<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'
import TaskBoard from '@/widgets/TaskBoard.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import BaseButton from '@/shared/ui/BaseButton.vue';

const { logout, user } = useAuth();
const router = useRouter();

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
        <ThemeToggle />
        <BaseButton variant="secondary" @click="handleLogout">Exit</BaseButton>
      </div>
    </div>

    <TaskBoard />
  </div>
</template>

<style scoped>
.page-header__actions {
  display: flex;
  gap: 10px;
}
</style>