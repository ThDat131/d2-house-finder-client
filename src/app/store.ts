import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import categoryReducer from './slice/category.slice'
import provinceReducer from './slice/address.slice'
import authReducer from './slice/auth.slice'
import userReducer from '../views/Admin/Users/user.slice'

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    province: provinceReducer,
    auth: authReducer,
    user: userReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
