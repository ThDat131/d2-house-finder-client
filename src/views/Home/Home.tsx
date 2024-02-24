import { useEffect, useRef } from 'react'
import { getCategories } from '../../app/slice/category.slice'
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
import HeaderDefault from '../../components/HeaderDefault'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getCurrentUser } from '../../app/slice/auth.slice'
import { getArticles } from '../../app/slice/article.slice.'
import { type RootState } from '../../app/store'
import { useTranslation } from 'react-i18next'

export const Home = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const articles = useAppSelector((state: RootState) => state.article.articles)
  const articlesLoading = useAppSelector(
    (state: RootState) => state.article.loading,
  )
  const pageSize = useAppSelector((state: RootState) => state.article.pageSize)
  const currentPage = useAppSelector(
    (state: RootState) => state.article.pageCurrent,
  )
  const totalPage = useAppSelector(
    (state: RootState) => state.article.totalPage,
  )
  const totalPost = useAppSelector(
    (state: RootState) => state.article.totalPost,
  )

  const currentUserRef = useRef(false)

  useEffect(() => {
    const categoryPromise = dispatch(getCategories())
    const articlesPromise = dispatch(getArticles(1))

    if (!currentUserRef.current) {
      dispatch(getCurrentUser())
    }

    return () => {
      categoryPromise.abort()
      articlesPromise.abort()
      currentUserRef.current = true
    }
  }, [])

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    dispatch(getArticles(value))
  }

  return (
    <>
      <HeaderDefault />
      <Container sx={{ mt: 2 }}>
        <Grid
          container
          spacing={2}
          maxWidth={'100vw'}
          justifyContent={'space-between'}
        >
          <Grid item xs={8}>
            <Box
              padding={2}
              sx={{ background: '#f0f0f0', borderRadius: '5px' }}
            >
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
      </Container>
    </>
  )
}

export default Home
