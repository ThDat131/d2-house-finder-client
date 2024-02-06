import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { type Category } from '../../model/category/category'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'

const initialState: Category[] = []
const { httpService } = new HttpService()

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, thunkAPI) => {
    const response = await httpService.get<Category[]>(ApiPathEnum.Category, {
      signal: thunkAPI.signal,
    })

    return response.data
  },
)

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    getAllCategory: (state, action: PayloadAction<Category[]>) => {
      return action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.push(...action.payload)
    })
  },
})

export const { getAllCategory } = categorySlice.actions

const categoryReducer = categorySlice.reducer

export default categoryReducer
