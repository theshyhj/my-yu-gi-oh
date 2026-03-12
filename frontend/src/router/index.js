import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/cards',
    name: 'CardLibrary',
    component: () => import('../views/CardLibrary.vue')
  },
  {
    path: '/gacha',
    name: 'Gacha',
    component: () => import('../views/Gacha.vue')
  },
  {
    path: '/collection',
    name: 'MyCollection',
    component: () => import('../views/MyCollection.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/decks',
    name: 'DeckList',
    component: () => import('../views/DeckList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/decks/:id',
    name: 'DeckEdit',
    component: () => import('../views/DeckEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cards',
    name: 'AdminCards',
    component: () => import('../views/admin/CardList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/cards/new',
    name: 'AdminCardNew',
    component: () => import('../views/admin/CardForm.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/cards/:id/edit',
    name: 'AdminCardEdit',
    component: () => import('../views/admin/CardForm.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin && user.role !== 'admin') {
    next('/')
  } else {
    next()
  }
})

export default router
