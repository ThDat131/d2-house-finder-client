import { type Address } from '../address/address'

export interface Article {
  _id: string
  title: string
  description: string
  categoryId: string
  price: number
  acreage: number
  status: string
  active: boolean
  address: Address
  images: string[]
  verifyStatus: string
  expiredVerifyDate: Date
  expiredAt: Date
  createdAt: Date
  updatedAt: Date
  createdBy: {
    fullName: string
    email: string
    avatar: string
    phone: string
  }
}