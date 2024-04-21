import { FollowEntity } from '../follow/follow-entity'

export interface User {
  _id: string
  email: string
  password?: string
  avatar: string
  role: string
  active: boolean
  fullName: string
  phone: string
  followers?: FollowEntity[]
  followings?: FollowEntity[]
  streetAddress?: string
  latitude?: string
  longitude?: string
  provinceCode?: string
  districtCode?: string
  wardCode?: string
  provinceName?: string
  districtName?: string
  wardName?: string
}
