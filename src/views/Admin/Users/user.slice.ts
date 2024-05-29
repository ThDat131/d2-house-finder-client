import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { HttpService } from '../../../api/HttpService'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { type GetUsersResponse } from './model/GetUsersResponse'
import { type User } from '../../../model/user/user'

interface Meta {
  current: number
  role?: {
    _id: string
    name: string
  }
  fullName?: string
}

interface UserStateProps {
  users: User[]
  pageSize: number
  pageCurrent: number
  totalPage: number
  totalUser: number
  loading: boolean
  error: string
}

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE
const initialState: UserStateProps = {
  pageCurrent: 1,
  pageSize: PAGE_SIZE,
  totalPage: 0,
  totalUser: 0,
  users: [],
  loading: false,
  error: '',
}
const { httpService } = new HttpService()

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (data: Meta, thunkAPI) => {
    try {
      let params: any = {
        current: data.current,
        pageSize: PAGE_SIZE,
        populate: 'role',
        fields: 'role._id,role.name',
      }
      if (data?.role?._id) {
        params = {
          ...params,
          filter: {
            role: data.role,
          },
        }
      }
      if (data?.fullName) {
        params = { ...params, fullName: data.fullName }
      }

      const response = await httpService.get<GetUsersResponse>(
        ApiPathEnum.Users,
        {
          params,
          signal: thunkAPI.signal,
        },
      )

      return response.data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createUser = createAsyncThunk(
  'user/createUser',
  async (user: User, thunkAPI) => {
    try {
      const response = await httpService.post<GetUsersResponse>(
        ApiPathEnum.Users,
        user,
        {
          signal: thunkAPI.signal,
        },
      )

      return response.data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (user: User, thunkAPI) => {
    try {
      const response = await httpService.delete(
        `${ApiPathEnum.Users}/${user._id}`,
        {
          signal: thunkAPI.signal,
        },
      )

      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUsers.pending, state => {
      state.loading = true
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload.results
      state.pageCurrent = action.payload.meta.current
      state.pageSize = action.payload.meta.pageSize
      state.totalPage = action.payload.meta.pages
      state.totalUser = action.payload.meta.total
      state.loading = false
    })
    builder.addCase(getUsers.rejected, state => {
      state.loading = false
    })
    builder.addCase(createUser.pending, state => {
      state.loading = true
    })
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false
    })
    builder.addCase(deleteUser.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    builder.addCase(deleteUser.fulfilled, state => {
      state.loading = false
    })
  },
})

const userReducer = userSlice.reducer

export default userReducer
