import { type PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { type SigninModel } from '../../model/auth/signin-model'
import { type CredentialUser } from '../../model/auth/current-user'

const initialState = {
    access_token: '',
    refresh_token: '',
    user: {
        id: '',
        email: '',
        avatar: '',
        role: '',
        active: false,
        fullName: '',
        phone: '',
    }
}
const { httpService } = new HttpService()
export const signinAPI = createAsyncThunk('user/signin', async (user: SigninModel, thunkAPI) => {
    try {
        const resposne = await httpService.post<CommonResponse>(ApiPathEnum.Signin, user, {
            signal: thunkAPI.signal
        })

        return resposne.data.data as CredentialUser
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        signin: (state, action: PayloadAction<CredentialUser>) => {
            return action.payload
        },
        signout: (state) => {
            return initialState
        }
    },
    extraReducers(builder) {
        builder.addCase(signinAPI.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export const { signin, signout } = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer
