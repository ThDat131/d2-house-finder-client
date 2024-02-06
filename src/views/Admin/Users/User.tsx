import {
  type GridRenderCellParams,
  type GridColDef,
  type GridValueGetterParams,
} from '@mui/x-data-grid'
import DataTable from '../../../components/DataTable'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { type User } from '../../../model/user/user'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { getUsers } from './user.slice'
import { type RootState } from '../../../app/store'
import { useTranslation } from 'react-i18next'

const Users = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state: RootState) => state.user)
  const [roleSelect, setRoleSelect] = useState(-1)
  const { t } = useTranslation()
  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('admin.user.id'),
      width: 70,
    },
    {
      field: 'fullName',
      headerName: t('admin.user.fullName'),
      width: 130,
    },
    {
      field: 'phone',
      headerName: t('admin.user.phone'),
      width: 130,
    },
    {
      field: 'email',
      headerName: t('admin.user.email'),
      minWidth: 130,
    },
    {
      field: 'role',
      headerName: t('admin.user.role'),
      width: 130,
    },
    {
      field: 'isDeleted',
      headerName: t('admin.user.isDeleted'),
      type: 'number',
      width: 90,
      renderCell: (params: GridRenderCellParams) => {
        return <Checkbox value={params.value} checked={params.value} />
      },
    },
  ]

  useEffect(() => {
    const usersPromise = dispatch(getUsers())

    return () => {
      usersPromise.abort()
    }
  }, [dispatch])

  const rows: User[] = users

  return (
    <Box width={'100%'}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography variant={'h3'} mb={2}>
          {t('admin.user.listOfUser')}
        </Typography>
        <Button variant="contained">{t('admin.user.create')}</Button>
      </Box>
      <Box display={'flex'} gap={1} paddingY={1}>
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
      </Box>
      <DataTable columns={columns} data={rows} />
    </Box>
  )
}

export default Users
