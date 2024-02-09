import axios, { type AxiosInstance } from 'axios'

export class HttpService {
  public httpService: AxiosInstance
  public httpAddressService: AxiosInstance

  constructor() {
    this.httpService = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
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
  }
}
