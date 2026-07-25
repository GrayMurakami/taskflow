import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark';

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) ?? 'light');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
});

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggleTheme }
}
