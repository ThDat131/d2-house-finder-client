import { Button, Chip, Grid, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { useEffect, useState } from 'react'
import { VerificationStatusEnum } from '../../../common/common-enum'
import { getVerifyArticleRequests } from '../../../app/slice/verify-article-requests.slice'
import { VerifyArticleRequests } from '../../../model/verify-article-request/verify-article-request'
import { useNavigate } from 'react-router-dom'
import UpdateVerifyArticleRequest from './components/UpdateVerifyArticleRequest'

const VerifyArticleRequest = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const verifyArticleRequestState = useAppSelector(
    (state: RootState) => state.verifyArticle,
  )
  const navigate = useNavigate()

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [selectedRequest, setSelectedRequest] =
    useState<VerifyArticleRequests>()
  const [openUpdateRequest, setOpenUpdateRequest] = useState<boolean>(false)

  const handleUpdateRequest = (x: VerifyArticleRequests) => {
    setSelectedRequest(x)
    setOpenUpdateRequest(true)
  }

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
          case VerificationStatusEnum.PENDING:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.pending')}
                color="warning"
              />
            )
          case VerificationStatusEnum.SUCCEED:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.approved')}
                color="primary"
              />
            )
          case VerificationStatusEnum.REJECTED:
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
            {params.row.status === VerificationStatusEnum.PENDING && (
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
                navigate(`/admin/verify-article-requests/${params.row._id}`, {
                  state: params.row,
                })
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

  useEffect(() => {
    const verifyArticleRequestPromise = dispatch(
      getVerifyArticleRequests({ current: paginationModel.page + 1 }),
    )

    return () => {
      verifyArticleRequestPromise.abort()
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
            {t('admin.verifyArticleRequest.listOfVerifyArticleRequest')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} height={'90%'}>
        <DataGrid
          getRowId={x => x._id as string}
          rows={verifyArticleRequestState.requests}
          paginationMode={'server'}
          rowCount={verifyArticleRequestState.totalRequest}
          columns={columns}
          loading={verifyArticleRequestState.loading}
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
      <UpdateVerifyArticleRequest
        id={selectedRequest?._id}
        open={openUpdateRequest}
        setOpen={setOpenUpdateRequest}
      />
    </Grid>
  )
}

export default VerifyArticleRequest
