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
  access_token: string
  user: User
}

const initialState: AuthProps = {
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
}
const { httpService } = new HttpService()
export const signinAPI = createAsyncThunk(
  'user/signin',
  async (user: SigninModel, thunkAPI) => {
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
      return action.payload.data
    },
    signout: () => {
      return initialState
    },
    getCurrentUser: state => {
      const userString = localStorage.getItem('user') ?? ''

      if (userString !== '') {
        const user = JSON.parse(userString) as User
        state.user = user
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
      state.user = updatedUser
    },
    addFollow: (state, action: PayloadAction<FollowEntity>) => {
      const temp = state.user.followings ?? []

      state.user.followings = [...temp, action.payload]
    },
    removeFollow: (state, action: PayloadAction<FollowEntity>) => {
      state.user.followings = state.user.followings?.filter(
        x => x._id !== action.payload._id,
      )
    },
  },
  extraReducers(builder) {
    builder.addCase(signinAPI.fulfilled, (state, action) => {
      return action.payload.data
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
} = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer
