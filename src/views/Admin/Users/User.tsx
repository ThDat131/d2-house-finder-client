import { type GridColDef, DataGrid } from '@mui/x-data-grid'
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { deleteUser, getUsers } from './user.slice'
import { type RootState } from '../../../app/store'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { Link, useNavigate } from 'react-router-dom'
import { User } from '../../../model/user/user'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import { toast } from 'react-toastify'

const Users = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userState = useAppSelector((state: RootState) => state.user)
  const { t } = useTranslation()

  const [roleSelect, setRoleSelect] = useState(-1)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User>()
  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('admin.user.id'),
      flex: 1,
    },
    {
      field: 'fullName',
      headerName: t('admin.user.fullName'),
      flex: 1,
    },
    {
      field: 'phone',
      headerName: t('admin.user.phone'),
      flex: 1,
    },
    {
      field: 'email',
      headerName: t('admin.user.email'),
      flex: 1,
    },
    {
      field: 'role',
      headerName: t('admin.user.role'),
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('admin.category.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            <Button
              variant="contained"
              onClick={() => {
                handleUpdate(params.row)
              }}
            >
              {t('admin.category.update')}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleOpenDelete(params.row)
              }}
            >
              {t('admin.category.delete')}
            </Button>
          </Stack>
        )
      },
      width: 230,
    },
  ]

  const handleUpdate = (user: User) => {
    navigate(`update/${user._id}`, { state: user })
  }

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user)
    setOpenDelete(true)
  }

  const handleDeleteUser = (user: User) => {
    dispatch(deleteUser(user))
      .unwrap()
      .then(res => {
        if (res.status === 200) {
          toast.success(t('admin.category.deleteSuccess'))
          setOpenDelete(false)
        }
      })
  }

  useEffect(() => {
    const usersPromise = dispatch(
      getUsers({ current: paginationModel.page + 1 }),
    )

    return () => {
      usersPromise.abort()
    }
  }, [dispatch, paginationModel])

  return (
    <Grid container height={1}>
      <Grid
        container
        item
        xs={12}
        spacing={2}
        justifyContent={'space-between'}
        height={'10%'}
      >
        <Grid item>
          <Typography variant={'h3'} mb={2}>
            {t('admin.user.listOfUser')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            component={Link}
            to={'/admin/user/create'}
          >
            {t('admin.user.create')}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} container gap={1} paddingY={1} height={'10%'}>
        <FormControl>
          <InputLabel id="user-role">{t('admin.user.role')}</InputLabel>
          <Select
            labelId="user-role"
            id="demo-simple-select"
            value={roleSelect}
            label="Vai trò"
            onChange={evt => {
              setRoleSelect(evt.target.value as number)
            }}
          >
            <MenuItem value={2}>Admin</MenuItem>
            <MenuItem value={1}>Chủ trọ</MenuItem>
            <MenuItem value={0}>Người thuê trọ</MenuItem>
            <MenuItem value={-1}>Tất cả</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label={t('admin.user.search')}
          sx={{ flex: 1 }}
        />
      </Grid>
      <Grid item xs={12} height={'80%'}>
        <DataGrid
          getRowId={x => x._id}
          rows={userState.users}
          paginationMode={'server'}
          rowCount={userState.totalUser}
          columns={columns}
          loading={userState.loading}
          initialState={{
            pagination: {
              paginationModel,
            },
          }}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick={true}
          pageSizeOptions={[10]}
        />
      </Grid>
      <ConfirmDialog
        content={t('admin.user.areYouSureToDeleteThisUser')}
        title={t('admin.user.deleteAUser')}
        open={openDelete}
        onConfirm={() => {
          handleDeleteUser(selectedUser as User)
        }}
        onCancel={() => {
          setOpenDelete(false)
        }}
        isLoading={userState.loading}
      />
    </Grid>
  )
}

export default Users
