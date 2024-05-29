import { VerificationStatusEnum } from '../../common/common-enum'

export interface VerifyArticleRequests {
  _id?: string
  latedImage: string[]
  contract: string[]
  video: string[]
  status: VerificationStatusEnum
  articleId: string
  feedBack?: string
}

export interface VerifyArticleRequestsResponse {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: VerifyArticleRequests[]
}

export interface VerifyArticleRequestsUpdateModel {
  id: string
  status: string
  feedBack: string
}
