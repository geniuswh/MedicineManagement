import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台', icon: 'Monitor' }
      },
      {
        path: 'product',
        name: 'Product',
        redirect: '/product/medicine',
        meta: { title: '产品管理', icon: 'Box' },
        children: [
          {
            path: 'medicine',
            name: 'Medicine',
            component: () => import('@/views/product/medicine.vue'),
            meta: { title: '药品管理' }
          },
          {
            path: 'device',
            name: 'Device',
            component: () => import('@/views/product/device.vue'),
            meta: { title: '医疗器械' }
          }
        ]
      },
      {
        path: 'inventory',
        name: 'Inventory',
        redirect: '/inventory/records',
        meta: { title: '库存管理', icon: 'DataBoard' },
        children: [
          {
            path: 'records',
            name: 'Records',
            component: () => import('@/views/inventory/records.vue'),
            meta: { title: '出入库记录' }
          },
          {
            path: 'stock',
            name: 'Stock',
            component: () => import('@/views/inventory/stock.vue'),
            meta: { title: '库存查询' }
          },
          {
            path: 'warning',
            name: 'Warning',
            component: () => import('@/views/inventory/warning.vue'),
            meta: { title: '库存预警' }
          }
        ]
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/statistics/index.vue'),
        meta: { title: '数据统计', icon: 'DataAnalysis' }
      },
      {
        path: 'user',
        name: 'UserManage',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'role',
        name: 'RoleManage',
        component: () => import('@/views/role/index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/log/index.vue'),
        meta: { title: '操作日志', icon: 'Document' }
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '后台管理'} - 后台管理`
  
  const token = localStorage.getItem('admin_token')
  
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
