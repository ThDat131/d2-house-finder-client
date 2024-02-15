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
import cookie from 'react-cookies'

const initialState = {
  access_token: '',
  user: {
    id: '',
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
      const resposne = await httpService.post<CommonResponse<any>>(
        ApiPathEnum.Signin,
        user,
        {
          signal: thunkAPI.signal,
        },
      )

      return resposne.data.data as CredentialUser
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
    getCurrentUserFromCookie: () => {
      const credential = cookie.load('credential')

      if (credential) {
        return credential
      }

      return null
    },
  },
  extraReducers(builder) {
    builder.addCase(signinAPI.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export const { signin, signout, getCurrentUserFromCookie } = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer
