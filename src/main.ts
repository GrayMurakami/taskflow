import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router, { setAuthReadyPromise } from '@/app/router'
import { useAuth } from '@/entities/user/useAuth'
import App from '@/App.vue'
import '@/style.css'

const app = createApp(App);
app.use(createPinia());
app.use(router);

const { initAuth } = useAuth();
setAuthReadyPromise(initAuth());

app.mount('#app');
