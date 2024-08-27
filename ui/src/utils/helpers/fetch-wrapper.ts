import { useAuthStore } from '@/stores/auth'

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
}

interface temp {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

function request (method: string) {
  return (url: string, body?: object) => {
    const requestOptions: temp = {
      method,
      headers: authHeader(url),
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    return fetch(url, requestOptions).then(handleResponse)
  }
}

function authHeader (url: string): Record<string, string> {
  const authStore = useAuthStore()
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_BASE_URL)
  if (authStore.isAuthenticated && isApiUrl) {
    return { Authorization: `Bearer ${authStore.token}` }
  } else {
    return {}
  }
}

async function handleResponse (response: Response): Promise<any> { // eslint-disable-line
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      const { isAuthenticated, logout } = useAuthStore()
      if ([401, 403].includes(response.status) && isAuthenticated) {
        logout()
      }

      const error: string = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
