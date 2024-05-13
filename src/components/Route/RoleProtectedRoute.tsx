import { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'

const RoleProtectedRoute = ({
  redirectTo = '/not-found',
  role,
  children,
}: {
  redirectTo?: string
  role: string
  children: ReactNode
}) => {
  const currentRole = useAppSelector(
    (root: RootState) => root.auth.auth.user.role.name,
  )

  if (currentRole.toUpperCase().includes('ADMIN')) return children ?? <Outlet />

  if (role !== currentRole) return <Navigate to={redirectTo} />

  return children ?? <Outlet />
}

export default RoleProtectedRoute
