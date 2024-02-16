import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  Button,
  Tabs,
  Tab,
} from '@mui/material'
import HouseIcon from '@mui/icons-material/House'
import { useNavigate } from 'react-router-dom'
import { signout } from '../app/slice/auth.slice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import { useEffect, useState } from 'react'

export const Header = (): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(true)
  const categories = useAppSelector(
    (state: RootState) => state.category?.category,
  )
  const currentUser = useAppSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleSignout = () => {
    dispatch(signout())
  }

  return loading ? (
    <div>Loading</div>
  ) : (
    <AppBar position="sticky">
      <Toolbar>
        <HouseIcon />
        <Typography mr={2}>Nhà trọ D2</Typography>
        <Tabs value={'main'} textColor={'inherit'}>
          <Tab label="Trang chủ" value={'main'} />
          {Array.isArray(categories) ? (
            categories.map(c => (
              <Tab key={c._id} label={c.name} value={c.name} />
            ))
          ) : (
            <></>
          )}
        </Tabs>
        {currentUser?._id !== '' ? (
          <Box sx={{ marginLeft: 'auto' }}>
            <Box component={'img'} src={currentUser?.avatar} />
            <Button sx={{ color: '#fff' }} onClick={handleSignout}>
              Đăng xuất
            </Button>
          </Box>
        ) : (
          <Box sx={{ marginLeft: 'auto' }}>
            <Button
              sx={{ color: '#fff' }}
              onClick={() => {
                navigate('/dang-nhap')
              }}
            >
              Đăng nhập
            </Button>
            <Button
              sx={{ color: '#fff' }}
              onClick={() => {
                navigate('dang-ky')
              }}
            >
              Đăng ký
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
