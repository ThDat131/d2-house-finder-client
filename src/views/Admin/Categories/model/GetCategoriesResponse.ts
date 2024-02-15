import { type Category } from '../../../../model/category/category'
import { type CommonResponse } from '../../../../model/common/common-response'

interface Data {
  meta: any
  results: Category[]
}

export interface GetCategoryResponse extends CommonResponse<Data> {}
