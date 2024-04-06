import { Box, CircularProgress, Container } from '@mui/material'
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
}

export const UserLayout: React.FC<Props> = ({
  children,
  haveSearch,
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
    <>
      <Header />
      {haveSearch && <HeaderSearch />}
      <Container sx={{ mt: 2, minHeight: '50vw' }}>{children}</Container>
      <Footer />
    </>
  )
}

export default UserLayout
