import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { HttpService } from '../../../api/HttpService'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { type GetUsersResponse } from './model/GetUsersResponse'
import { type User } from '../../../model/user/user'

const initialState: User[] = []
const { authHttpService } = new HttpService()

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (_, thunkAPI) => {
    try {
      const response = await authHttpService.get<GetUsersResponse>(
        ApiPathEnum.GetAllUser,
        {
          signal: thunkAPI.signal,
        },
      )
      console.log(response.data)
      return response.data.data.results
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
    builder.addCase(getUsers.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

const userReducer = userSlice.reducer

export default userReducer
