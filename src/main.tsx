import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signin from './views/Signin/Signin'
import { Signup } from './views/Signup/Signup'
import Main from './components/Main'
import {
  Admin,
  FindHouseWithLocation,
  GeneralManagement,
} from './views/index.view'
import { ThemeProvider } from '@emotion/react'
import theme from './theme'
import {
  AdminAnalyticsView,
  AdminApplicationView,
  AdminPostView,
  AdminUserCreateView,
  AdminUserView,
  AdmninCategoriesView,
} from './views/Admin'
import { CssBaseline } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import i18n from './lang/i18n'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
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
  },
  {
    path: '/tim-tro-theo-vi-tri',
    element: <FindHouseWithLocation />,
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
        path: 'category',
        element: <AdmninCategoriesView />,
      },
      {
        path: 'analytic',
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
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
)
