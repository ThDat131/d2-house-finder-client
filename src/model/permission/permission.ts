import { CommonResponse } from '../common/common-response'

export interface Permission {
  _id?: string
  name: string
  apiPath: string
  method: string
  module: string
}

interface Data {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: Permission[]
}

export interface GetPermissionResponse extends CommonResponse<Data> {}

export interface PermissionRequest {
  _id?: string
  name: string
  apiPath: string
  method: string
  module: string
}
