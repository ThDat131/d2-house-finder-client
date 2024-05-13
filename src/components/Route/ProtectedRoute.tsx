import { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'

const ProtectedRoute = ({
  redirectTo = '/dang-nhap',
  children,
}: {
  redirectTo?: string
  children: ReactNode
}) => {
  const currentUser = useAppSelector((root: RootState) => root.auth.auth.user)

  if (!currentUser) {
    return <Navigate to={redirectTo} />
  }
  return children ?? <Outlet />
}

export default ProtectedRoute
