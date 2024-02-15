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

const AdminSideNavBar = (): JSX.Element => {
  const { t } = useTranslation()

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
      url: '/admin/post',
    },
    {
      id: 5,
      title: t('admin.sideNav.category'),
      icon: <CategoryIcon />,
      url: '/admin/category',
    },
  ]

  const headingStyle: CSSProperties = {
    paddingLeft: 10,
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
      sx={{ width: 200 }}
      open={open}
      PaperProps={{ sx: { width: '10%', minWidth: 200 } }}
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
          <List>
            {overviewData.map(x => (
              <ListItem key={x.title} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(x.url)
                  }}
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
          <List>
            {managementData.map(x => (
              <ListItem key={x.title} disablePadding>
                <Accordion
                  disableGutters
                  elevation={0}
                  expanded={x.id === expanded}
                >
                  <AccordionSummary>
                    <ListItemButton
                      onClick={() => {
                        setExpanded(x.id)
                        navigate(x.url)
                      }}
                    >
                      <ListItemIcon>{x.icon}</ListItemIcon>
                      <ListItemText primary={x.title} />
                    </ListItemButton>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItem>
                        <ListItemButton
                          onClick={() => {
                            navigate(`${x.url}/create`)
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
                          onClick={() => {
                            navigate(`${x.url}`)
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
    </Drawer>
  )
}

export default AdminSideNavBar
