import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState = {
  price: [0, 0],
  acreage: [0, 0],
  filterQuery: '',
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setPriceFilter: (state, action: PayloadAction<number[]>) => {
      state.price = action.payload
    },
    setAcreageFilter: (state, action: PayloadAction<number[]>) => {
      state.acreage = action.payload
    },
    setFilterQuery: (state, action: PayloadAction<string>) => {
      state.filterQuery = action.payload
    },
  },
})

const filterReducer = filterSlice.reducer

export const { setPriceFilter, setAcreageFilter, setFilterQuery } =
  filterSlice.actions

export default filterReducer
