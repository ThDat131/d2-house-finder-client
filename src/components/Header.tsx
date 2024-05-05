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
  IconButton,
  ListItem,
  Avatar,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { signout } from '../app/slice/auth.slice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import { useEffect, useState } from 'react'
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
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Notification } from '../model/notification/notification'
import { getNotificationByUserId } from '../app/firebase/function'
import moment from 'moment'

export const Header = (): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [showUserOpts, setShowUserOpts] = useState<boolean>(false)
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notification, setNotification] = useState<Notification[]>([])
  const categoryState = useAppSelector((state: RootState) => state.category)
  const currentUser = useAppSelector((state: RootState) => state.auth.auth.user)

  const handleSignout = () => {
    dispatch(signout())
    navigate('/dang-nhap')
  }

  const parseDateString = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ')
    const [dayStr, monthStr, yearStr] = datePart.split('/')
    const [hoursStr, minutesStr, secondsStr] = timePart.split(':')
    const day = parseInt(dayStr, 10)
    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)
    const hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr, 10)
    const seconds = parseInt(secondsStr, 10)

    return new Date(year, month - 1, day, hours, minutes, seconds)
  }

  useEffect(() => {
    if (!showNotification) return

    getNotificationByUserId(currentUser._id).then(res => {
      const array = Object.keys(res).map(key => ({
        ...res[key],
      }))

      array.forEach(x => (x.createdAt = parseDateString(x.createdAt)))

      array.sort((a, b) => b.createdAt - a.createdAt)

      setNotification(array)
    })
  }, [showNotification])

  const handleChangeCategory = (evt: SelectChangeEvent) => {
    const value = evt.target.value

    dispatch(
      selectCategory(
        categoryState.category.find(x => x._id === value) as Category,
      ),
    )

    if (value === undefined) {
      navigate('/')
      return
    }

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

  const handleShowNotification = () => {
    setShowNotification(prev => !prev)

    if (showUserOpts) {
      setShowUserOpts(false)
    }
  }

  const handleShowUserOpts = () => {
    setShowUserOpts(prev => !prev)

    if (showNotification) {
      setShowNotification(false)
    }
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
          <FormControl>
            <InputLabel
              shrink={false}
              id="category-select"
              style={{ color: '#fff', textTransform: 'uppercase' }}
            >
              {!categoryState.selected?._id && t('header.category')}
            </InputLabel>
            <Select
              labelId="category-select"
              disableUnderline={true}
              value={categoryState.selected?._id}
              sx={{
                color: '#fff',
                '.MuiSvgIcon-root ': {
                  fill: '#fff',
                },
                minWidth: 130,
                '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' },
                textTransform: 'uppercase',
              }}
              onChange={evt => {
                handleChangeCategory(evt)
              }}
            >
              <MenuItem
                value={undefined}
                sx={{
                  textTransform: 'uppercase',
                }}
              >
                <em>--{t('header.category')}--</em>
              </MenuItem>
              {Array.isArray(categoryState.category) &&
                categoryState.category.map(c => (
                  <MenuItem
                    key={c._id}
                    value={c._id}
                    sx={{
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {currentUser?._id !== '' ? (
            <Box sx={{ marginLeft: 'auto' }}>
              <Stack
                direction={'row'}
                alignItems={'center'}
                gap={1}
                position={'relative'}
                sx={{ cursor: 'pointer' }}
              >
                <IconButton
                  onClick={() => {
                    handleShowNotification()
                  }}
                >
                  <NotificationsIcon
                    fontSize="large"
                    style={{ color: '#fff' }}
                  />
                </IconButton>
                {showNotification && (
                  <Box
                    position={'absolute'}
                    top={60}
                    right={0}
                    bgcolor={'#fff'}
                    minWidth={300}
                    borderRadius={2}
                  >
                    <Paper
                      sx={{
                        height: 1,
                        borderRadius: 2,
                        maxHeight: '80vh',
                        overflowY: 'scroll',
                      }}
                    >
                      <List sx={{ p: 2, borderRadius: 2, overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                          {t('header.notifications')}
                        </Typography>
                        {notification.map(x => (
                          <ListItem
                            key={x.id}
                            sx={{ borderRadius: 2 }}
                            onClick={() => {
                              navigate(x.actionUrl)
                            }}
                          >
                            <Stack direction={'row'} spacing={2} py={1}>
                              <Avatar
                                sx={{ width: 50, height: 50 }}
                                src={x.sendFrom.avatar}
                              />
                              <Stack spacing={1}>
                                <Typography>{x.content}</Typography>
                                <Typography sx={{ fontSize: 12 }}>
                                  {moment(x.createdAt)
                                    .startOf('hour')
                                    .fromNow()}
                                </Typography>
                              </Stack>
                            </Stack>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Box>
                )}
                <Box
                  borderRadius={'50%'}
                  width={50}
                  height={50}
                  component={'img'}
                  src={currentUser?.avatar}
                  onClick={() => {
                    handleShowUserOpts()
                  }}
                />
                {showUserOpts && (
                  <Box
                    position={'absolute'}
                    top={60}
                    right={0}
                    bgcolor={'#fff'}
                    minWidth={180}
                    borderRadius={2}
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
