import AdminSideNavBar from '../../components/NavBar/AdminSideNavbar'
import { Box } from '@mui/material'
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
    <Box display={'flex'}>
      <AdminSideNavBar />
      <Box padding={3} minHeight={'100vh'} flex={1}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Admin
