import { AppBar, Box, Typography, Toolbar, Button, Tabs, Tab, styled } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';

export const Header = (): JSX.Element => {
    const categories = useSelector((state: RootState) => state.category);

    return <AppBar position='sticky'>
        <Toolbar>
            <HouseIcon />
            <Typography mr={2}>Nhà trọ D2</Typography>
            <Tabs value={'main'} textColor={'inherit'}>
                <Tab label='Trang chủ' value={'main'} />
                {
                    categories.map((c, index) => <Tab key={index} label={c.name} value={c.name} />)
                }
            </Tabs>
            <Box sx={{ marginLeft: 'auto' }}>
                <Button sx={{ color: '#fff' }}>Đăng nhập</Button>
                <Button sx={{ color: '#fff' }}>Đăng ký</Button>
            </Box>
        </Toolbar >
    </AppBar >;
};
