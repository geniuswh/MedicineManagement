import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'

function safeParse(str, fallback = {}) {
  try {
    if (!str || str === 'undefined' || str === 'null') return fallback
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(safeParse(localStorage.getItem('userInfo')))
  const permissions = ref(safeParse(localStorage.getItem('permissions'), []))

  const isLoggedIn = computed(() => !!token.value)

  // 登录
  async function handleLogin(credentials) {
    try {
      const res = await request({
        url: '/auth/login',
        method: 'post',
        data: credentials
      })
      
      token.value = res.token
      userInfo.value = res.userInfo
      permissions.value = res.permissions || []
      
      localStorage.setItem('token', res.token)
      localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
      localStorage.setItem('permissions', JSON.stringify(permissions.value))
      
      return res
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const res = await request({
        url: '/auth/info',
        method: 'get'
      })
      
      userInfo.value = res
      permissions.value = res.permissions || []
      
      localStorage.setItem('userInfo', JSON.stringify(res))
      localStorage.setItem('permissions', JSON.stringify(permissions.value))
      
      return res
    } catch (error) {
      throw error
    }
  }

  // 检查权限
  function hasPermission(permission) {
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(permission)
  }

  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = {}
    permissions.value = []
    
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('permissions')
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    handleLogin,
    fetchUserInfo,
    hasPermission,
    logout
  }
})
