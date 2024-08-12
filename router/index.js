import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        redirect: '/login' // 将根路径重定向到登录页面  
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue")
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router