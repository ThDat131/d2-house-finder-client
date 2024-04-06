import { Box, Container, Stack } from '@mui/material'
import { Header } from '../Header'
import HeaderSearch from '../HeaderSearch'
import Footer from '../Footer'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { useEffect, useRef } from 'react'
import { getCategories } from '../../app/slice/category.slice'
import { getCurrentUser } from '../../app/slice/auth.slice'
import Loading from '../Loading'

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
  const currentUserRef = useRef(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchData = async () => {
      let categoryPromise
      let currentUserPromise

      if (!categoryState.category || categoryState.category.length <= 0) {
        categoryPromise = dispatch(getCategories())
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
    }
  }, [])

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
