import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Typography,
  styled,
} from '@mui/material'
import { type CSSProperties, useState, useEffect } from 'react'
import InsightsIcon from '@mui/icons-material/Insights'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import FeedIcon from '@mui/icons-material/Feed'
import CategoryIcon from '@mui/icons-material/Category'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import theme from '../../theme'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import PeopleIcon from '@mui/icons-material/People'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import LogoutIcon from '@mui/icons-material/Logout'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { signout } from '../../app/slice/auth.slice'
import ShieldIcon from '@mui/icons-material/Shield'
import ProtectedComponent from '../ProtectedComponent'
import { ALL_PERMISSION } from '../../app/permissions-root'
import engFlag from '../../assets/image/flag/eng.png'
import vnFlag from '../../assets/image/flag/vn.png'

const currentPage = localStorage.getItem('adminNavigationPage') ?? '1'
const currentChildUrl = localStorage.getItem('adminChildUrl') ?? ''

const AdminSideNavBar = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()

  const [selectedIndex, setSelectedIndex] = useState(parseInt(currentPage))
  const [selectedChildUrl, setSelectedChildUrl] =
    useState<string>(currentChildUrl)
  const [open, setOpen] = useState<boolean>(true)
  const [expanded, setExpanded] = useState(-1)
  const [language, setLanguage] = useState<string>(
    localStorage.getItem('lang') ?? '',
  )

  const user = useAppSelector((state: RootState) => state.auth.auth.user)
  const navigate = useNavigate()
  const overviewData = [
    {
      id: 1,
      title: t('admin.sideNav.statistic'),
      icon: <InsightsIcon />,
      url: '/admin/statistic',
    },
    // {
    //   id: 2,
    //   title: t('admin.sideNav.statistic'),
    //   icon: <InsightsIcon />,
    //   url: '/admin/statistic',
    // },
  ]
  const managementData = [
    {
      id: 3,
      title: t('admin.sideNav.user'),
      icon: <ManageAccountsIcon />,
      url: '/admin/user',
    },
    {
      id: 4,
      title: t('admin.sideNav.post'),
      icon: <FeedIcon />,
      url: '/admin/article',
    },
    {
      id: 5,
      title: t('admin.sideNav.category'),
      icon: <CategoryIcon />,
      url: '/admin/category',
    },
  ]

  const managementDataV2 = [
    {
      id: 7,
      title: t('admin.sideNav.permission'),
      icon: <VpnKeyIcon />,
      url: '/admin/permission',
    },
    {
      id: 8,
      title: t('admin.sideNav.role'),
      icon: <PeopleIcon />,
      url: '/admin/role',
    },
  ]

  const requestsData = [
    {
      id: 6,
      title: t('admin.sideNav.landlordRequest'),
      icon: <AccountCircleIcon />,
      url: '/admin/landlord-requests',
    },
    {
      id: 9,
      title: t('admin.sideNav.verifyArticleRequest'),
      icon: <ShieldIcon />,
      url: '/admin/verify-article-requests',
    },
  ]

  useEffect(() => {
    if (currentPage) setSelectedIndex(parseInt(currentPage))

    if (currentChildUrl) {
      setExpanded(parseInt(currentPage))
      setSelectedChildUrl(currentChildUrl)
    }
  }, [])

  const headingStyle: CSSProperties = {
    padding: 0,
  }

  const listStyle = {
    '&& .Mui-expanded > .MuiAccordionSummary-root.MuiButtonBase-root ': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiAccordionSummary-expandIconWrapper': {
        color: theme.palette.primary.contrastText,
      },
      '& .Mui-selected, && .Mui-selected:hover': {
        '&, & .MuiListItemIcon-root': {
          fontWeight: 700,
          color: theme.palette.primary.contrastText,
        },
        '&, & .MuiListItemText-root > span': {
          fontWeight: 700,
          color: theme.palette.primary.contrastText,
        },
      },
    },
    '&& .Mui-selected.parent, && .Mui-selected:hover.parent': {
      '&, & .MuiListItemIcon-root': {
        fontWeight: 700,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
      '&, & .MuiListItemText-root > span': {
        fontWeight: 700,
        color: theme.palette.primary.contrastText,
      },
    },
  }

  const childListStyle = {
    '&& .Mui-selected, && .Mui-selected:hover': {
      '&, & .MuiListItemIcon-root': {
        fontWeight: 700,
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
      },
      '&, & .MuiListItemText-root > span': {
        fontWeight: 700,
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
      },
    },
  }

  const toggleDrawer =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setOpen(state)
    }

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url(${engFlag})`,
          backgroundSize: '30px 30px',
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      width: 32,
      height: 32,
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${vnFlag})`,
        backgroundSize: '30px 30px',
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#aab4be',
      borderRadius: 20 / 2,
    },
  }))

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{ minWidth: 200, height: 1, position: 'relative' }}
      open={open}
      PaperProps={{ sx: { minWidth: 200, position: 'absolute', right: 0 } }}
    >
      <Stack
        p={2}
        direction={'row'}
        gap={1}
        mb={2}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Avatar src={user.avatar} sx={{ boxShadow: 1 }} />
        <Stack spacing={1}>
          <Typography fontWeight={'bold'}>{user.fullName}</Typography>
        </Stack>
        <MaterialUISwitch
          checked={language === 'en'}
          onChange={(evt, value) => {
            if (language === 'en') {
              i18n.changeLanguage('vn')
              setLanguage('vn')
              localStorage.setItem('lang', 'vn')
            } else {
              i18n.changeLanguage('en')
              setLanguage('en')
              localStorage.setItem('lang', 'en')
            }
          }}
        />
      </Stack>
      <Accordion
        disableGutters
        defaultExpanded
        elevation={0}
        onClick={toggleDrawer(true)}
        onKeyDown={toggleDrawer(true)}
      >
        <AccordionSummary>
          <Typography style={headingStyle} variant={'h4'}>
            {t('admin.sideNav.overview')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={listStyle}>
            {overviewData.map(x => (
              <ProtectedComponent
                key={x.title}
                permissions={
                  x.url.includes('statistic') ? ALL_PERMISSION.STATISTICAL : []
                }
              >
                <ListItem disablePadding>
                  <ListItemButton
                    className="parent"
                    onClick={() => {
                      navigate(x.url)
                      setSelectedIndex(x.id)
                      setSelectedChildUrl('')
                      localStorage.setItem('adminChildUrl', '')
                      setExpanded(-1)
                      localStorage.setItem(
                        'adminNavigationPage',
                        x.id.toString(),
                      )
                    }}
                    selected={selectedIndex === x.id}
                  >
                    <ListItemIcon>{x.icon}</ListItemIcon>
                    <ListItemText primary={x.title} />
                  </ListItemButton>
                </ListItem>
              </ProtectedComponent>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters defaultExpanded elevation={0}>
        <AccordionSummary>
          <Typography style={headingStyle} variant={'h4'}>
            {t('admin.sideNav.manage')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={listStyle}>
            {managementData.map(x => (
              <ProtectedComponent
                key={x.title}
                permissions={
                  x.url.includes('user')
                    ? ALL_PERMISSION.USERS.filter(x => x.method === 'GET')
                    : x.url.includes('article')
                      ? []
                      : x.url.includes('category')
                        ? ALL_PERMISSION.ARTICLES.filter(
                            x => x.method === 'GET',
                          )
                        : []
                }
              >
                <ListItem disablePadding>
                  <Accordion
                    disableGutters
                    elevation={0}
                    expanded={x.id === expanded}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      onClick={() => {
                        x.id === selectedIndex
                          ? setSelectedIndex(-1)
                          : setSelectedIndex(x.id)
                        x.id === expanded ? setExpanded(-1) : setExpanded(x.id)
                      }}
                    >
                      <ListItemButton
                        selected={selectedIndex === x.id}
                        sx={{ padding: 0 }}
                      >
                        <ListItemIcon>{x.icon}</ListItemIcon>
                        <ListItemText primary={x.title} />
                      </ListItemButton>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List sx={childListStyle}>
                        <ListItem>
                          <ProtectedComponent
                            permissions={
                              x.url.includes('user')
                                ? ALL_PERMISSION.USERS.filter(
                                    x => x.method === 'POST',
                                  )
                                : x.url.includes('article')
                                  ? ALL_PERMISSION.ARTICLES.filter(
                                      x => x.method === 'POST',
                                    )
                                  : x.url.includes('category')
                                    ? ALL_PERMISSION.ARTICLES.filter(
                                        x => x.method === 'POST',
                                      )
                                    : []
                            }
                          >
                            <ListItemButton
                              sx={{ pl: 5 }}
                              selected={selectedChildUrl === `${x.url}/create`}
                              onClick={() => {
                                setSelectedIndex(x.id)
                                navigate(`${x.url}/create`)
                                setSelectedChildUrl(`${x.url}/create`)
                                localStorage.setItem(
                                  'adminChildUrl',
                                  `${x.url}/create`,
                                )

                                localStorage.setItem(
                                  'adminNavigationPage',
                                  x.id.toString(),
                                )
                                setExpanded(x.id)
                              }}
                            >
                              <ListItemIcon>
                                <AddIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={t('admin.sideNav.create')}
                              />
                            </ListItemButton>
                          </ProtectedComponent>
                        </ListItem>
                        <ListItem>
                          <ProtectedComponent
                            permissions={
                              x.url.includes('user')
                                ? ALL_PERMISSION.USERS.filter(
                                    x =>
                                      x.method === 'PUT' ||
                                      x.method === 'PATCH',
                                  )
                                : x.url.includes('article')
                                  ? []
                                  : x.url.includes('category')
                                    ? ALL_PERMISSION.ARTICLES.filter(
                                        x =>
                                          x.method === 'PUT' ||
                                          x.method === 'PATCH',
                                      )
                                    : []
                            }
                          >
                            <ListItemButton
                              sx={{ pl: 5 }}
                              selected={selectedChildUrl === x.url}
                              onClick={() => {
                                navigate(`${x.url}`)
                                setSelectedChildUrl(x.url)
                                localStorage.setItem(
                                  'adminNavigationPage',
                                  x.id.toString(),
                                )
                                localStorage.setItem('adminChildUrl', x.url)
                              }}
                            >
                              <ListItemIcon>
                                <ListIcon />
                              </ListItemIcon>
                              <ListItemText primary={t('admin.sideNav.list')} />
                            </ListItemButton>
                          </ProtectedComponent>
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              </ProtectedComponent>
            ))}
          </List>
          <List sx={listStyle}>
            {managementDataV2.map(x => (
              <ProtectedComponent
                key={x.id}
                permissions={
                  x.url.includes('permission')
                    ? ALL_PERMISSION.PERMISSIONS.filter(x => x.method === 'GET')
                    : x.url.includes('role')
                      ? ALL_PERMISSION.USERS.filter(x => x.method === 'GET')
                      : []
                }
              >
                <ListItem sx={{ mb: 1 }}>
                  <ListItemButton
                    className="parent"
                    selected={selectedIndex === x.id}
                    sx={{ pl: 2 }}
                    onClick={() => {
                      navigate(x.url)
                      setSelectedIndex(x.id)
                      setSelectedChildUrl('')
                      setExpanded(-1)
                      localStorage.setItem('adminChildUrl', '')
                      localStorage.setItem(
                        'adminNavigationPage',
                        x.id.toString(),
                      )
                    }}
                  >
                    <ListItemIcon>{x.icon}</ListItemIcon>
                    <ListItemText primary={x.title} />
                  </ListItemButton>
                </ListItem>
              </ProtectedComponent>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters defaultExpanded elevation={0}>
        <AccordionSummary>
          <Typography style={headingStyle} variant={'h4'}>
            {t('admin.sideNav.requests')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={listStyle}>
            {requestsData.map(x => (
              <ProtectedComponent
                key={x.id}
                permissions={
                  x.url.includes('landlord')
                    ? ALL_PERMISSION['LANDLORD-REQUEST'].filter(
                        x => x.method === 'GET',
                      )
                    : x.url.includes('article')
                      ? ALL_PERMISSION.VERIFICATIONS.filter(
                          x => x.method === 'GET',
                        )
                      : []
                }
              >
                <ListItem key={x.title} disablePadding>
                  <ListItemButton
                    className="parent"
                    onClick={() => {
                      navigate(x.url)
                      setSelectedIndex(x.id)
                      setSelectedChildUrl('')
                      setExpanded(-1)
                      localStorage.setItem('adminChildUrl', '')
                      localStorage.setItem(
                        'adminNavigationPage',
                        x.id.toString(),
                      )
                    }}
                    selected={selectedIndex === x.id}
                  >
                    <ListItemIcon>{x.icon}</ListItemIcon>
                    <ListItemText primary={x.title} />
                  </ListItemButton>
                </ListItem>
              </ProtectedComponent>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters defaultExpanded elevation={0}>
        <AccordionSummary>
          <Typography style={headingStyle} variant={'h4'}>
            {t('admin.sideNav.action')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={listStyle}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate('/')
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary={t('admin.sideNav.goToMain')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  dispatch(signout())
                  navigate('/dang-nhap')
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={t('admin.sideNav.signOut')} />
              </ListItemButton>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Drawer>
  )
}

export default AdminSideNavBar
