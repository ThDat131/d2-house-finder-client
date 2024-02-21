import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import categoryReducer from './slice/category.slice'
import provinceReducer from './slice/province.slice'
import authReducer from './slice/auth.slice'
import userReducer from '../views/Admin/Users/user.slice'
import districtReducer from './slice/district.slice'
import wardReducer from './slice/ward.slice'
import articleReducer from './slice/article.slice.'

export const store = configureStore({
  reducer: {
    article: articleReducer,
    category: categoryReducer,
    provinces: provinceReducer,
    districts: districtReducer,
    wards: wardReducer,
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
