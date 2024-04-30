import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Switch,
  Checkbox,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { getPermissions } from '../../../app/slice/permission.slice'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import AddIcon from '@mui/icons-material/Add'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { Role } from '../../../model/role/role'
import { ActionType } from '../../../common/common-enum'
import CreateUpdateDialog from './components/CreateUpdateDialog'
import { deleteRole, getRoles } from '../../../app/slice/role.slice'
import { toast } from 'react-toastify'

const Roles = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const dispatch = useAppDispatch()

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [openCreateUpdate, setOpenCreateUpdate] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [type, setType] = useState<ActionType>(ActionType.CREATE)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const handleOpenCreate = () => {
    setOpenCreateUpdate(true)
    setType(ActionType.CREATE)
  }
  const handleOpenUpdate = (role: Role) => {
    setOpenCreateUpdate(true)
    setType(ActionType.UPDATE)
    setSelectedRole(role)
  }
  const handleOpenDelete = (role: Role) => {
    setSelectedRole(role)
    setOpenDelete(true)
  }
  const roleState = useAppSelector((state: RootState) => state.role)

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('admin.role.id'),
      flex: 1,
    },
    {
      field: 'name',
      headerName: t('admin.role.name'),
      flex: 1,
    },
    {
      field: 'isActive',
      headerName: t('admin.role.status'),
      flex: 1,
      renderCell: params => <Checkbox checked={params.value} />,
    },
    {
      field: 'action',
      headerName: t('admin.role.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            <Button
              variant="contained"
              onClick={() => {
                handleOpenUpdate(params.row)
              }}
            >
              {t('admin.role.update')}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleOpenDelete(params.row)
              }}
            >
              {t('admin.role.delete')}
            </Button>
          </Stack>
        )
      },
      flex: 2,
    },
  ]

  useEffect(() => {
    const permissionRequestPromise = dispatch(
      getPermissions({ current: 1, pageSize: 9999 }),
    )

    return () => {
      permissionRequestPromise.abort()
    }
  }, [])

  useEffect(() => {
    const rolesRequestPromise = dispatch(
      getRoles({ current: paginationModel.page + 1 }),
    )

    return () => {
      rolesRequestPromise.abort()
    }
  }, [dispatch, paginationModel])

  return (
    <Grid item container xs={12} height={1}>
      <Grid
        item
        container
        justifyContent={'space-between'}
        xs={12}
        height={'10%'}
      >
        <Grid item>
          <Typography variant={'h3'} mb={2}>
            {t('admin.role.listOfRole')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              handleOpenCreate()
            }}
            startIcon={<AddIcon />}
          >
            {t('admin.role.create')}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} height={'90%'}>
        <Box height={1}>
          <DataGrid
            getRowId={x => x._id}
            rows={roleState.roles}
            paginationMode={'server'}
            rowCount={roleState.totalItem}
            columns={columns}
            loading={roleState.loading}
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick={true}
            pageSizeOptions={[10]}
          />
        </Box>
      </Grid>
      <CreateUpdateDialog
        open={openCreateUpdate}
        setOpen={setOpenCreateUpdate}
        type={type}
        role={selectedRole}
      />
      <ConfirmDialog
        content={t('admin.role.areYouSureToDeleteThisRole')}
        open={openDelete}
        title={t('admin.role.deleteRole')}
        isLoading={roleState.loading}
        onCancel={() => {
          setOpenDelete(false)
        }}
        onConfirm={() => {
          dispatch(deleteRole(selectedRole?._id as string))
            .unwrap()
            .then(() => {
              toast.success(t('admin.role.deleteRoleSuccessfully'))
              setOpenDelete(false)
            })
            .catch(() => {
              toast.error(t('admin.role.errorHaveOccurPleaseTryAgain'))
            })
        }}
      />
    </Grid>
  )
}

export default Roles
