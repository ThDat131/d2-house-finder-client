import {
  Avatar,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { useTranslation } from 'react-i18next'
import ShieldIcon from '@mui/icons-material/Shield'
import ProtectedComponent from '../ProtectedComponent'
import { ALL_PERMISSION } from '../../app/permissions-root'

const UserSideNavbar = () => {
  const currentPage = localStorage.getItem('userNavigationPage') ?? '1'

  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAppSelector((state: RootState) => state.auth.auth.user)
  const [selectedIndex, setSelectedIndex] = useState(parseInt(currentPage))

  useEffect(() => {
    setSelectedIndex(parseInt(currentPage))
  }, [currentPage])

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
    localStorage.setItem('userNavigationPage', index.toString())
  }

  const ListItemButtonStyle: React.CSSProperties = {
    justifyContent: 'flex-start',
    gap: 8,
  }

  const SideBarStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e6e6e6',
    width: 250,
  }

  useEffect(() => {
    if (currentPage) setSelectedIndex(parseInt(currentPage))
  }, [])

  return (
    <Stack alignItems={'center'} py={3} style={SideBarStyle}>
      <Stack direction={'row'} gap={1} mb={2} px={3} alignItems={'center'}>
        <Avatar src={user.avatar} />
        <Stack spacing={1} width={1}>
          <Typography fontWeight={'bold'}>{user.fullName}</Typography>
          <Typography>{user.phone}</Typography>
        </Stack>
      </Stack>
      <List
        sx={{
          '&& .Mui-selected, && .Mui-selected:hover': {
            '&, & .MuiListItemIcon-root': {
              fontWeight: 700,
            },
            '&, & .MuiListItemText-root > span': {
              fontWeight: 700,
            },
          },
        }}
      >
        <ProtectedComponent
          permissions={ALL_PERMISSION.ARTICLES.filter(x => x.method !== 'GET')}
        >
          <ListItemButton
            style={ListItemButtonStyle}
            selected={selectedIndex === 1}
            onClick={() => {
              handleListItemClick(1)
              navigate('/quan-ly/dang-tin-moi')
            }}
          >
            <AddIcon />
            <ListItemText>{t('userSideNav.newArticle')}</ListItemText>
          </ListItemButton>
          <ListItemButton
            style={ListItemButtonStyle}
            selected={selectedIndex === 2}
            onClick={() => {
              handleListItemClick(2)
              navigate('/quan-ly/tin-dang')
            }}
          >
            <NewspaperIcon />
            <ListItemText>{t('userSideNav.manageArticles')}</ListItemText>
          </ListItemButton>
          <ListItemButton
            style={ListItemButtonStyle}
            selected={selectedIndex === 6}
            onClick={() => {
              handleListItemClick(6)
              navigate('/quan-ly/danh-sach-yeu-cau-xac-thuc')
            }}
          >
            <ShieldIcon />
            <ListItemText>
              {t('userSideNav.listOfVerifyArticleRequest')}
            </ListItemText>
          </ListItemButton>
        </ProtectedComponent>
        <ProtectedComponent
          permissions={ALL_PERMISSION.USERS.filter(
            x => x.method === 'PUT' || x.method === 'PATCH',
          )}
        >
          <ListItemButton
            style={ListItemButtonStyle}
            selected={selectedIndex === 3}
            onClick={() => {
              navigate('/quan-ly/cap-nhat-thong-tin-ca-nhan')
              handleListItemClick(3)
            }}
          >
            <EditIcon />
            <ListItemText>
              {t('userSideNav.updatePersonalInformation')}
            </ListItemText>
          </ListItemButton>
        </ProtectedComponent>
        <ProtectedComponent
          permissions={ALL_PERMISSION['LANDLORD-REQUEST'].filter(
            x => x.method === 'GET' || x.method === 'POST',
          )}
        >
          <ListItemButton
            style={ListItemButtonStyle}
            selected={selectedIndex === 4}
            onClick={() => {
              handleListItemClick(4)
              navigate('/quan-ly/nang-cap-tai-khoan')
            }}
          >
            <VerifiedUserIcon />
            <ListItemText>{t('userSideNav.upgradeLandlord')}</ListItemText>
          </ListItemButton>
        </ProtectedComponent>
        <ListItemButton
          style={ListItemButtonStyle}
          selected={selectedIndex === 5}
          onClick={() => {
            handleListItemClick(5)
            navigate('/')
          }}
        >
          <ExitToAppIcon />
          <ListItemText>{t('userSideNav.returnToHome')}</ListItemText>
        </ListItemButton>
      </List>
    </Stack>
  )
}
export default UserSideNavbar
