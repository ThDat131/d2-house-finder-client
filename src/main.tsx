import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
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
  Profile,
  Verify,
} from './views/index.view'
import { ThemeProvider } from '@emotion/react'
import theme from './theme'
import {
  AdminAnalyticsView,
  AdminApplicationView,
  AdminCategoryCreateView,
  AdminPostView,
  AdminUserCreateView,
  AdminUserView,
  AdmninCategoriesView,
} from './views/Admin'
import { CssBaseline } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import i18n from './lang/i18n'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
        element: <AdminUserCreateView />,
      },
      {
        path: 'category/create',
        element: <AdminCategoryCreateView />,
      },
      {
        path: 'category',
        element: <AdmninCategoriesView />,
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
        path: 'post',
        element: <AdminPostView />,
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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
          <ToastContainer />
        </ThemeProvider>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
)
