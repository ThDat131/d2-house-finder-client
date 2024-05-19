import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { t } from 'i18next'
import { HttpService } from '../../../api/HttpService'
import { CommonResponse } from '../../../model/common/common-response'
import {
  VerifyArticleRequests,
  VerifyArticleRequestsResponse,
} from '../../../model/verify-article-request/verify-article-request'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { useEffect, useState } from 'react'
import { VerificationStatusEnum } from '../../../common/common-enum'
import { useNavigate } from 'react-router-dom'

const VerifyArticleRequestsView = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { httpService } = new HttpService()
  const navigate = useNavigate()
  const auth = useAppSelector((state: RootState) => state.auth)

  const [fetchLoading, setFetchLoading] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [requests, setRequests] = useState<VerifyArticleRequestsResponse>()

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('generalManagement.upgradeLandlord.id'),
      flex: 1,
    },
    {
      field: 'articleId.title',
      headerName: t('generalManagement.verifyArticle.articleTitle'),
      renderCell: params => params.row.articleId?.title ?? '',
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
                color="success"
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
            <Button
              variant="contained"
              onClick={() => {
                navigate(
                  `/quan-ly/yeu-cau-xac-thuc-tin-dang/${params.row._id}`,
                  {
                    state: params.row,
                  },
                )
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

  const fetchLandlordRequest = () => {
    setFetchLoading(true)

    httpService
      .get<CommonResponse<VerifyArticleRequestsResponse>>(
        ApiPathEnum.VerifyArticle,
        {
          params: {
            createdBy: auth.auth.user._id,
            pageSize: paginationModel.pageSize,
            current: paginationModel.page + 1,
            populate: 'articleId',
            fields: 'articleId.title',
          },
        },
      )
      .then(res => {
        if (res.status === 200) {
          setRequests(res.data.data)
        }
      })
      .finally(() => {
        setFetchLoading(false)
      })
  }

  useEffect(() => {
    fetchLandlordRequest()
  }, [])

  return (
    <Grid item>
      <Box borderBottom={1} mb={4}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.manageArticles.manageArticles')}
        </Typography>
      </Box>
      <Box sx={{ height: 1, display: 'grid' }}>
        <DataGrid
          sx={{ width: 1 }}
          getRowId={x => x._id as string}
          rows={(requests?.results as VerifyArticleRequests[]) ?? []}
          paginationMode={'server'}
          rowCount={requests?.meta?.total ?? 1}
          columns={columns}
          loading={fetchLoading}
          initialState={{
            pagination: {
              paginationModel,
            },
          }}
          onPaginationModelChange={setPaginationModel}
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
        />
      </Box>
    </Grid>
  )
}

export default VerifyArticleRequestsView
