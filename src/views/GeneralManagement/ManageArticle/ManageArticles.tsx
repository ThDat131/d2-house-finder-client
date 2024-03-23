import { Box, Chip, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { HttpService } from '../../../api/HttpService'
import { useEffect, useRef, useState } from 'react'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { Article } from '../../../model/article/article'
import moment from 'moment'
import { DEFAULT_FORMAT_DATE } from '../../../common/common-constant'
import { ArticleStatus } from '../../../common/common-enum'

const ManageArticles = (): JSX.Element => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { t } = useTranslation()
  const { httpService } = new HttpService()
  const user = useAppSelector((state: RootState) => state.auth.user)
  const [articles, setArticles] = useState<Article[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('generalManagement.manageArticles.articleId'),
      flex: 1,
    },
    {
      field: 'images',
      headerName: t('generalManagement.manageArticles.articleImage'),
      flex: 1,
      renderCell: params => {
        return (
          <Box width={100} margin={'right'}>
            <Box
              component={'img'}
              src={params.value[0]}
              width={1}
              height={1}
            ></Box>
          </Box>
        )
      },
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
                color="primary"
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
  ]

  const fetchArticle = (page: number) => {
    setLoading(true)
    httpService
      .get(ApiPathEnum.Article, {
        params: {
          current: page + 1,
          pageSize: paginationModel.pageSize,
          createdBy: user._id,
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
    <>
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
          pageSizeOptions={[5, 10, 20]}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick={true}
        />
      </Box>
    </>
  )
}

export default ManageArticles
