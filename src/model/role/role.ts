import { CommonResponse } from '../common/common-response'

export interface Role {
  _id?: string
  name: string
  description?: string
  isActive?: boolean
  permissions?: string[]
}

interface Data {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: Role[]
}

export interface GetRoleResponse extends CommonResponse<Data> {}

export interface RoleRequest {
  _id?: string
  name: string
  description: string
  isActive: boolean
}
