import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import categoryReducer from '../views/Admin/Categories/category.slice'
import provinceReducer from '../components/Modal/ChooseAddressModal/province.slice'
import authReducer from './slice/auth.slice'
import userReducer from '../views/Admin/Users/user.slice'
import districtReducer from '../components/Modal/ChooseAddressModal/district.slice'
import wardReducer from '../components/Modal/ChooseAddressModal/ward.slice'

export const store = configureStore({
  reducer: {
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
