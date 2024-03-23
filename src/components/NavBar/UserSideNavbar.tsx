import {
  Box,
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
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { useTranslation } from 'react-i18next'

const UserSideNavbar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAppSelector((state: RootState) => state.auth.user)
  const [selectedIndex, setSelectedIndex] = useState(1)

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
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

  return (
    <Stack alignItems={'center'} py={3} style={SideBarStyle}>
      <Stack direction={'row'} gap={1} mb={2}>
        <Box width={50} height={50}>
          <Box
            component={'img'}
            src={user.avatar}
            width={1}
            borderRadius={'50%'}
          />
        </Box>
        <Stack spacing={1} width={1}>
          <Typography fontWeight={'bold'}>{user.fullName}</Typography>
          <Typography>{user.phone}</Typography>
        </Stack>
      </Stack>
      <List
        sx={{
          // selected and (selected + hover) states
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
        <ListItemButton
          style={ListItemButtonStyle}
          selected={selectedIndex === 4}
          onClick={() => {
            handleListItemClick(4)
            navigate('/quan-ly/yeu-cau-xac-thuc')
          }}
        >
          <VerifiedUserIcon />
          <ListItemText>{t('userSideNav.requestVerify')}</ListItemText>
        </ListItemButton>
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
