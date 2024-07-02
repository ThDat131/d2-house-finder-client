import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { CommonResponse } from '../../model/common/common-response'
import { GetRoleResponse, Role, RoleRequest } from '../../model/role/role'
import { RootState } from '../store'

interface RoleStateProps {
  roles: Role[]
  error: string
  loading: boolean
  pageSize: number
  pageCurrent: number
  totalPage: number
  totalItem: number
}

interface Meta {
  current: number
  pageSize?: number
  name?: string
  isActive?: boolean
}

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE
const initialState: RoleStateProps = {
  roles: [],
  error: '',
  loading: true,
  pageSize: PAGE_SIZE,
  pageCurrent: 0,
  totalPage: 0,
  totalItem: 0,
}
const { httpService } = new HttpService()

export const getRoles = createAsyncThunk(
  'role/getRoles',
  async (data: Meta, thunkAPI) => {
    let params: any = {
      current: data.current,
      pageSize: data.pageSize ?? PAGE_SIZE,
    }

    if (data?.name) {
      params = { ...params, name: data.name }
    }

    if (data?.isActive) {
      params = { ...params, isActive: data.isActive }
    }

    try {
      const response = await httpService.get<GetRoleResponse>(
        ApiPathEnum.Role,
        {
          params,
          signal: thunkAPI.signal,
        },
      )

      if (response.status !== 200) {
        throw new Error(response.data.message)
      }

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createRole = createAsyncThunk(
  'role/createRole',
  async (data: RoleRequest, thunkAPI) => {
    try {
      const response = await httpService.post<CommonResponse<Role>>(
        ApiPathEnum.Role,
        data,
        {
          signal: thunkAPI.signal,
        },
      )

      if (response.status !== 201) {
        throw new Error(response.data.message)
      }

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const updateRole = createAsyncThunk(
  'role/updateRole',
  async (data: RoleRequest, thunkAPI) => {
    try {
      const response = await httpService.patch<CommonResponse<Role>>(
        `${ApiPathEnum.Role}/${data._id}`,
        data,
        {
          signal: thunkAPI.signal,
        },
      )

      if (response.status !== 200) {
        throw new Error(response.data.message)
      }

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const deleteRole = createAsyncThunk(
  'role/deleteRole',
  async (id: string, thunkAPI) => {
    try {
      const response = await httpService.delete<CommonResponse<Role>>(
        `${ApiPathEnum.Role}/${id}`,
        {
          signal: thunkAPI.signal,
        },
      )

      if (response.status !== 200) {
        throw new Error(response.data.message)
      }

      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getRoles.pending, state => {
      state.loading = true
    })
    builder.addCase(
      getRoles.fulfilled,
      (state, action: PayloadAction<GetRoleResponse>) => {
        state.loading = false
        state.pageCurrent = action.payload.data.meta.current
        state.pageSize = action.payload.data.meta.pageSize
        state.totalPage = action.payload.data.meta.pages
        state.totalItem = action.payload.data.meta.total
        state.roles = action.payload.data.results
      },
    )
    builder.addCase(createRole.pending, state => {
      state.loading = true
    })

    builder.addCase(
      createRole.fulfilled,
      (state, action: PayloadAction<CommonResponse<Role>>) => {
        state.roles.push(action.payload.data)
        state.loading = false
      },
    )
    builder.addCase(createRole.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    builder.addCase(updateRole.pending, state => {
      state.loading = true
    })
    builder.addCase(
      updateRole.fulfilled,
      (state, action: PayloadAction<CommonResponse<Role>>) => {
        const permission = state.roles
        const idx = permission.findIndex(x => x._id === action.payload.data._id)

        state.roles[idx] = action.payload.data
        state.loading = false
      },
    )
    builder.addCase(updateRole.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    builder.addCase(deleteRole.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteRole.fulfilled, (state, action) => {
      state.roles = state.roles.filter(x => x._id !== action.payload)
      state.loading = false
    })
    builder.addCase(deleteRole.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

const roleReducer = roleSlice.reducer

const roleState = (state: RootState) => state.role.roles

export const simpleModelRole = createSelector([roleState], role =>
  role.map(x => ({
    _id: x._id,
    name: x.name,
  })),
)

export default roleReducer
