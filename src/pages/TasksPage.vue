<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'
import TaskBoard from '@/widgets/TaskBoard.vue'

const { logout, user } = useAuth();
const router = useRouter();

async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>

<template>
  <p>Tasks page. Hello, {{ user?.email?.split('@')[0] }}</p>
  <button @click="handleLogout">
    EXIT
  </button>

  <hr />

  <TaskBoard />
</template>

<style scoped>
</style>