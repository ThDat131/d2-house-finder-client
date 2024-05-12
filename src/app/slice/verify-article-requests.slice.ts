import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'

import { ApiPathEnum } from '../../api/ApiPathEnum'
import { CommonResponse } from '../../model/common/common-response'
import {
  VerifyArticleRequests,
  VerifyArticleRequestsResponse,
  VerifyArticleRequestsUpdateModel,
} from '../../model/verify-article-request/verify-article-request'

interface VerifyArticleRequestsProp {
  requests: VerifyArticleRequests[]
  pageSize: number
  pageCurrent: number
  totalPage: number
  totalRequest: number
  error: string
  loading: boolean
}

interface Meta {
  current: number
}

const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)

const initialState: VerifyArticleRequestsProp = {
  requests: [],
  pageSize: PAGE_SIZE,
  pageCurrent: 0,
  totalPage: 0,
  totalRequest: 0,
  error: '',
  loading: false,
}

const { httpService } = new HttpService()

export const getVerifyArticleRequests = createAsyncThunk(
  'verifyArticleRequest/getVerifyArticleRequests',
  async (data: Meta, thunkAPI) => {
    try {
      const response = await httpService.get<
        CommonResponse<VerifyArticleRequestsResponse>
      >(ApiPathEnum.VerifyArticle, {
        params: {
          current: data.current,
          populate: 'createdBy,articleId',
          fields: 'createdBy.fullName,createdBy.email,articleId.title',
        },
        signal: thunkAPI.signal,
      })

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const updateVerifyArticleRequest = createAsyncThunk(
  'verifyArticleRequest/updateVerifyArticleRequest',
  async (data: VerifyArticleRequestsUpdateModel, thunkAPI) => {
    try {
      const response = await httpService.patch<
        CommonResponse<VerifyArticleRequests>
      >(ApiPathEnum.VerifyArticle, data, {
        signal: thunkAPI.signal,
      })

      if (response.status !== 200) throw new Error(response.data.message)

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

const verifyArticleRequestSlice = createSlice({
  name: 'verifyArticleRequest',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getVerifyArticleRequests.pending, state => {
      state.loading = true
    })
    builder.addCase(
      getVerifyArticleRequests.fulfilled,
      (
        state,
        action: PayloadAction<CommonResponse<VerifyArticleRequestsResponse>>,
      ) => {
        state.loading = false
        state.pageCurrent = action.payload.data.meta.current
        state.pageSize = action.payload.data.meta.pageSize
        state.totalPage = action.payload.data.meta.pages
        state.totalRequest = action.payload.data.meta.total
        state.requests = action.payload.data.results
      },
    )
    builder.addCase(updateVerifyArticleRequest.pending, state => {
      state.loading = true
    })
    builder.addCase(
      updateVerifyArticleRequest.fulfilled,
      (state, action: PayloadAction<CommonResponse<VerifyArticleRequests>>) => {
        const requests = state.requests
        const idx = requests.findIndex(x => x._id === action.payload.data._id)

        state.requests[idx] = action.payload.data
        state.loading = false
      },
    )
    builder.addCase(updateVerifyArticleRequest.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

const verifyArticleRequestReducer = verifyArticleRequestSlice.reducer

export default verifyArticleRequestReducer
