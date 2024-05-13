import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RootState, persistor, store } from './app/store'
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
  DetailVerifyArticleRequest,
  FindHouseWithLocation,
  GeneralManagement,
  ManageArticles,
  NotFound,
  Profile,
  UpdateInformation,
  UpdatePassword,
  UpgradeLandlord,
  Verify,
  VerifyArticle,
  VerifyArticleRequests,
} from './views/index.view'
import { ThemeProvider } from '@emotion/react'
import theme from './theme'
import {
  AdminAnalyticsView,
  AdminCategoryCreateView,
  AdminArticleView,
  AdminUserCreateView,
  AdminUserView,
  AdminCategoriesView,
  AdminArticleCreateView,
  AdminLandlordRequestsView,
  AdminPermissionView,
  AdminRoleView,
  AdminVerifyArticleRequestsView,
  AdminDetailUpdateVerifyArticleRequestView,
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
import ProtectedRoute from './components/Route/ProtectedRoute'
import RoleProtectedRoute from './components/Route/RoleProtectedRoute'

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
    element: (
      <ProtectedRoute>
        <GeneralManagement />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dang-tin-moi',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="LANDLORD">
              <CreateArticle type={ActionType.CREATE} />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'cap-nhat-tin-dang/:id',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="LANDLORD">
              <CreateArticle type={ActionType.UPDATE} />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'cap-nhat-thong-tin-ca-nhan',
        element: (
          <ProtectedRoute>
            <UpdateInformation />,
          </ProtectedRoute>
        ),
      },
      {
        path: 'cap-nhat-mat-khau',
        element: (
          <ProtectedRoute>
            <UpdatePassword />,
          </ProtectedRoute>
        ),
      },
      {
        path: 'tin-dang',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="LANDLORD">
              <ManageArticles />,
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'nang-cap-tai-khoan',
        element: (
          <ProtectedRoute>
            <UpgradeLandlord />,
          </ProtectedRoute>
        ),
      },
      {
        path: 'danh-sach-yeu-cau-xac-thuc',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="LANDLORD">
              <VerifyArticleRequests />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'yeu-cau-xac-thuc-tin-dang/:id',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="LANDLORD">
              <DetailVerifyArticleRequest />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/tim-tro-theo-vi-tri',
    element: (
      <ProtectedRoute>
        <FindHouseWithLocation />,
      </ProtectedRoute>
    ),
  },
  {
    path: '/bai-dang/:id',
    element: <ArticleDetails />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute role="ADMIN">
          <Admin />
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'user',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminUserView />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/create',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminUserCreateView type={ActionType.CREATE} />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/update/:id',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminUserCreateView type={ActionType.UPDATE} />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'category/create',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminCategoryCreateView />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'category',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminCategoriesView />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: '',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminAnalyticsView />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'article',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminArticleView />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'article/create',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminArticleCreateView type={ActionType.CREATE} />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'article/update/:id',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminArticleCreateView type={ActionType.UPDATE} />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'landlord-requests',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminLandlordRequestsView />,
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'permission',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminPermissionView />,
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'role',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminRoleView />,
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'verify-article-requests',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              <AdminVerifyArticleRequestsView />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'verify-article-requests/:id',
        element: (
          <ProtectedRoute>
            <RoleProtectedRoute role="ADMIN">
              {' '}
              <AdminDetailUpdateVerifyArticleRequestView />
            </RoleProtectedRoute>
          </ProtectedRoute>
        ),
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
  {
    path: '*',
    element: <NotFound />,
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
