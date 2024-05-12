import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import categoryReducer from './slice/category.slice'
import provinceReducer from './slice/province.slice'
import authReducer from './slice/auth.slice'
import userReducer from '../views/Admin/Users/user.slice'
import districtReducer from './slice/district.slice'
import wardReducer from './slice/ward.slice'
import articleReducer from './slice/article.slice.'
import filterReducer from './slice/filter.slice'
import landlordRequestReducer from './slice/landlord-requests.slice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import permissionReducer from './slice/permission.slice'
import roleReducer from './slice/role.slice'
import verifyArticleRequestReducer from './slice/verify-article-requests.slice'

const persistConfig = {
  key: 'root',
  storage,
}

const authPersistedReducer = persistReducer(persistConfig, authReducer)
const categoryPersistedReducer = persistReducer(persistConfig, categoryReducer)

export const store = configureStore({
  reducer: {
    article: articleReducer,
    category: categoryPersistedReducer,
    provinces: provinceReducer,
    districts: districtReducer,
    wards: wardReducer,
    auth: authPersistedReducer,
    user: userReducer,
    filter: filterReducer,
    landlordRequest: landlordRequestReducer,
    permission: permissionReducer,
    role: roleReducer,
    verifyArticle: verifyArticleRequestReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const persistor = persistStore(store)
