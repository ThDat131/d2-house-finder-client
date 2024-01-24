import { type PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'

const { httpService } = new HttpService()
const initialState: any = []

export const getAllProvinces = createAsyncThunk('provinces/getAllProvinces', async (_, thunkAPI) => {
    const response = await httpService.get('https://provinces.open-api.vn/api/', {
        params: { depth: 3 },
        signal: thunkAPI.signal
    })
    return response.data
})

const provinceSlide = createSlice({
    name: 'provinces',
    initialState,
    reducers: {
        getAllProvince: (state, action: PayloadAction<any>) => {
            state.push(...action.payload)
        }
    },
    extraReducers(builder) {
        builder.addCase(getAllProvinces.fulfilled, (state, action) => {
            state.push(...action.payload)
        })
    }
})

export const { getAllProvince } = provinceSlide.actions

const provinceReducer = provinceSlide.reducer

export default provinceReducer
