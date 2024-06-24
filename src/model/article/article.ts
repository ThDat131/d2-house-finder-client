import { type Address } from '../address/address'
import { Category } from '../category/category'
import { Comment } from '../comment/comment'
import { Location } from '../location/location'

export interface Article {
  _id: string
  title: string
  description: string
  categoryId: Category
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
    _id: string
    fullName: string
    email: string
    avatar: string
    phone: string
  }
  comments: Comment[]
  location: Location
  quantity: number
  attributes: string[]
}
