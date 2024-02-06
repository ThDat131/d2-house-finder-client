import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const UserSideNavbar = () => {
  const ListItemButtonStyle: React.CSSProperties = {
    justifyContent: 'flex-start',
    gap: 8,
    whiteSpace: 'nowrap',
  }

  return (
    <Stack
      sx={{ backgroundColor: '#f8f9fa' }}
      alignItems={'center'}
      py={3}
      overflow={'hidden'}
      width={250}
    >
      <Stack direction={'row'} gap={1} mb={2}>
        <Box width={50} height={50}>
          <Box
            component={'img'}
            src="https://phongtro123.com/images/default-user.png"
            width={1}
            borderRadius={'50%'}
          />
        </Box>
        <Stack spacing={1} width={1}>
          <Typography fontWeight={'bold'}>Truong Thanh Dat</Typography>
          <Typography>0768785291</Typography>
        </Stack>
      </Stack>
      <List style={{ width: '100%' }}>
        <ListItem disablePadding>
          <ListItemButton style={ListItemButtonStyle}>
            <AddIcon />
            <Typography>Đăng tin mới</Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton style={ListItemButtonStyle}>
            <NewspaperIcon />
            <Typography>Quản lý tin đăng</Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton style={ListItemButtonStyle}>
            <EditIcon />
            <Typography>Cập nhật thông tin cá nhân</Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton style={ListItemButtonStyle}>
            <ExitToAppIcon />
            <Typography>Trở về trang chủ</Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  )
}
export default UserSideNavbar
