import { defineStore } from 'pinia'
import router from '@/router'

const baseUrl = (import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:9091/' : '')).replace(/\/$/, '')
const url = baseUrl + '/auth/token'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: localStorage.getItem('token'),
    returnUrl: null,
  }),
  getters: {
    isAuthenticated (): boolean {
      return !!this.token
    },
  },
  actions: {
    async login (username: string, password: string) {
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()
      if ('token' in result) {
        await this.setToken(result.token)
        await router.push(this.returnUrl || '/app/overview')
        this.returnUrl = null
      } else {
        if ('message' in result) {
          return Promise.reject(result.message)
        } else {
          return Promise.reject(response.statusText)
        }
      }
    },
    async logout () {
      await this.removeToken()
      await router.push('/auth/login')
    },
    async setToken (token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    async removeToken () {
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
