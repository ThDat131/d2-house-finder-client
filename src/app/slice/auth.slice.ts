import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { type SigninModel } from '../../model/auth/signin-model'
import { type CredentialUser } from '../../model/auth/current-user'
import { type CommonResponse } from '../../model/common/common-response'
import { type User } from '../../model/user/user'

const initialState = {
  access_token: '',
  user: {
    _id: '',
    email: '',
    avatar: '',
    role: '',
    active: false,
    fullName: '',
    phone: '',
  },
}
const { httpService } = new HttpService()
export const signinAPI = createAsyncThunk(
  'user/signin',
  async (user: SigninModel, thunkAPI) => {
    try {
      const response = await httpService.post<CommonResponse<any>>(
        ApiPathEnum.Signin,
        user,
        {
          signal: thunkAPI.signal,
        },
      )

      return response.data.data as CredentialUser
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    signin: (state, action: PayloadAction<CredentialUser>) => {
      return action.payload
    },
    signout: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')

      return initialState
    },
    getCurrentUser: state => {
      const userString = localStorage.getItem('user') ?? ''

      if (userString !== '') {
        const user = JSON.parse(userString) as User
        state.user = user
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(signinAPI.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export const { signin, signout, getCurrentUser } = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer
