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
import { FollowEntity } from '../../model/follow/follow-entity'

interface AuthProps {
  auth: AuthResponse
  isRefreshToken: boolean
}

interface AuthResponse {
  access_token: string
  user: User
}

const initialState: AuthProps = {
  isRefreshToken: false,
  auth: {
    access_token: '',
    user: {
      _id: '',
      email: '',
      avatar: '',
      role: {
        _id: '',
        name: '',
      },
      active: false,
      fullName: '',
      phone: '',
      followers: [] as FollowEntity[],
      followings: [] as FollowEntity[],
    },
  },
}
export const signinAPI = createAsyncThunk(
  'user/signin',
  async (user: SigninModel, thunkAPI) => {
    const { httpService } = new HttpService()

    try {
      const response = await httpService.post<CommonResponse<CredentialUser>>(
        ApiPathEnum.Signin,
        user,
        {
          signal: thunkAPI.signal,
        },
      )

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    signin: (state, action: PayloadAction<CommonResponse<CredentialUser>>) => {
      state.auth = action.payload.data
    },
    signout: () => {
      return initialState
    },
    getCurrentUser: state => {
      const userString = localStorage.getItem('user') ?? ''

      if (userString !== '') {
        const user = JSON.parse(userString) as User
        state.auth.user = user
      }
    },
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      const updatedUser = {
        _id: action.payload._id,
        active: action.payload.active,
        avatar: action.payload.avatar,
        email: action.payload.email,
        fullName: action.payload.fullName,
        phone: action.payload.phone,
        role: action.payload.role,
      }
      state.auth.user = updatedUser
    },
    addFollow: (state, action: PayloadAction<FollowEntity>) => {
      const temp = state.auth.user.followings ?? []

      state.auth.user.followings = [...temp, action.payload]
    },
    removeFollow: (state, action: PayloadAction<FollowEntity>) => {
      state.auth.user.followings = state.auth.user.followings?.filter(
        x => x._id !== action.payload._id,
      )
    },
    refreshTokenExpiredAction: (state, action: PayloadAction<boolean>) => {
      state.isRefreshToken = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(signinAPI.fulfilled, (state, action) => {
      state.auth = action.payload.data
    })
  },
})

export const {
  signin,
  signout,
  getCurrentUser,
  updateCurrentUser,
  addFollow,
  removeFollow,
  refreshTokenExpiredAction,
} = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer
