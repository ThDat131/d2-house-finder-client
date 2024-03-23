import { Box } from '@mui/material'
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
        minHeight={1}
      >
        <UserSideNavbar />
        <Box
          p={4}
          width={1}
          height={1}
          display={'flex'}
          flexDirection={'column'}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  )
}

export default GeneralManagement
