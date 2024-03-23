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
  Container,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, signout } from '../app/slice/auth.slice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import { useEffect, useRef, useState } from 'react'
import Loading from './Loading'
import { useTranslation } from 'react-i18next'
import { getCategories } from '../app/slice/category.slice'
import Logo from '../assets/image/logo/D2-logos_white.png'

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
  const [selectedCategory, setSelectedCategory] = useState('main')

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
    navigate('/dang-nhap')
  }

  const handleChangeCategory = (evt: React.SyntheticEvent, value: string) => {
    setSelectedCategory(value)
    value === 'main' ? navigate('/') : navigate(`/danh-muc/${value}`)
  }
  // #331d66 30%,
  // #3c3fa3 30%,
  //  #4e68f0

  return loading ? (
    <Loading />
  ) : (
    <AppBar position="sticky">
      <Container>
        <Toolbar>
          <Stack
            spacing={1}
            direction={'row'}
            px={2}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/')
            }}
          >
            <Box width={80} height={80}>
              <Box component={'img'} src={Logo} width={1} height={1} />
            </Box>
          </Stack>
          <Tabs
            value={selectedCategory}
            onChange={handleChangeCategory}
            textColor="secondary.main"
            indicatorColor="secondary"
          >
            <Tab key={'main'} label="Trang chủ" value={'main'} />
            {Array.isArray(categories) &&
              categories.map(c => (
                <Tab key={c._id} label={c.name} value={c._id} color={'#fff'} />
              ))}
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
                  <Box
                    position={'absolute'}
                    top={60}
                    right={0}
                    bgcolor={'#fff'}
                  >
                    <Paper sx={{ height: 1 }}>
                      <List>
                        <ListItemButton
                          onClick={() => {
                            navigate('/quan-ly/dang-tin-moi')
                          }}
                        >
                          {t('header.postAnArticle')}
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            navigate('/quan-ly/tin-dang')
                          }}
                        >
                          {t('header.manageArticles')}
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            navigate('/quan-ly/cap-nhat-thong-tin-ca-nhan')
                          }}
                        >
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
      </Container>
    </AppBar>
  )
}
