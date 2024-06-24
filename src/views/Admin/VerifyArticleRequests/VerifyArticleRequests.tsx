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
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { useEffect, useState } from 'react'
import {
  LandlordRequestStatusEnum,
  VerificationStatusEnum,
} from '../../../common/common-enum'
import {
  getVerifyArticleRequests,
  titleOfVerifyArticleRequests,
} from '../../../app/slice/verify-article-requests.slice'
import { VerifyArticleRequests } from '../../../model/verify-article-request/verify-article-request'
import { useNavigate } from 'react-router-dom'
import UpdateVerifyArticleRequest from './components/UpdateVerifyArticleRequest'
import { ALL_PERMISSION } from '../../../app/permissions-root'
import ProtectedComponent from '../../../components/ProtectedComponent'

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
  const [selectedCreatedBy, setSelectedCreatedBy] = useState({
    _id: '',
    title: '',
  })
  const [articles, setArticles] = useState<any[]>([])
  const [statusSelect, setStatusSelect] = useState('-1')

  const allArticleSimpleList = useAppSelector(titleOfVerifyArticleRequests)

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
            {params.row.status === VerificationStatusEnum.PENDING && (
              <ProtectedComponent
                permissions={ALL_PERMISSION.VERIFICATIONS.filter(
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
    setArticles(allArticleSimpleList)
  }, [allArticleSimpleList])

  useEffect(() => {
    const verifyArticleRequestPromise = dispatch(
      getVerifyArticleRequests({
        current: paginationModel.page + 1,
        pageSize: 999,
        article: selectedCreatedBy,
        status:
          statusSelect === '-1'
            ? undefined
            : (statusSelect as VerificationStatusEnum),
      }),
    )

    return () => {
      verifyArticleRequestPromise.abort()
    }
  }, [dispatch, selectedCreatedBy, statusSelect])

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
            <MenuItem value={VerificationStatusEnum.SUCCEED}>
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
          getOptionLabel={x => x.title}
          getOptionKey={x => x._id}
          disablePortal
          id="combo-box-articles"
          options={articles}
          renderInput={params => (
            <TextField {...params} label={t('admin.user.searchByTitle')} />
          )}
          onChange={(evt, value: any) => {
            setSelectedCreatedBy(value)
          }}
          sx={{ flex: 1 }}
        />
      </Grid>
      <Grid item xs={12} height={'80%'}>
        <DataGrid
          getRowId={x => x._id as string}
          rows={verifyArticleRequestState.requests}
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
      <UpdateVerifyArticleRequest
        id={selectedRequest?._id}
        open={openUpdateRequest}
        setOpen={setOpenUpdateRequest}
      />
    </Grid>
  )
}

export default VerifyArticleRequest
