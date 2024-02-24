import { type CommonResponse } from '../common/common-response'
import { type Article } from './article'

interface ArticleResponse {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: Article[]
}

export interface GetArticlesResponse extends CommonResponse<ArticleResponse> {}
