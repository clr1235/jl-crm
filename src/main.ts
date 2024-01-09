import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import preview from 'vue3-image-preview'

import router from './router'

import '@/permission'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'

const pinia = createPinia()
const app = createApp(App)

// store
app.use(pinia)
// 路由
app.use(router)
// 图片预览组件
app.use(preview)

router.isReady().then(() => {
	app.mount('#app')
})
