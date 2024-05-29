import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Permission } from '../../../model/permission/permission'
import { RootState } from '../../../app/store'
import {
  deletePermission,
  getPermissions,
} from '../../../app/slice/permission.slice'
import { ActionType } from '../../../common/common-enum'
import CreateUpdateDialog from './components/CreateUpdateDialog'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import { toast } from 'react-toastify'
import ProtectedComponent from '../../../components/ProtectedComponent'
import { ALL_PERMISSION } from '../../../app/permissions-root'

const Permissions = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const permissionState = useAppSelector((state: RootState) => state.permission)

  const [openCreateUpdate, setOpenCreateUpdate] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null)
  const [type, setType] = useState<ActionType>(ActionType.CREATE)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })

  const handleOpenCreate = () => {
    setOpenCreateUpdate(true)
    setType(ActionType.CREATE)
  }

  const handleOpenUpdate = (permission: Permission) => {
    setSelectedPermission(permission)
    setOpenCreateUpdate(true)
    setType(ActionType.UPDATE)
  }

  const handleOpenDelete = (permission: Permission) => {
    setSelectedPermission(permission)
    setOpenDelete(true)
  }

  const getColor = (method: string) => {
    if (method === 'GET') return '#61affe'
    if (method === 'POST') return '#49cc90'
    if (method === 'PATCH') return '#50e3c2'
    if (method === 'PUT') return '#fca130'
    if (method === 'DELETE') return '#f93e3e'
  }

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('admin.permission.id'),
      flex: 1,
    },
    {
      field: 'name',
      headerName: t('admin.permission.name'),
      flex: 1,
    },
    {
      field: 'method',
      headerName: t('admin.permission.method'),
      renderCell: params => (
        <Typography color={getColor(params.value)} fontWeight={'bold'}>
          {params.value}
        </Typography>
      ),
      flex: 1,
    },
    {
      field: 'module',
      headerName: t('admin.permission.module'),
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('admin.permission.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            <ProtectedComponent
              permissions={ALL_PERMISSION.PERMISSIONS.filter(
                x => x.method === 'PUT' || x.method === 'PATCH',
              )}
            >
              <Button
                variant="contained"
                onClick={() => {
                  handleOpenUpdate(params.row)
                }}
              >
                {t('admin.permission.update')}
              </Button>
            </ProtectedComponent>
            <ProtectedComponent
              permissions={ALL_PERMISSION.PERMISSIONS.filter(
                x => x.method === 'DELETE',
              )}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleOpenDelete(params.row)
                }}
              >
                {t('admin.permission.delete')}
              </Button>
            </ProtectedComponent>
          </Stack>
        )
      },
      width: 230,
    },
  ]

  useEffect(() => {
    const permissionRequestPromise = dispatch(
      getPermissions({ current: paginationModel.page + 1 }),
    )

    return () => {
      permissionRequestPromise.abort()
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
            {t('admin.permission.listOfPermission')}
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
            {t('admin.permission.create')}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} height={'90%'}>
        <Box height={1}>
          <DataGrid
            getRowId={x => x._id}
            rows={permissionState.permissions}
            paginationMode={'server'}
            rowCount={permissionState.totalItem}
            columns={columns}
            loading={permissionState.loading}
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick={true}
            pageSizeOptions={[10]}
            slots={{
              noRowsOverlay: () => (
                <Stack
                  alignItems={'center'}
                  justifyContent={'center'}
                  height={1}
                >
                  {t('generalManagement.noDataFound')}
                </Stack>
              ),
              noResultsOverlay: () => (
                <Stack
                  alignItems={'center'}
                  justifyContent={'center'}
                  height={1}
                >
                  {t('generalManagement.noDataFound')}
                </Stack>
              ),
            }}
          />
        </Box>
      </Grid>
      <CreateUpdateDialog
        open={openCreateUpdate}
        setOpen={setOpenCreateUpdate}
        type={type}
        permission={selectedPermission}
      />
      <ConfirmDialog
        content={t('admin.permission.areYouSureToDeleteThisPermission')}
        open={openDelete}
        title={t('admin.permission.deletePermission')}
        isLoading={permissionState.loading}
        onCancel={() => {
          setOpenDelete(false)
        }}
        onConfirm={() => {
          dispatch(deletePermission(selectedPermission?._id as string))
            .unwrap()
            .then(() => {
              toast.success(t('admin.permission.deletePermissionSuccessfully'))
              setOpenDelete(false)
            })
            .catch(() => {
              toast.error(t('admin.permission.errorHaveOccurPleaseTryAgain'))
            })
        }}
      />
    </Grid>
  )
}

export default Permissions
