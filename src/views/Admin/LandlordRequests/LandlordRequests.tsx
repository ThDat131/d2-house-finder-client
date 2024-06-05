import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { LandlordRequestStatusEnum } from '../../../common/common-enum'
import UpdateLandlordRequest from './components/UpdateLandlordRequest'
import DetailsUpgradeDialog from '../../GeneralManagement/UpgradeLandlord/components/DetailsUpgradeDialog'
import { UpgradeLandlordRequest } from '../../../model/upgrade-landlord-request/upgrade-landlord-request'
import ProtectedComponent from '../../../components/ProtectedComponent'
import { ALL_PERMISSION } from '../../../app/permissions-root'
import {
  allCreatedByLandlordRequests,
  getLandlordRequests,
} from '../../../app/slice/landlord-requests.slice'
const LandlordRequests = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const landlordRequestState = useAppSelector(
    (state: RootState) => state.landlordRequest,
  )
  const allCreatedBySimpleList = useAppSelector(allCreatedByLandlordRequests)

  const [selectedCreatedBy, setSelectedCreatedBy] = useState({
    _id: '',
    fullName: '',
    email: '',
  })
  const [users, setUsers] = useState<any[]>([])
  const [statusSelect, setStatusSelect] = useState('-1')

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('generalManagement.upgradeLandlord.id'),
      flex: 1,
    },
    {
      field: 'createdBy.email',
      headerName: t('generalManagement.upgradeLandlord.email'),
      renderCell: params => params.row.createdBy.email,
      flex: 1,
    },
    {
      field: 'createdBy.fullName',
      headerName: t('generalManagement.upgradeLandlord.fullName'),
      renderCell: params => params.row.createdBy.fullName,
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('generalManagement.upgradeLandlord.status'),
      renderCell: params => {
        switch (params.value) {
          case LandlordRequestStatusEnum.PENDING:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.pending')}
                color="warning"
              />
            )
          case LandlordRequestStatusEnum.APPROVED:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.approved')}
                color="success"
              />
            )
          case LandlordRequestStatusEnum.REJECTED:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.rejected')}
                color="error"
              />
            )
        }
      },
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('admin.landlordRequest.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            {params.row.status === LandlordRequestStatusEnum.PENDING && (
              <ProtectedComponent
                permissions={ALL_PERMISSION['LANDLORD-REQUEST'].filter(
                  x => x.method === 'PUT' || x.method === 'PATCH',
                )}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    handleUpdateRequest(params.row)
                  }}
                >
                  {t('admin.landlordRequest.update')}
                </Button>
              </ProtectedComponent>
            )}
            <Button
              variant="contained"
              onClick={() => {
                handleSeeDetail(params.row)
              }}
            >
              {t('generalManagement.upgradeLandlord.details')}
            </Button>
          </Stack>
        )
      },
      width: 230,
    },
  ]

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [selectedRequest, setSelectedRequest] =
    useState<UpgradeLandlordRequest>()
  const [openUpdateRequest, setOpenUpdateRequest] = useState<boolean>(false)
  const [openDetails, setOpenDetails] = useState<boolean>(false)

  const handleUpdateRequest = (request: UpgradeLandlordRequest) => {
    setSelectedRequest(request)
    setOpenUpdateRequest(true)
  }

  const handleSeeDetail = (request: UpgradeLandlordRequest) => {
    setOpenDetails(true)
    setSelectedRequest(request)
  }

  useEffect(() => {
    setUsers(allCreatedBySimpleList)
  }, [allCreatedBySimpleList])

  useEffect(() => {
    const debounce = setTimeout(() => {
      setUsers(allCreatedBySimpleList)

      dispatch(
        getLandlordRequests({
          current: paginationModel.page + 1,
          pageSize: 999,
          createdBy: selectedCreatedBy,
          status:
            statusSelect === '-1'
              ? undefined
              : (statusSelect as LandlordRequestStatusEnum),
        }),
      )
    }, 500)

    return () => {
      clearTimeout(debounce)
    }
  }, [dispatch, paginationModel, selectedCreatedBy, statusSelect])

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
            {t('admin.landlordRequest.listOfLandlordRequest')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} container gap={1} paddingY={1} height={'10%'}>
        <FormControl>
          <InputLabel id="status">{t('admin.article.status')}</InputLabel>
          <Select
            labelId="user-role"
            id="demo-simple-select"
            value={statusSelect}
            label={t('admin.article.status')}
            onChange={evt => {
              setStatusSelect(evt.target.value)
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={'-1'}>{t('admin.user.all')}</MenuItem>
            <MenuItem value={LandlordRequestStatusEnum.APPROVED}>
              {t('admin.landlordRequest.approved')}
            </MenuItem>
            <MenuItem value={LandlordRequestStatusEnum.PENDING}>
              {t('admin.landlordRequest.pending')}
            </MenuItem>
            <MenuItem value={LandlordRequestStatusEnum.REJECTED}>
              {t('admin.landlordRequest.rejected')}
            </MenuItem>
          </Select>
        </FormControl>
        <Autocomplete
          value={selectedCreatedBy}
          getOptionLabel={x => x.fullName}
          getOptionKey={x => x._id}
          disablePortal
          id="combo-box-user"
          options={users}
          renderInput={params => (
            <TextField {...params} label={t('admin.user.searchByFullName')} />
          )}
          onChange={(evt, value: any) => {
            setSelectedCreatedBy(value)
          }}
          sx={{ flex: 1 }}
        />
      </Grid>
      <Grid item xs={12} height={'80%'}>
        <DataGrid
          getRowId={x => x._id}
          rows={landlordRequestState.requests}
          rowCount={landlordRequestState.totalRequest}
          columns={columns}
          loading={landlordRequestState.loading}
          initialState={{
            pagination: {
              paginationModel,
            },
          }}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick={true}
          slots={{
            noRowsOverlay: () => (
              <Stack alignItems={'center'} justifyContent={'center'} height={1}>
                {t('generalManagement.noDataFound')}
              </Stack>
            ),
            noResultsOverlay: () => (
              <Stack alignItems={'center'} justifyContent={'center'} height={1}>
                {t('generalManagement.noDataFound')}
              </Stack>
            ),
          }}
          autoHeight={true}
        />
      </Grid>
      <UpdateLandlordRequest
        id={selectedRequest?._id}
        open={openUpdateRequest}
        setOpen={setOpenUpdateRequest}
      />
      <DetailsUpgradeDialog
        open={openDetails}
        setOpen={setOpenDetails}
        request={selectedRequest}
      />
    </Grid>
  )
}

export default LandlordRequests
