import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit';
import categoryReducer from './slice/category.slice';
import { useDispatch } from 'react-redux';
import provinceReducer from './slice/address.slice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    province: provinceReducer,
  },
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const useAppDispatch = () => useDispatch<AppDispatch>();
