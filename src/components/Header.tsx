import { AppBar, Box, Typography, Toolbar, Button, Tabs, Tab } from '@mui/material'
import HouseIcon from '@mui/icons-material/House'
import { useNavigate } from 'react-router-dom'
import { signout } from '../app/slice/auth.slice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'

export const Header = (): JSX.Element => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const categories = useAppSelector((state: RootState) => state.category)
    const currentUser = useAppSelector((state: RootState) => state.auth.user)

    const handleSignout = () => {
        dispatch(signout())
    }

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
            {
                currentUser.id !== ''
                    ? < Box sx={{ marginLeft: 'auto' }}>
                        <Box component={'img'} src={currentUser.avatar} />
                        <Button sx={{ color: '#fff' }} onClick={handleSignout} >Đăng xuất</Button>
                    </Box>
                    : <Box sx={{ marginLeft: 'auto' }}>
                        <Button sx={{ color: '#fff' }} onClick={() => { navigate('/dang-nhap') }}>Đăng nhập</Button>
                        <Button sx={{ color: '#fff' }} onClick={() => { navigate('dang-ky') }}>Đăng ký</Button>
                    </Box>
            }
        </Toolbar >
    </AppBar >
}
