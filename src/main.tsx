import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signin from './views/Signin/Signin'
import { Signup } from './views/Signup/Signup'
import Home from './views/Home/Home'
import {
  Admin,
  ArticleCategory,
  ArticleDetails,
  CreateArticle,
  FindHouseWithLocation,
  GeneralManagement,
  ManageArticles,
  Profile,
  UpdateInformation,
  UpdatePassword,
  UpgradeLandlord,
  Verify,
  VerifyArticle,
} from './views/index.view'
import { ThemeProvider } from '@emotion/react'
import theme from './theme'
import {
  AdminAnalyticsView,
  AdminApplicationView,
  AdminCategoryCreateView,
  AdminArticleView,
  AdminUserCreateView,
  AdminUserView,
  AdminCategoriesView,
  AdminArticleCreateView,
  AdminLandlordRequestsView,
  AdminPermissionView,
} from './views/Admin'
import { CssBaseline } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import i18n from './lang/i18n'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ActionType } from './common/common-enum'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { PersistGate } from 'redux-persist/integration/react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dang-ky',
    element: <Signup />,
  },
  {
    path: '/dang-nhap',
    element: <Signin />,
  },
  {
    path: '/quan-ly',
    element: <GeneralManagement />,
    children: [
      {
        path: 'dang-tin-moi',
        element: <CreateArticle />,
      },
      {
        path: 'cap-nhat-thong-tin-ca-nhan',
        element: <UpdateInformation />,
      },
      {
        path: 'cap-nhat-mat-khau',
        element: <UpdatePassword />,
      },
      {
        path: 'tin-dang',
        element: <ManageArticles />,
      },
      {
        path: 'yeu-cau-xac-thuc',
        element: <VerifyArticle />,
      },
      {
        path: 'nang-cap-tai-khoan',
        element: <UpgradeLandlord />,
      },
    ],
  },
  {
    path: '/tim-tro-theo-vi-tri',
    element: <FindHouseWithLocation />,
  },
  {
    path: '/bai-dang/:id',
    element: <ArticleDetails />,
  },
  {
    path: '/admin',
    element: <Admin />,
    children: [
      {
        path: 'user',
        element: <AdminUserView />,
      },
      {
        path: 'user/create',
        element: <AdminUserCreateView type={ActionType.CREATE} />,
      },
      {
        path: 'user/update/:id',
        element: <AdminUserCreateView type={ActionType.UPDATE} />,
      },
      {
        path: 'category/create',
        element: <AdminCategoryCreateView />,
      },
      {
        path: 'category',
        element: <AdminCategoriesView />,
      },
      {
        path: 'statistic',
        element: <AdminAnalyticsView />,
      },
      {
        path: '',
        element: <AdminApplicationView />,
      },
      {
        path: 'article',
        element: <AdminArticleView />,
      },
      {
        path: 'article/create',
        element: <AdminArticleCreateView type={ActionType.CREATE} />,
      },
      {
        path: 'article/update/:id',
        element: <AdminArticleCreateView type={ActionType.UPDATE} />,
      },
      {
        path: 'landlord-requests',
        element: <AdminLandlordRequestsView />,
      },
      {
        path: 'permission',
        element: <AdminPermissionView />,
      },
    ],
  },
  {
    path: '/trang-ca-nhan/:id',
    element: <Profile />,
  },
  {
    path: '/danh-muc/:name',
    element: <ArticleCategory />,
  },
  {
    path: 'xac-nhan',
    element: <Verify />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <RouterProvider router={router} />
              <ToastContainer />
            </ThemeProvider>
          </LocalizationProvider>
        </PersistGate>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
)
