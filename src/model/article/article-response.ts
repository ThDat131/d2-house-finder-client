import { type CommonResponse } from '../common/common-response'
import { type Article } from './article'

interface Data {
  meta: any
  results: Article[]
}

export interface GetArticlesResponse extends CommonResponse<Data> {}
