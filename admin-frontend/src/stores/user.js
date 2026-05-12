import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function safeParse(str, fallback = {}) {
  try {
    if (!str || str === 'undefined' || str === 'null') return fallback
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const userInfo = ref(safeParse(localStorage.getItem('admin_userInfo')))
  const permissions = ref(safeParse(localStorage.getItem('admin_permissions'), []))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value.role === 'admin')

  // 登录
  function handleLogin(data) {
    token.value = data.token
    userInfo.value = data.userInfo
    permissions.value = data.permissions || []
    
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_userInfo', JSON.stringify(data.userInfo))
    localStorage.setItem('admin_permissions', JSON.stringify(permissions.value))
  }

  // 检查权限
  function hasPermission(permission) {
    if (isAdmin.value) return true
    return permissions.value.includes(permission)
  }

  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = {}
    permissions.value = []
    
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_userInfo')
    localStorage.removeItem('admin_permissions')
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    isAdmin,
    handleLogin,
    hasPermission,
    logout
  }
})
