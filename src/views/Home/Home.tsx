import { useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material'
import PostItem from '../../components/PostItem'
import PriceFilter from '../../components/PriceFilter'
import AcreageFilter from '../../components/AcreageFilter'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getArticles } from '../../app/slice/article.slice.'
import { type RootState } from '../../app/store'
import { useTranslation } from 'react-i18next'
import UserLayout from '../../components/Layout/UserLayout'

export const Home = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const articles = useAppSelector((state: RootState) => state.article.articles)
  const articlesLoading = useAppSelector(
    (state: RootState) => state.article.loading,
  )
  const totalPage = useAppSelector(
    (state: RootState) => state.article.totalPage,
  )
  const totalPost = useAppSelector(
    (state: RootState) => state.article.totalPost,
  )

  useEffect(() => {
    const articlesPromise = dispatch(getArticles(1))

    return () => {
      articlesPromise.abort()
    }
  }, [])

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    dispatch(getArticles({ current: value }))
  }

  return (
    <UserLayout haveSearch={true}>
      <Grid
        container
        spacing={2}
        maxWidth={'100vw'}
        justifyContent={'space-between'}
      >
        <Grid item xs={8}>
          <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
            <Typography>
              {t('home.totalNumberOfPost', { number: totalPost })}
            </Typography>
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <Typography>{t('home.sort')}</Typography>
              <Stack direction={'row'}>
                <Button>{t('home.default')}</Button>
                <Button>{t('home.newest')}</Button>
              </Stack>
            </Box>
            <Stack spacing={1} mb={3}>
              {!articlesLoading &&
                articles.map(article => (
                  <PostItem key={article._id} data={article} />
                ))}
            </Stack>
            <Pagination
              shape="rounded"
              count={totalPage}
              size="large"
              onChange={handleChangePage}
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
