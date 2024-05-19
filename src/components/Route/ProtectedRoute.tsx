import { ReactNode, useRef } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from '../../app/custom-hook/useEffectOnce'

const ProtectedRoute = ({
  redirectTo = '/dang-nhap',
  children,
}: {
  redirectTo?: string
  children: ReactNode
}) => {
  const { t } = useTranslation()
  const currentUser = useAppSelector((root: RootState) => root.auth.auth.user)
  const ref = useRef(false)

  useEffectOnce(() => {
    if (!ref.current) {
      ref.current = true

      if (!currentUser?._id) {
        toast.warn(t('home.pleaseSignInToContinue'))
      }
    }

    return () => {
      ref.current = false
    }
  })

  if (!currentUser?._id) {
    return <Navigate to={redirectTo} />
  }
  return children ?? <Outlet />
}

export default ProtectedRoute
