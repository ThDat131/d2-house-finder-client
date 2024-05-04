import { Button, Chip, Grid, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { getLandlordRequests } from '../../../app/slice/landlord-requests.slice'
import { RootState } from '../../../app/store'
import { LandlordRequestStatusEnum } from '../../../common/common-enum'
import UpdateLandlordRequest from './components/UpdateLandlordRequest'
import DetailsUpgradeDialog from '../../GeneralManagement/UpgradeLandlord/components/DetailsUpgradeDialog'
import { UpgradeLandlordRequest } from '../../../model/upgrade-landlord-request/upgrade-landlord-request'
const LandlordRequests = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const landlordRequestState = useAppSelector(
    (state: RootState) => state.landlordRequest,
  )
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
                color="primary"
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
              <Button
                variant="contained"
                onClick={() => {
                  handleUpdateRequest(params.row)
                }}
              >
                {t('admin.landlordRequest.update')}
              </Button>
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
    const landlordRequestPromise = dispatch(
      getLandlordRequests({ current: paginationModel.page + 1 }),
    )

    return () => {
      landlordRequestPromise.abort()
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
            {t('admin.landlordRequest.listOfLandlordRequest')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} height={'90%'}>
        <DataGrid
          getRowId={x => x._id}
          rows={landlordRequestState.requests}
          paginationMode={'server'}
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
