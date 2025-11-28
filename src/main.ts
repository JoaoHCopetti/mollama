import '@/css/main.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => console.clear())
}

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.mount('#app')
