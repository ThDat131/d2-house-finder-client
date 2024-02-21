import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { type Category } from '../../model/category/category'
import { type GetCategoryResponse } from '../../views/Admin/Categories/model/GetCategoriesResponse'
import { type CreateCategoryModel } from '../../views/Admin/Categories/model/create-category-model'
import { type CommonResponse } from '../../model/common/common-response'
import { type ErrorResponse } from '../../model/common/error-response'

const initialState = {
  category: [] as Category[],
  error: '',
}
const { authHttpService, httpService } = new HttpService()

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await httpService.get<GetCategoryResponse>(
        ApiPathEnum.Categories,
        {
          params: {
            current: 1,
            pageSize: 5,
          },
          signal: thunkAPI.signal,
        },
      )

      return response.data.data.results
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (category: CreateCategoryModel, thunkAPI) => {
    try {
      const response = await authHttpService.post<
        CommonResponse<Category> | ErrorResponse
      >(ApiPathEnum.Categories, category, {
        signal: thunkAPI.signal,
      })

      if (response.status === 400) {
        throw new Error(response.data.message)
      }

      return response.data as CommonResponse<Category>
    } catch (ex) {
      const error = ex as Error
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: state => {
      state.error = ''
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.category = action.payload
      },
    )
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<CommonResponse<Category>>) => {
        state.error = ''
        state.category.push(action.payload.data)
      },
    )
    builder.addCase(createCategory.rejected, (state, action) => {
      state.error = action.payload as string
    })
  },
})

export const { clearError } = categorySlice.actions

const categoryReducer = categorySlice.reducer

export default categoryReducer
