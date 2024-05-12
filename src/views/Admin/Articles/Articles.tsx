import { Button, Chip, Grid, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { RootState } from '../../../app/store'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { DEFAULT_FORMAT_DATE } from '../../../common/common-constant'
import { ArticleStatus } from '../../../common/common-enum'
import { useEffect, useState } from 'react'
import { deleteArticle, getArticles } from '../../../app/slice/article.slice.'
import { Article } from '../../../model/article/article'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import { toast } from 'react-toastify'
import { VNDCurrencyFormat } from '../../../utils/utils'

const Articles = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { t } = useTranslation()
  const articleState = useAppSelector((state: RootState) => state.article)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedArticle, setSelectedArticle] = useState<Article>()

  const handleOpenDelete = (x: Article) => {
    setSelectedArticle(x)
    setOpenDelete(true)
  }

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('admin.article.articleId'),
      flex: 1,
    },
    {
      field: 'createdBy',
      headerName: t('admin.article.landLord'),
      valueGetter: params => params.value.fullName,
      flex: 1,
    },
    {
      field: 'email',
      headerName: t('admin.article.email'),
      valueGetter: params => params.row.createdBy.email,
      flex: 1,
    },
    {
      field: 'title',
      headerName: t('admin.article.articleTitle'),
      flex: 1,
    },
    {
      field: 'price',
      headerName: t('admin.article.articlePrice'),
      flex: 1,
      valueFormatter: params => VNDCurrencyFormat.format(params.value),
    },
    {
      field: 'updatedAt',
      headerName: t('admin.article.articleUpdatedAt'),
      flex: 1,
      valueFormatter: params =>
        moment(params.value).format(DEFAULT_FORMAT_DATE),
    },
    {
      field: 'status',
      headerName: t('admin.article.articleStatus'),
      flex: 1,
      renderCell: params => {
        switch (params.value) {
          case ArticleStatus.VERIFY:
            return <Chip label={t('admin.article.verify')} color="primary" />
          case ArticleStatus.UNVERIFY:
            return <Chip label={t('admin.article.unverify')} color="error" />
        }
      },
    },
    {
      field: 'action',
      headerName: t('admin.article.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            <Button
              variant="contained"
              onClick={() => {
                handleUpdate(params.row)
              }}
            >
              {t('admin.article.update')}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleOpenDelete(params.row)
              }}
            >
              {t('admin.article.delete')}
            </Button>
          </Stack>
        )
      },
      width: 230,
    },
  ]

  useEffect(() => {
    const articlesPromise = dispatch(
      getArticles({ current: paginationModel.page + 1 }),
    )

    return () => {
      articlesPromise.abort()
    }
  }, [dispatch, paginationModel])

  const handleUpdate = (article: Article) => {
    navigate(`update/${article._id}`, { state: article })
  }

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
            {t('admin.article.listOfArticle')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            component={Link}
            to={'/admin/article/create'}
          >
            {t('admin.user.create')}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} height={'90%'}>
        <DataGrid
          getRowId={x => x._id}
          rows={articleState.articles}
          paginationMode={'server'}
          rowCount={articleState.totalPost}
          columns={columns}
          loading={articleState.loading}
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

export default Articles
