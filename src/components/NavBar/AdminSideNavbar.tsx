import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { type CSSProperties, useState } from 'react'
import LegendToggleIcon from '@mui/icons-material/LegendToggle'
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

const AdminSideNavBar = (): JSX.Element => {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [selectedChildUrl, setSelectedChildUrl] = useState<string>('')
  const [open, setOpen] = useState<boolean>(true)
  const [expanded, setExpanded] = useState(-1)

  const navigate = useNavigate()
  const overviewData = [
    {
      id: 1,
      title: t('admin.sideNav.application'),
      icon: <LegendToggleIcon />,
      url: '/admin',
    },
    {
      id: 2,
      title: t('admin.sideNav.statistic'),
      icon: <InsightsIcon />,
      url: '/admin/statistic',
    },
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

  const requestsData = [
    {
      id: 6,
      title: t('admin.sideNav.landlordRequest'),
      icon: <AccountCircleIcon />,
      url: '/admin/landlord-requests',
    },
  ]

  const headingStyle: CSSProperties = {
    paddingLeft: 10,
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

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{ minWidth: 200, height: 1, position: 'relative' }}
      open={open}
      PaperProps={{ sx: { minWidth: 200, position: 'absolute', right: 0 } }}
    >
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
              <ListItem key={x.title} disablePadding>
                <ListItemButton
                  className="parent"
                  onClick={() => {
                    navigate(x.url)
                    setSelectedIndex(x.id)
                    setSelectedChildUrl('')
                    setExpanded(-1)
                  }}
                  selected={selectedIndex === x.id}
                >
                  <ListItemIcon>{x.icon}</ListItemIcon>
                  <ListItemText primary={x.title} />
                </ListItemButton>
              </ListItem>
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
              <ListItem key={x.title} disablePadding>
                <Accordion
                  disableGutters
                  elevation={0}
                  expanded={x.id === expanded}
                >
                  <AccordionSummary
                    sx={{ paddingRight: 3 }}
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() => {
                      x.id === selectedIndex
                        ? setSelectedIndex(-1)
                        : setSelectedIndex(x.id)
                      x.id === expanded ? setExpanded(-1) : setExpanded(x.id)
                    }}
                  >
                    <ListItemButton selected={selectedIndex === x.id}>
                      <ListItemIcon>{x.icon}</ListItemIcon>
                      <ListItemText primary={x.title} />
                    </ListItemButton>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List sx={childListStyle}>
                      <ListItem>
                        <ListItemButton
                          sx={{ pl: 5 }}
                          selected={selectedChildUrl === `${x.url}/create`}
                          onClick={() => {
                            setSelectedIndex(x.id)
                            navigate(`${x.url}/create`)
                            setSelectedChildUrl(`${x.url}/create`)
                          }}
                        >
                          <ListItemIcon>
                            <AddIcon />
                          </ListItemIcon>
                          <ListItemText primary={t('admin.sideNav.create')} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem>
                        <ListItemButton
                          sx={{ pl: 5 }}
                          selected={selectedChildUrl === x.url}
                          onClick={() => {
                            navigate(`${x.url}`)
                            setSelectedChildUrl(x.url)
                          }}
                        >
                          <ListItemIcon>
                            <ListIcon />
                          </ListItemIcon>
                          <ListItemText primary={t('admin.sideNav.list')} />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </ListItem>
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
              <ListItem key={x.title} disablePadding>
                <ListItemButton
                  className="parent"
                  onClick={() => {
                    navigate(x.url)
                    setSelectedIndex(x.id)
                    setSelectedChildUrl('')
                    setExpanded(-1)
                  }}
                  selected={selectedIndex === x.id}
                >
                  <ListItemIcon>{x.icon}</ListItemIcon>
                  <ListItemText primary={x.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Drawer>
  )
}

export default AdminSideNavBar
