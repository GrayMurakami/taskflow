import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './app/router'
import { useAuth } from '@/entities/user/useAuth'

async function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());

  const { initAuth } = useAuth();
  await initAuth();

  app.use(router);
  app.mount('#app');
}

bootstrap();
