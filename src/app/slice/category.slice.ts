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

interface CategoryStateProps {
  category: Category[]
  error: string
  selected: Category | null
  loading: boolean
  pageSize: number
  pageCurrent: number
  totalPage: number
  totalCategories: number
}

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE
const initialState: CategoryStateProps = {
  category: [] as Category[],
  error: '',
  selected: null as Category | null,
  loading: true,
  pageSize: PAGE_SIZE,
  pageCurrent: 0,
  totalPage: 0,
  totalCategories: 0,
}
const { httpService } = new HttpService()

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await httpService.get<GetCategoryResponse>(
        ApiPathEnum.Categories,
        {
          params: {
            current: 1,
            pageSize: PAGE_SIZE,
          },
          signal: thunkAPI.signal,
        },
      )

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (category: CreateCategoryModel, thunkAPI) => {
    try {
      const response = await httpService.post<
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

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (category: Category, thunkAPI) => {
    try {
      const response = await httpService.patch<
        CommonResponse<Category> | ErrorResponse
      >(`${ApiPathEnum.Categories}/${category._id}`, category, {
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

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (category: Category, thunkAPI) => {
    try {
      const response = await httpService.delete<
        CommonResponse<Category> | ErrorResponse
      >(`${ApiPathEnum.Categories}/${category._id}`, {
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
    selectCategory: (state, action: PayloadAction<Category | null>) => {
      state.selected = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getCategories.pending, state => {
      state.loading = true
    })
    builder.addCase(
      getCategories.fulfilled,
      (state, action: PayloadAction<GetCategoryResponse>) => {
        state.category = action.payload.data.results
        state.loading = false
        state.pageCurrent = action.payload.data.meta.current
        state.pageSize = action.payload.data.meta.pageSize
        state.totalPage = action.payload.data.meta.pages
        state.totalCategories = action.payload.data.meta.total
      },
    )
    builder.addCase(createCategory.pending, state => {
      state.loading = true
    })
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<CommonResponse<Category>>) => {
        state.error = ''
        state.category.push(action.payload.data)
        state.loading = false
      },
    )
    builder.addCase(createCategory.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false
    })
    builder.addCase(updateCategory.pending, state => {
      state.loading = true
    })
    builder.addCase(updateCategory.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false
    })
    builder.addCase(deleteCategory.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteCategory.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false
    })
  },
})

export const { clearError, selectCategory } = categorySlice.actions

const categoryReducer = categorySlice.reducer

export default categoryReducer
