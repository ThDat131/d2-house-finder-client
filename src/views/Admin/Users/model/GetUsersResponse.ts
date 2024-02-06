import { type CommonResponse } from '../../../../model/common/common-response'
import { type User } from '../../../../model/user/user'

interface Data {
  meta: any
  results: User[]
}

export interface GetUsersResponse extends CommonResponse<Data> {}
