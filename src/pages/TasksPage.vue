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
  <ThemeToggle />

  <p>Tasks page. Hello, {{ user?.email?.split('@')[0] }}</p>
  <BaseButton variant="secondary" @click="handleLogout">
    EXIT
  </BaseButton>

  <hr />

  <TaskBoard />
</template>

<style scoped>
</style>