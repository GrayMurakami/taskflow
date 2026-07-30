import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuth } from '@/entities/user/useAuth'
import App from '@/App.vue'
import router from '@/app/router'
import './style.css'

async function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());

  const { initAuth } = useAuth();
  await initAuth();

  app.use(router);
  app.mount('#app');
}

bootstrap();
