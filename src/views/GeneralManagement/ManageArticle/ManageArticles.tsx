import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { HttpService } from '../../../api/HttpService'
import { useEffect, useState } from 'react'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { Article } from '../../../model/article/article'
import moment from 'moment'
import { DEFAULT_FORMAT_DATE } from '../../../common/common-constant'
import { ArticleStatus } from '../../../common/common-enum'
import { VNDCurrencyFormat } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import { deleteArticle } from '../../../app/slice/article.slice.'
import { toast } from 'react-toastify'
import VerifyArticleDialog from '../CreateArticle/components/VerifyArticleDialog'
import ProtectedComponent from '../../../components/ProtectedComponent'
import { ALL_PERMISSION } from '../../../app/permissions-root'

const ManageArticles = (): JSX.Element => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { t } = useTranslation()
  const { httpService } = new HttpService()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const articleState = useAppSelector((state: RootState) => state.article)

  const user = useAppSelector((state: RootState) => state.auth.auth.user)
  const [articles, setArticles] = useState<Article[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedArticle, setSelectedArticle] = useState<Article>()
  const [openVerify, setOpenVerify] = useState<boolean>(false)

  const handleUpdate = (x: Article) => {
    navigate(`/quan-ly/cap-nhat-tin-dang/${x._id}`, { state: x })
  }

  const handleOpenDelete = (x: Article) => {
    setSelectedArticle(x)
    setOpenDelete(true)
  }

  const handleOpenVerifyArticle = (x: Article) => {
    setSelectedArticle(x)
    setOpenVerify(true)
  }

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('generalManagement.manageArticles.articleId'),
      flex: 1,
    },
    {
      field: 'title',
      headerName: t('generalManagement.manageArticles.articleTitle'),
      flex: 1,
    },
    {
      field: 'price',
      headerName: t('generalManagement.manageArticles.articlePrice'),
      flex: 1,
      valueFormatter: params => VNDCurrencyFormat.format(params.value),
    },
    {
      field: 'updatedAt',
      headerName: t('generalManagement.manageArticles.articleUpdatedAt'),
      flex: 1,
      valueFormatter: params =>
        moment(params.value).format(DEFAULT_FORMAT_DATE),
    },
    {
      field: 'status',
      headerName: t('generalManagement.manageArticles.articleStatus'),
      flex: 1,
      renderCell: params => {
        switch (params.value) {
          case ArticleStatus.VERIFY:
            return (
              <Chip
                label={t('generalManagement.manageArticles.verify')}
                color="success"
              />
            )
          case ArticleStatus.UNVERIFY:
            return (
              <Chip
                label={t('generalManagement.manageArticles.unverify')}
                color="error"
              />
            )
        }
      },
    },
    {
      field: 'action',
      headerName: t('admin.category.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            <ProtectedComponent
              permissions={ALL_PERMISSION.VERIFICATIONS.filter(
                x => x.method === 'POST',
              )}
            >
              <Button
                variant="contained"
                onClick={() => {
                  handleOpenVerifyArticle(params.row)
                }}
                disabled={params.row.status === ArticleStatus.VERIFY}
              >
                {t('generalManagement.manageArticles.verify')}
              </Button>
            </ProtectedComponent>

            <ProtectedComponent
              permissions={ALL_PERMISSION.ARTICLES.filter(
                x => x.method === 'PUT' || x.method === 'PATCH',
              )}
            >
              <Button
                variant="contained"
                onClick={() => {
                  handleUpdate(params.row)
                }}
                disabled={params.row.status === ArticleStatus.VERIFY}
              >
                {t('admin.category.update')}
              </Button>
            </ProtectedComponent>
            <ProtectedComponent
              permissions={ALL_PERMISSION.ARTICLES.filter(
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
                {t('admin.category.delete')}
              </Button>
            </ProtectedComponent>
          </Stack>
        )
      },
      width: 400,
    },
  ]

  const fetchArticle = (page: number) => {
    setLoading(true)
    httpService
      .get(ApiPathEnum.Article, {
        params: {
          current: page + 1,
          pageSize: paginationModel.pageSize,
          createdBy: user._id,
          populate: 'categoryId',
          fields: 'categoryId._id,categoryId.name',
        },
      })
      .then(res => {
        if (res.data) {
          setArticles(res.data.data.results)
          setTotal(res.data.data.meta.total)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchArticle(paginationModel.page)
  }, [paginationModel])

  return (
    <Grid item>
      <Box borderBottom={1} mb={4}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.manageArticles.manageArticles')}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid' }}>
        <DataGrid
          sx={{ width: 1 }}
          getRowId={x => x._id}
          rows={articles}
          paginationMode={'server'}
          rowCount={total}
          columns={columns}
          loading={loading}
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
          autoHeight={true}
        />
      </Box>
      <ConfirmDialog
        content={t('admin.article.areYouSureToDeleteThisArticle')}
        open={openDelete}
        title={t('admin.article.deleteArticle')}
        isLoading={articleState.loading}
        onCancel={() => {
          setOpenDelete(false)
        }}
        onConfirm={() => {
          dispatch(deleteArticle(selectedArticle?._id as string))
            .unwrap()
            .then(() => {
              toast.success(t('admin.article.deleteArticleSuccessfully'))
              fetchArticle(paginationModel.page)
              setOpenDelete(false)
            })
            .catch(() => {
              toast.error(t('admin.permission.errorHaveOccurPleaseTryAgain'))
            })
        }}
      />
      <VerifyArticleDialog
        open={openVerify}
        setOpen={setOpenVerify}
        article={selectedArticle as Article}
      />
    </Grid>
  )
}

export default ManageArticles
