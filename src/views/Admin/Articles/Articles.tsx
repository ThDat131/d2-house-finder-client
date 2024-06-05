import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material'
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
import { ALL_PERMISSION } from '../../../app/permissions-root'
import ProtectedComponent from '../../../components/ProtectedComponent'
import {
  getCategories,
  simpleModelCategory,
} from '../../../app/slice/category.slice'

const Articles = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { t } = useTranslation()
  const articleState = useAppSelector((state: RootState) => state.article)
  const simpleModelCategories = useAppSelector(simpleModelCategory)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedArticle, setSelectedArticle] = useState<Article>()
  const [categorySelect, setCategorySelect] = useState('-1')
  const [statusSelect, setStatusSelect] = useState('-1')
  const [search, setSearch] = useState<string>('')

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
            return <Chip label={t('admin.article.verify')} color="success" />
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
              >
                {t('admin.article.update')}
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
                {t('admin.article.delete')}
              </Button>
            </ProtectedComponent>
          </Stack>
        )
      },
      width: 230,
    },
  ]

  useEffect(() => {
    const categoryPromise = dispatch(
      getCategories({ current: 1, pageSize: 999 }),
    )

    return () => {
      categoryPromise.abort()
    }
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(
        getArticles({
          current: paginationModel.page + 1,
          categoryId:
            categorySelect === '-1'
              ? { _id: '', name: '' }
              : (simpleModelCategories.find(
                  x => x._id === categorySelect,
                ) as any),
          title: `/${search}/i`,
          status:
            statusSelect === '-1' ? undefined : (statusSelect as ArticleStatus),
        }),
      )
    }, 500)

    return () => {
      clearTimeout(debounce)
    }
  }, [dispatch, paginationModel, categorySelect, search, statusSelect])

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
      <Grid item xs={12} container gap={1} paddingY={1} height={'10%'}>
        <FormControl>
          <InputLabel id="user-role">{t('admin.category.category')}</InputLabel>
          <Select
            labelId="user-role"
            id="demo-simple-select"
            value={categorySelect}
            label={t('admin.category.category')}
            onChange={evt => {
              setCategorySelect(evt.target.value)
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={'-1'}>{t('admin.user.all')}</MenuItem>
            {simpleModelCategories.map(x => (
              <MenuItem key={x._id} value={x._id}>
                {x.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            <MenuItem value={ArticleStatus.VERIFY}>
              {t('admin.article.verify')}
            </MenuItem>
            <MenuItem value={ArticleStatus.UNVERIFY}>
              {t('admin.article.unverify')}
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label={t('admin.user.searchByTitle')}
          value={search}
          sx={{ flex: 1 }}
          onChange={evt => {
            setSearch(evt.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} height={'80%'}>
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
