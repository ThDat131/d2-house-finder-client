import axios, { type AxiosInstance } from 'axios'
import instance from './AxiosCustomize'

export class HttpService {
  public httpService: AxiosInstance
  public httpAddressService: AxiosInstance
  public httpGoongService: AxiosInstance
  public httpFacePlusPlusService: AxiosInstance

  constructor() {
    this.httpService = instance

    this.httpAddressService = axios.create({
      baseURL: import.meta.env.VITE_API_ADDRESS_VN,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.httpGoongService = axios.create({
      baseURL: import.meta.env.VITE_GOONG_API_ADDRESS,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.httpFacePlusPlusService = axios.create({
      baseURL: import.meta.env.VITE_FACE_PLUS_PLUS_API,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}
