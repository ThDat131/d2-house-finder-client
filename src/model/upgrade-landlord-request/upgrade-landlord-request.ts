import { GenderEnum, LandlordRequestStatusEnum } from '../../common/common-enum'

export interface UpgradeLandlordRequest {
  _id?: string
  personalID: string
  dayOfBirth: Date
  address: string
  gender: GenderEnum
  nationality: string
  dateOfIssue: Date
  status: LandlordRequestStatusEnum
  placeOfIssue: string
  feedBack?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UpgradeLandlordRequestResponse {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: UpgradeLandlordRequest[]
}

export interface UpgradeLandlordRequestUpdateModel {
  id: string
  status: string
  feedBack: string
}
