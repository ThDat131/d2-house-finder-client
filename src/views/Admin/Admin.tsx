import AdminSideNavBar from '../../components/NavBar/AdminSideNavbar'
import { Box, Grid } from '@mui/material'
import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { getCurrentUser } from '../../app/slice/auth.slice'

const Admin = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const currentUserRef = useRef(false)

  useEffect(() => {
    if (!currentUserRef.current) {
      dispatch(getCurrentUser())
    }

    return () => {
      currentUserRef.current = true
    }
  }, [dispatch])

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
