import { Box, Grid } from '@mui/material'
import UserSideNavbar from '../../components/NavBar/UserSideNavbar'
import { Outlet } from 'react-router-dom'
import UserLayout from '../../components/Layout/UserLayout'

const GeneralManagement = (): JSX.Element => {
  return (
    <UserLayout haveSearch={false} fluid={true}>
      <Box
        display={'flex'}
        alignItems={'stretch'}
        flexDirection={'row'}
        minHeight={1}
      >
        <UserSideNavbar />
        <Grid container p={4} width={1} height={1} direction={'column'}>
          <Outlet />
        </Grid>
      </Box>
    </UserLayout>
  )
}

export default GeneralManagement
