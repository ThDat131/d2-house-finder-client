import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'
import { HttpService } from '../../../api/HttpService'
import { type District } from '../../../model/address/district'
import { ApiPathEnum } from '../../../api/ApiPathEnum'

const { httpAddressService } = new HttpService()
const initialState = {
  data: [] as District[],
  loading: false,
  error: '',
  selected: null as District | null,
}

export const getAllDistricts = createAsyncThunk(
  'address/getAllDistricts',
  async (provinceId: number, thunkAPI) => {
    const response = await httpAddressService.get(
      `${ApiPathEnum.GetAllDistricts}/${provinceId}`,
      {
        signal: thunkAPI.signal,
      },
    )

    return response.data
  },
)

const districtSlide = createSlice({
  name: 'districts',
  initialState,
  reducers: {
    selectDistrict: (state, action: PayloadAction<District | null>) => {
      state.selected = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllDistricts.pending, (state, action) => {
      state.loading = true
      state.error = ''
    })
    builder.addCase(getAllDistricts.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.results
    })
    builder.addCase(getAllDistricts.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message as string
    })
  },
})

const districtReducer = districtSlide.reducer

export const { selectDistrict } = districtSlide.actions

export default districtReducer
