import { defineStore } from 'pinia'
import router from '@/router'

const baseUrl = (import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:9091/' : '')).replace(/\/$/, '')
const url = baseUrl + '/auth/token'

interface UserData {
  token: string
  username: string
  description: string
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{}') as UserData,
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
        await this.setUserData({
          token: result.token,
          username: result.username,
          description: result.description,
        })
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
      await this.removeUserData()
      await router.push('/auth/login')
    },
    async setUserData (user: UserData) {
      this.token = user.token
      this.user = user
      localStorage.setItem('token', user.token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    async removeUserData () {
      this.token = null
      this.user = {} as UserData
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
