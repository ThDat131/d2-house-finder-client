import { type Category } from '../../../../model/category/category'
import { type CommonResponse } from '../../../../model/common/common-response'

interface Data {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: Category[]
}

export interface GetCategoryResponse extends CommonResponse<Data> {}

interface SubCategoryData {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: SubCategory[]
}

export interface GetSubCategoryResponse
  extends CommonResponse<SubCategoryData> {}
