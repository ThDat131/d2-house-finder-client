import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { type Ward } from '../../model/address/ward'
import { ApiPathEnum } from '../../api/ApiPathEnum'

const { httpAddressService } = new HttpService()
const initialState = {
  data: [] as Ward[],
  loading: false,
  error: '',
  selected: null as Ward | null,
}

export const getAllWards = createAsyncThunk(
  'address/getAllWards',
  async (districtId: string, thunkAPI) => {
    const response = await httpAddressService.get(
      `${ApiPathEnum.GetAllWards}/${districtId}`,
      {
        signal: thunkAPI.signal,
      },
    )

    return response.data
  },
)

const wardSlide = createSlice({
  name: 'wards',
  initialState,
  reducers: {
    selectWard: (state, action: PayloadAction<Ward | null>) => {
      state.selected = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllWards.pending, (state, action) => {
      state.loading = true
      state.error = ''
    })
    builder.addCase(getAllWards.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.results
    })
    builder.addCase(getAllWards.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message as string
    })
  },
})

const wardReducer = wardSlide.reducer

export const { selectWard } = wardSlide.actions

export default wardReducer
