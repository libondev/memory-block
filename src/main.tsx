import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { RouterView } from 'vue-router'

import router from './router'

import { initToast } from '@/composables/use-toast'

import './styles'

const app = createApp(<RouterView />)

app.use(createPinia())
app.use(router)

app.mount('#app')

initToast()
