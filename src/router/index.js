import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  { path: '/login', component: () => import('@/views/login') },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      { path: '', component: () => import('@/views/home') },
      { path: '/qa', component: () => import('@/views/qa') },
      { path: '/my', component: () => import('@/views/my') },
      { path: '/video', component: () => import('@/views/video') }
    ]
  },
  { path: '/search', component: () => import('@/views/search') },
  { path: '/article/:articleId', component: () => import('@/views/article'), props: true },
  { path: '/user/profile', component: () => import('@/views/user-profile') }
]

const router = new VueRouter({
  routes
})

export default router
