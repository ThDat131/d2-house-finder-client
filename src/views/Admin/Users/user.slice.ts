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
    const credentialString = cookie.load('credential')
    try {
        const response = await httpService.get<GetUsersResponse>(ApiPathEnum.GetAllUser, {
            headers: { Authorization: `Bearer ${credentialString.access_token}` },
            signal: thunkAPI.signal
        })

        return response.data.data.results
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
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
