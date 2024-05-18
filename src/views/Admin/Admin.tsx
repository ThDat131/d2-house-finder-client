import AdminSideNavBar from '../../components/NavBar/AdminSideNavbar'
import { Box, Grid } from '@mui/material'
import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getCurrentUser, signout } from '../../app/slice/auth.slice'
import { RootState } from '../../app/store'

const Admin = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUserRef = useRef(false)
  const isRefreshToken = useAppSelector(
    (state: RootState) => state.auth.isRefreshToken,
  )

  useEffect(() => {
    if (location.pathname === '/admin/') {
      localStorage.setItem('adminChildUrl', '')
      localStorage.setItem('adminNavigationPage', '-1')
    }
  }, [])

  useEffect(() => {
    if (!currentUserRef.current) {
      dispatch(getCurrentUser())
    }

    return () => {
      currentUserRef.current = true
    }
  }, [dispatch])

  useEffect(() => {
    if (isRefreshToken) {
      dispatch(signout())
      navigate('/dang-nhap')
    }
  }, [isRefreshToken])

  return (
    <Grid container height={1}>
      <Grid item xs={2} flex={1} overflow={'hidden'}>
        <Box width={1} height={1}>
          <AdminSideNavBar />
        </Box>
      </Grid>
      <Grid item container xs={10} direction={'column'} padding={3} height={1}>
        <Outlet />
      </Grid>
    </Grid>
  )
}

export default Admin
