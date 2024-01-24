import AdminSideNavBar from '../../components/NavBar/AdminSideNavbar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

const Admin = (): JSX.Element => {
    return <Box display={'flex'}>
        <AdminSideNavBar />
        <Box padding={5} minHeight={'100vh'} flex={1} >
            <Outlet />
        </Box>
    </Box >
}

export default Admin
