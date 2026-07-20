<script setup lang="ts">
import { ref } from 'vue'
import { useTask } from '@/entities/task/useTasks'
import type { NewTask } from '@/entities/task/Task.types'

const { createTask, isLoading } = useTask();



</script>

<template>

</template>