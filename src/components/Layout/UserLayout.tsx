import { Box, Container, Stack } from '@mui/material'
import { Header } from '../Header'
import HeaderSearch from '../HeaderSearch'
import Footer from '../Footer'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { useEffect, useRef } from 'react'
import { getCategories } from '../../app/slice/category.slice'
import { getCurrentUser, signout } from '../../app/slice/auth.slice'
import Loading from '../Loading'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  haveSearch: boolean
  fluid?: boolean
}

export const UserLayout: React.FC<Props> = ({
  children,
  haveSearch,
  fluid,
}): JSX.Element => {
  const categoryState = useAppSelector((state: RootState) => state.category)
  const isRefreshToken = useAppSelector(
    (state: RootState) => state.auth.isRefreshToken,
  )
  const currentUserRef = useRef(false)
  const categoryRef = useRef(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('lang', 'vn')
    const fetchData = async () => {
      let currentUserPromise
      let categoryPromise

      if (!categoryRef.current) {
        categoryPromise = dispatch(getCategories({ current: 1, pageSize: 999 }))
      }

      if (!currentUserRef.current) {
        currentUserPromise = dispatch(getCurrentUser())
      }

      await Promise.all([categoryPromise, currentUserPromise])
    }

    fetchData()

    return () => {
      dispatch(getCurrentUser())
      currentUserRef.current = true
      categoryRef.current = true
    }
  }, [])

  useEffect(() => {
    if (isRefreshToken) {
      dispatch(signout())
      navigate('/dang-nhap')
    }
  }, [isRefreshToken])

  if (categoryState.loading) {
    return <Loading />
  }

  return (
    <Stack height={1}>
      <Header />
      {haveSearch && <HeaderSearch />}
      {fluid ? (
        <Box flex={1}>{children}</Box>
      ) : (
        <Container sx={{ mt: 2, flex: 1 }} maxWidth="lg">
          {children}
        </Container>
      )}
      <Footer />
    </Stack>
  )
}

export default UserLayout
