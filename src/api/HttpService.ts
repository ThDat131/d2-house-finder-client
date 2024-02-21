import axios, { type AxiosInstance } from 'axios'
import { Mutex } from 'async-mutex'
import { type CommonResponse } from '../model/common/common-response'
import { type CredentialUser } from '../model/auth/current-user'
import { ApiPathEnum } from './ApiPathEnum'

export class HttpService {
  public httpService: AxiosInstance
  public authHttpService: AxiosInstance
  public httpAddressService: AxiosInstance
  public httpGoongService: AxiosInstance

  mutex = new Mutex()
  NO_RETRY_HEADER = 'x-no-retry'

  constructor() {
    this.httpService = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.httpAddressService = axios.create({
      baseURL: import.meta.env.VITE_API_ADDRESS_VN,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.authHttpService = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
    })

    this.httpGoongService = axios.create({
      baseURL: import.meta.env.VITE_GOONG_API_ADDRESS,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.authHttpService.interceptors.request.use(function (config) {
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

    this.authHttpService.interceptors.response.use(
      res => res,
      async error => {
        if (
          error.config &&
          error.response &&
          +error.response.status === 401 &&
          error.config.url !== ApiPathEnum.Signin &&
          !error.config.headers[this.NO_RETRY_HEADER]
        ) {
          const accessToken = await this.handleRefreshToken()
          error.config.headers[this.NO_RETRY_HEADER] = 'true'
          if (accessToken) {
            error.config.headers.Authorization = `Bearer ${accessToken}`
            localStorage.setItem('access_token', accessToken)
            return await this.authHttpService.request(error.config)
          }
        }

        if (
          error.config &&
          error.response &&
          +error.response.status === 400 &&
          error.config.url === ApiPathEnum.GetUserByRefreshToken &&
          location.pathname.startsWith('/admin')
        ) {
          const message =
            error?.response?.data?.message ?? 'Something wrong please login.'
          console.error(message)
        }

        return error?.response ?? Promise.reject(error)
      },
    )
  }

  handleRefreshToken = async (): Promise<string | null> => {
    return await this.mutex.runExclusive(async () => {
      const res = await this.authHttpService.get<
        CommonResponse<CredentialUser>
      >(ApiPathEnum.GetUserByRefreshToken)
      if (res?.data) return res.data.data.access_token
      else return null
    })
  }
}
