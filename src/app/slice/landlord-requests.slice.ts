import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import {
  UpgradeLandlordRequest,
  UpgradeLandlordRequestResponse,
  UpgradeLandlordRequestUpdateModel,
} from '../../model/upgrade-landlord-request/upgrade-landlord-request'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { CommonResponse } from '../../model/common/common-response'
import { RootState } from '../store'
import { LandlordRequestStatusEnum } from '../../common/common-enum'

interface LandlordRequestsProps {
  requests: UpgradeLandlordRequest[]
  pageSize: number
  pageCurrent: number
  totalPage: number
  totalRequest: number
  error: string
  loading: boolean
}

interface Meta {
  current: number
  createdBy?: {
    fullName: string
    _id: string
    email: string
  }
  pageSize?: number
  status?: LandlordRequestStatusEnum
}

const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)

const initialState: LandlordRequestsProps = {
  requests: [],
  pageSize: PAGE_SIZE,
  pageCurrent: 0,
  totalPage: 0,
  totalRequest: 0,
  error: '',
  loading: false,
}

const { httpService } = new HttpService()

export const getLandlordRequests = createAsyncThunk(
  'landlordRequests/getLandlordRequests',
  async (data: Meta, thunkAPI) => {
    let params: any = {
      current: data.current,
      populate: 'createdBy',
      fields: 'createdBy.fullName,createdBy.email',
    }

    if (data?.createdBy?._id) {
      params = {
        ...params,
        filter: {
          createdBy: data.createdBy,
        },
      }
    }

    if (data?.status) {
      params = {
        ...params,
        status: data.status,
      }
    }

    try {
      const response = await httpService.get<
        CommonResponse<UpgradeLandlordRequestResponse>
      >(ApiPathEnum.LandlordRequest, {
        params,
        signal: thunkAPI.signal,
      })

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const updateLandlordRequest = createAsyncThunk(
  'landlordRequests/updateLandlordRequest',
  async (data: UpgradeLandlordRequestUpdateModel, thunkAPI) => {
    try {
      const response = await httpService.patch<
        CommonResponse<UpgradeLandlordRequest>
      >(ApiPathEnum.LandlordRequest, data, {
        signal: thunkAPI.signal,
      })

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

const landlordRequestSlice = createSlice({
  name: 'landlordRequest',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getLandlordRequests.pending, state => {
      state.loading = true
    })
    builder.addCase(
      getLandlordRequests.fulfilled,
      (
        state,
        action: PayloadAction<CommonResponse<UpgradeLandlordRequestResponse>>,
      ) => {
        state.loading = false
        state.pageCurrent = action.payload.data.meta.current
        state.pageSize = action.payload.data.meta.pageSize
        state.totalPage = action.payload.data.meta.pages
        state.totalRequest = action.payload.data.meta.total
        state.requests = action.payload.data.results
      },
    )
    builder.addCase(updateLandlordRequest.pending, state => {
      state.loading = true
    })
    builder.addCase(
      updateLandlordRequest.fulfilled,
      (
        state,
        action: PayloadAction<CommonResponse<UpgradeLandlordRequest>>,
      ) => {
        const requests = state.requests
        const idx = requests.findIndex(x => x._id === action.payload.data._id)

        state.requests[idx] = action.payload.data
        state.loading = false
      },
    )
    builder.addCase(updateLandlordRequest.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

const landlordRequestReducer = landlordRequestSlice.reducer

const landlordRequests = (state: RootState) => state.landlordRequest.requests

export const allCreatedByLandlordRequests = createSelector(
  [landlordRequests],
  x =>
    x.map(x => ({
      _id: x.createdBy?._id as string,
      fullName: x.createdBy?.fullName as string,
      email: x.createdBy?.email as string,
    })),
)

export default landlordRequestReducer
