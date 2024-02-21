import { Box, Grid } from '@mui/material'
import { Header } from '../../components/Header'
import UserSideNavbar from '../../components/NavBar/UserSideNavbar'
import { Outlet } from 'react-router-dom'

const GeneralManagement = (): JSX.Element => {
  return (
    <>
      <Header />
      <Box
        display={'flex'}
        alignItems={'stretch'}
        flexDirection={'row'}
        minHeight={'100%'}
        height={'100%'}
      >
        <UserSideNavbar />
        <Outlet />
      </Box>
    </>
  )
}

export default GeneralManagement
