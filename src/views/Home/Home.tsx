import { useEffect } from 'react'
import { Box, Button, Grid, Pagination, Stack, Typography } from '@mui/material'
import PostItem from '../../components/PostItem'
import PriceFilter from '../../components/PriceFilter'
import AcreageFilter from '../../components/AcreageFilter'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getArticles } from '../../app/slice/article.slice.'
import { type RootState } from '../../app/store'
import { useTranslation } from 'react-i18next'
import UserLayout from '../../components/Layout/UserLayout'
import {
  setAcreageFilter,
  setFilterQuery,
  setPriceFilter,
} from '../../app/slice/filter.slice'
import { selectCategory } from '../../app/slice/category.slice'
import { selectProvince } from '../../app/slice/province.slice'
import { selectDistrict } from '../../app/slice/district.slice'
import { selectWard } from '../../app/slice/ward.slice'
import PostItemSkeleton from '../../components/PostItemSkeleton'

export const Home = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const filter = useAppSelector((state: RootState) => state.filter)
  const articleState = useAppSelector((state: RootState) => state.article)

  useEffect(() => {
    handleClearFilter()

    const articlesPromise = dispatch(getArticles({ current: 1 }))

    return () => {
      articlesPromise.abort()
    }
  }, [])

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    dispatch(getArticles({ current: value, filter: filter.filterQuery }))
  }

  const handleClearFilter = () => {
    dispatch(setFilterQuery(''))
    dispatch(setPriceFilter([0, 0]))
    dispatch(setAcreageFilter([0, 0]))
    dispatch(selectCategory(null))
    dispatch(selectProvince(null))
    dispatch(selectDistrict(null))
    dispatch(selectWard(null))
  }

  return (
    <UserLayout haveSearch={true}>
      <Grid container spacing={2} justifyContent={'space-between'}>
        <Grid item xs={8}>
          <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
            <Stack direction={'row'} justifyContent={'space-between'} mb={2}>
              <Typography variant={'h4'}>
                {t('home.totalNumberOfPost', {
                  number: articleState.totalPost,
                })}
              </Typography>
              {filter.filterQuery !== '' ? (
                <Button
                  onClick={() => {
                    handleClearFilter()
                    dispatch(
                      getArticles({
                        current: 1,
                      }),
                    )
                  }}
                  color="error"
                >
                  {t('home.clearFilter')}
                </Button>
              ) : null}
            </Stack>

            {/* <Box display={'flex'} alignItems={'center'} gap={1}>
              <Typography>{t('home.sort')}</Typography>
              <Stack direction={'row'}>
                <Button>{t('home.default')}</Button>
                <Button>{t('home.newest')}</Button>
              </Stack>
            </Box> */}
            <Stack spacing={1} mb={3}>
              {articleState.loading ? (
                <>
                  <PostItemSkeleton />
                  <PostItemSkeleton />
                  <PostItemSkeleton />
                </>
              ) : (
                articleState.articles.map(article => (
                  <PostItem key={article._id} data={article} />
                ))
              )}
            </Stack>
            <Pagination
              shape="rounded"
              count={articleState.totalPage}
              size="large"
              onChange={handleChangePage}
              page={articleState.pageCurrent}
            />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={2}>
            <PriceFilter />
            <AcreageFilter />
          </Stack>
        </Grid>
      </Grid>
    </UserLayout>
  )
}

export default Home
