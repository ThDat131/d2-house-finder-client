import { ReactNode, useEffect, useState } from 'react'
import _ from 'lodash'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { userPermissions } from '../../app/slice/auth.slice'
import { RootState } from '../../app/store'

const RoleProtectedRoute = ({
  redirectTo = '/not-found',
  permissions,
  children,
  role,
}: {
  redirectTo?: string
  permissions: any
  children: ReactNode
  role?: string
}) => {
  const currentPermissions = useAppSelector(userPermissions)
  const currentUser = useAppSelector((state: RootState) => state.auth.auth.user)
  const [isShow, setIsShow] = useState<any[]>([])
  useEffect(() => {
    setIsShow(
      _.differenceWith(permissions, currentPermissions as any, _.isEqual),
    )
  }, [permissions])

  if (role) {
    return currentUser.role.name.includes(role) ? (
      children
    ) : (
      <Navigate to={redirectTo} />
    )
  }

  if (isShow.length > 0) {
    return <Navigate to={redirectTo} />
  }

  return children ?? <Outlet />
}

export default RoleProtectedRoute
