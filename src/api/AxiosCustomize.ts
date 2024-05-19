import { Mutex } from 'async-mutex'
import axiosClient from 'axios'
import { ApiPathEnum } from './ApiPathEnum'
import { CommonResponse } from '../model/common/common-response'
import { CredentialUser } from '../model/auth/current-user'
import { refreshTokenExpiredAction } from '../app/slice/auth.slice'
import { store } from '../app/store'

const instance = axiosClient.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
})

const mutex = new Mutex()
const NO_RETRY_HEADER = 'x-no-retry'

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
    const res = await instance.get<CommonResponse<CredentialUser>>(
      ApiPathEnum.GetUserByRefreshToken,
    )
    if (res?.data && res.status === 200) {
      return res.data?.data?.access_token
    } else return null
  })
}

instance.interceptors.request.use(function (config) {
  if (window?.localStorage?.getItem('access_token')) {
    config.headers.Authorization = `Bearer ${window.localStorage.getItem(
      'access_token',
    )}`
  }
  if (!config.headers.Accept && config.headers['Content-Type']) {
    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
  }
  return config
})

instance.interceptors.response.use(
  res => res,
  async error => {
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      error.config.url !== ApiPathEnum.Signin &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const accessToken = await handleRefreshToken()
      error.config.headers[NO_RETRY_HEADER] = 'true'
      if (accessToken) {
        error.config.headers.Authorization = `Bearer ${accessToken}`
        localStorage.setItem('access_token', accessToken)
        return await instance.request(error.config)
      }
    }

    if (
      error?.config &&
      error?.response &&
      (+error?.response?.status === 400 || +error?.response?.status === 500) &&
      error?.config?.url === ApiPathEnum.GetUserByRefreshToken &&
      location.pathname.startsWith('/admin')
    ) {
      store.dispatch(refreshTokenExpiredAction(true))
    }

    return error?.response ?? Promise.reject(error)
  },
)

export default instance
