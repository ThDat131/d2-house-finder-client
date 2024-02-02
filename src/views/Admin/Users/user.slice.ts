import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { HttpService } from '../../../api/HttpService'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { type GetUsersResponse } from './model/GetUsersResponse'
import { type User } from '../../../model/user/user'
import cookie from 'react-cookies'
import { AxiosError } from 'axios'

const initialState: User[] = []
const { httpService } = new HttpService()

export const getUsers = createAsyncThunk('user/getUsers', async (_, thunkAPI) => {
    const accessToken = cookie.load('access_token')

    try {
        const response = await httpService.get<GetUsersResponse>(ApiPathEnum.GetAllUser, {
            headers: { Authorization: `Bearer ${accessToken}` },
            signal: thunkAPI.signal
        })

        return response.data.data.results
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.request.status === 401) {
                httpService.get(ApiPathEnum.GetUserByRefreshToken, { withCredentials: true }).then(res => {
                    if (res.status === 200) {
                        cookie.save('access_token', res.data.data.access_token, {})
                        getUsers()
                    }
                })

                return thunkAPI.rejectWithValue(error)
            }
        }
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getUsers.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

const userReducer = userSlice.reducer

export default userReducer
