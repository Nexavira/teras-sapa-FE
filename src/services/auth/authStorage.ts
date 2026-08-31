const AUTH_TOKEN_KEY = 'teras_sapa_access_token'
const AUTH_USER_KEY = 'teras_sapa_user'

export type AuthUser = {
  user_uuid: string
  email: string
  role: {
    uuid: string
    name: string
  }
}

const canUseStorage = () => typeof window !== 'undefined'

export const getAuthToken = () =>
  canUseStorage() ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null

export const hasAuthToken = () => Boolean(getAuthToken())

export const saveAuthSession = (token: string, user: AuthUser) => {
  if (!canUseStorage()) return

  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const clearAuthSession = () => {
  if (!canUseStorage()) return

  window.localStorage.removeItem(AUTH_TOKEN_KEY)
  window.localStorage.removeItem(AUTH_USER_KEY)
}
