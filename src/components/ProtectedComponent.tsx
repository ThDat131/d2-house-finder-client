import { ReactNode, useEffect, useState } from 'react'
import _ from 'lodash'
import { useAppSelector } from '../app/hooks'
import { userPermissions } from '../app/slice/auth.slice'

const ProtectedComponent = ({
  permissions,
  children,
  allowAnonymous,
}: {
  permissions: any
  children: ReactNode
  allowAnonymous?: boolean
}) => {
  const currentPermissions = useAppSelector(userPermissions)

  const [isShow, setIsShow] = useState<any[]>([])
  useEffect(() => {
    setIsShow(
      _.differenceWith(permissions, currentPermissions as any, _.isEqual),
    )
  }, [permissions])

  if (allowAnonymous && currentPermissions?.length === 0)
    return children ?? <></>

  if (isShow.length > 0) {
    return <></>
  }

  return children ?? <></>
}

export default ProtectedComponent
