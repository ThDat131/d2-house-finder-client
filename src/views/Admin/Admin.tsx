import AdminSideNavBar from '../../components/NavBar/AdminSideNavbar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Admin = (): JSX.Element => {
    return <Box display={'flex'}>
        <AdminSideNavBar />
        <Box padding={1} minHeight={'100vh'} >
            <Outlet />
        </Box>
    </Box >;
};

export default Admin;