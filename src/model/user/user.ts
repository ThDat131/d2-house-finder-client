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
  followers: FollowEntity[]
  followings: FollowEntity[]
}
