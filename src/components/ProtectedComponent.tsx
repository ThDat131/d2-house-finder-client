import { ReactNode } from 'react'
import { useAppSelector } from '../app/hooks'
import { RootState } from '../app/store'

const ProtectedComponent = ({
  role,
  children,
}: {
  role: string
  children: ReactNode
}) => {
  const currentRole = useAppSelector(
    (root: RootState) => root.auth.auth.user.role.name,
  )

  if (currentRole.toUpperCase().includes('ADMIN')) return children ?? <></>

  if (role !== currentRole) return <></>

  return children ?? <></>
}

export default ProtectedComponent
