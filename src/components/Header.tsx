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
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { signout } from '../app/slice/auth.slice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectCategory } from '../app/slice/category.slice'
import Logo from '../assets/image/logo/D2-logos_white.png'
import {
  setAcreageFilter,
  setFilterQuery,
  setPriceFilter,
} from '../app/slice/filter.slice'
import { Category } from '../model/category/category'
import { selectProvince } from '../app/slice/province.slice'
import { selectDistrict } from '../app/slice/district.slice'
import { selectWard } from '../app/slice/ward.slice'

export const Header = (): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [showUserOpts, setShowUserOpts] = useState<boolean>(false)
  const categoryState = useAppSelector((state: RootState) => state.category)
  const currentUser = useAppSelector((state: RootState) => state.auth.user)

  const handleSignout = () => {
    dispatch(signout())
    navigate('/dang-nhap')
  }

  const handleChangeCategory = (evt: SelectChangeEvent) => {
    const value = evt.target.value

    dispatch(
      selectCategory(
        categoryState.category.find(x => x._id === value) as Category,
      ),
    )

    const filterString = `?categoryId=${value}`
    handleClearFilter({ category: false })
    dispatch(setFilterQuery(filterString))
    navigate(`/danh-muc/${value}`)
  }

  const handleClearFilter = ({ category }: { category: boolean }) => {
    if (category) {
      dispatch(selectCategory(null))
    }
    dispatch(setFilterQuery(''))
    dispatch(setPriceFilter([0, 0]))
    dispatch(setAcreageFilter([0, 0]))
    dispatch(selectProvince(null))
    dispatch(selectDistrict(null))
    dispatch(selectWard(null))
  }

  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar sx={{ gap: 2 }}>
          <Box
            width={80}
            height={80}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/')
            }}
          >
            <Box component={'img'} src={Logo} width={1} height={1} />
          </Box>
          <Tabs textColor="secondary" value={''}>
            <Tab
              component={Link}
              to={'/'}
              label={t('header.home')}
              value={''}
              sx={{ color: '#fff' }}
            />
            <Tab
              component={Link}
              to={'/tim-tro-theo-vi-tri'}
              label={t('header.smartSearch')}
              value={'smartSearch'}
              sx={{ color: '#fff' }}
            />
          </Tabs>
          <Select
            disableUnderline={true}
            variant="standard"
            value={categoryState.selected?._id}
            sx={{
              color: '#fff',
              '.MuiSvgIcon-root ': {
                fill: '#fff',
              },
            }}
            onChange={evt => {
              if (evt.target.value === undefined) return

              handleChangeCategory(evt)
            }}
            displayEmpty
          >
            <MenuItem value={undefined}>{t('header.category')}</MenuItem>
            {Array.isArray(categoryState.category) &&
              categoryState.category.map(c => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
          </Select>

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
