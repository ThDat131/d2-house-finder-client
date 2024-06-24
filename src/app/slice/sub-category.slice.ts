import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { GetSubCategoryResponse } from '../../views/Admin/Categories/model/GetCategoriesResponse'
import { CommonResponse } from '../../model/common/common-response'

interface SubCategoryStateProps {
  subCategory: SubCategory[]
  selected: string[]
}

interface Meta {
  type?: string
  categoryId?: string
}

const initialState: SubCategoryStateProps = {
  subCategory: [] as SubCategory[],
  selected: [],
}
const { httpService } = new HttpService()

export const getSubCategories = createAsyncThunk(
  'subCategory/getSubCategories',
  async (data: Meta, thunkAPI) => {
    let params: any = {
      current: 1,
      pageSize: 999,
    }

    if (data?.type) {
      params = {
        ...params,
        name: data.type,
      }
    }

    if (data?.categoryId) {
      params = {
        ...params,
        categoryId: data.categoryId,
      }
    }

    try {
      const response = await httpService.get<GetSubCategoryResponse>(
        ApiPathEnum.SubCategory,
        {
          params,
          signal: thunkAPI.signal,
        },
      )

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {
    removeSubCategory: state => {
      state.subCategory = []
    },
    selectSubCategory: (state, action) => {
      if (state.selected.includes(action.payload))
        state.selected = state.selected.filter(x => x !== action.payload)
      else state.selected.push(action.payload)
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getSubCategories.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.subCategory = action.payload.data.results
      },
    )
  },
})

const subCategoryReducer = subCategorySlice.reducer

export const { removeSubCategory, selectSubCategory } = subCategorySlice.actions

export default subCategoryReducer
