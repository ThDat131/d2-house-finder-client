import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { type Province } from '../../model/address/province'
import { ApiPathEnum } from '../../api/ApiPathEnum'

const { httpAddressService } = new HttpService()
const initialState = {
  data: [] as Province[],
  loading: true,
  error: '',
  selected: null as Province | null,
}

export const getAllProvinces = createAsyncThunk(
  'address/getAllProvinces',
  async (_, thunkAPI) => {
    const response = await httpAddressService.get(ApiPathEnum.GetAllProvinces, {
      signal: thunkAPI.signal,
    })

    return response.data
  },
)

const provinceSlide = createSlice({
  name: 'provinces',
  initialState,
  reducers: {
    selectProvince: (state, action: PayloadAction<Province | null>) => {
      state.selected = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllProvinces.pending, (state, action) => {
      state.loading = true
      state.error = ''
    })
    builder.addCase(getAllProvinces.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.results
    })
    builder.addCase(getAllProvinces.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message as string
    })
  },
})

const provinceReducer = provinceSlide.reducer

export const { selectProvince } = provinceSlide.actions

export default provinceReducer
