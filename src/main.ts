import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

router.isReady().then(() => {
	app.mount('#app')
})
