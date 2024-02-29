import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  Button,
  Tabs,
  Tab,
  Stack,
  Paper,
  List,
  ListItemButton,
} from '@mui/material'
import HouseIcon from '@mui/icons-material/House'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, signout } from '../app/slice/auth.slice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import { useEffect, useRef, useState } from 'react'
import Loading from './Loading'
import { useTranslation } from 'react-i18next'
import { getCategories } from '../app/slice/category.slice'

export const Header = (): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [loading, setLoading] = useState<boolean>(true)
  const [showUserOpts, setShowUserOpts] = useState<boolean>(false)
  const categories = useAppSelector(
    (state: RootState) => state.category?.category,
  )
  const currentUser = useAppSelector((state: RootState) => state.auth.user)
  const currentUserRef = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      let categoryPromise
      let currentUserPromise

      if (!categories || categories.length <= 0) {
        categoryPromise = dispatch(getCategories())
      }

      if (!currentUserRef.current) {
        currentUserPromise = dispatch(getCurrentUser())
      }

      await Promise.all([categoryPromise, currentUserPromise])

      setLoading(false)
    }

    fetchData()

    return () => {
      dispatch(getCurrentUser())
      currentUserRef.current = true
    }
  }, [])

  const handleSignout = () => {
    dispatch(signout())
  }

  const handleNavigate = (value: string) => {
    navigate(value)
  }

  return loading ? (
    <Loading />
  ) : (
    <AppBar position="sticky">
      <Toolbar>
        <HouseIcon />
        <Typography mr={2}>Nhà trọ D2</Typography>
        <Tabs value={'main'} textColor={'inherit'}>
          <Tab
            label="Trang chủ"
            value={'main'}
            onClick={() => {
              navigate('/')
            }}
          />
          {Array.isArray(categories) ? (
            categories.map(c => (
              <Tab
                key={c._id}
                label={c.name}
                value={c.name}
                onClick={() => {
                  handleNavigate(c._id)
                }}
              />
            ))
          ) : (
            <></>
          )}
        </Tabs>
        {currentUser?._id !== '' ? (
          <Box sx={{ marginLeft: 'auto' }}>
            <Stack
              direction={'row'}
              alignItems={'center'}
              gap={1}
              position={'relative'}
              onClick={() => {
                setShowUserOpts(prev => !prev)
              }}
              sx={{ cursor: 'pointer' }}
            >
              <Typography>
                {t('header.hello', { name: currentUser.fullName })}
              </Typography>
              <Box
                borderRadius={'50%'}
                width={50}
                height={50}
                component={'img'}
                src={currentUser?.avatar}
              />
              {showUserOpts && (
                <Box position={'absolute'} top={60} right={0} bgcolor={'#fff'}>
                  <Paper sx={{ height: 1 }}>
                    <List>
                      <ListItemButton
                        onClick={() => {
                          navigate('/quan-ly/dang-tin-moi')
                        }}
                      >
                        {t('header.postAnArticle')}
                      </ListItemButton>
                      <ListItemButton>
                        {t('header.manageArticles')}
                      </ListItemButton>
                      <ListItemButton>
                        {t('header.personalInformation')}
                      </ListItemButton>
                      <ListItemButton onClick={handleSignout}>
                        {t('header.signout')}
                      </ListItemButton>
                    </List>
                  </Paper>
                </Box>
              )}
            </Stack>
          </Box>
        ) : (
          <Box sx={{ marginLeft: 'auto' }}>
            <Button
              sx={{ color: '#fff' }}
              onClick={() => {
                navigate('/dang-nhap')
              }}
            >
              {t('header.signin')}
            </Button>
            <Button
              sx={{ color: '#fff' }}
              onClick={() => {
                navigate('dang-ky')
              }}
            >
              {t('header.signup')}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
