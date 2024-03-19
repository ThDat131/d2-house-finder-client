import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import DOMPurify from 'dompurify'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { type Article } from '../../model/article/article'
import Loading from '../../components/Loading'
import { Header } from '../../components/Header'
import PhoneIcon from '@mui/icons-material/Phone'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import { useTranslation } from 'react-i18next'
import { VNDCurrencyFormat } from '../../utils/utils'
import moment from 'moment'
import 'moment/locale/vi'
import GoongMap from '../../components/GoongMap'
import { type ViewPort } from '../../model/utils/map'
import { FlyToInterpolator } from '@goongmaps/goong-map-react'
import Fancybox from '../../components/FancyBox'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import CommentInput from './components/CommentInput'
import Comment from './components/Comment'
import { RootState } from '../../app/store'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getArticle } from '../../app/slice/article.slice.'
import { HttpService } from '../../api/HttpService'
import { GetArticlesResponse } from '../../model/article/article-response'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import PostItem from '../../components/PostItem'
import UserLayout from '../../components/Layout/UserLayout'

const ArticleDetails = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { httpService } = new HttpService()

  const [viewportData, setViewportData] = useState<ViewPort>({
    width: '100%',
    height: '100%',
    latitude: 0,
    longitude: 0,
    zoom: 15,
    maxZoom: 16,
    minZoom: 6,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  })
  const [marker, setMarker] = useState({
    longitude: 0,
    latitude: 0,
  })
  const [article, setArticle] = useState<Article>()
  const [articleList, setArticleList] = useState<Article[]>([])
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const currentUser = useAppSelector((state: RootState) => state.auth.user)
  const loading = useAppSelector((state: RootState) => state.article.loading)
  const comments = useAppSelector((state: RootState) => state.article.comments)
  const ref = useRef(false)

  const getNearestArticle = (
    currentId: string,
    code: number,
    category: string,
  ) => {
    if (!ref.current) {
      httpService
        .get<GetArticlesResponse>(ApiPathEnum.Article, {
          params: {
            current: 1,
            pageSize: 5,
            populate: 'createdBy,address',
            fields:
              'createdBy.fullName,createdBy.email,createdBy.avatar,createdBy.phone',
            'address.wardCode': code,
            categoryId: category,
            '_id!': currentId,
          },
        })
        .then(res => {
          if (res.data) {
            setArticleList(res.data.data.results)
          }
        })
    }

    return () => {
      ref.current = true
    }
  }

  useEffect(() => {
    const promise = dispatch(getArticle(id as string))

    promise.then(res => {
      if (res.payload) {
        const result = res.payload as any
        const articleFromResult = result.data.article as Article
        const longitude = articleFromResult.location.coordinates[0]
        const latitude = articleFromResult.location.coordinates[1]

        setArticle(articleFromResult)
        setViewportData(prev => ({ ...prev, latitude, longitude }))
        setMarker({ latitude, longitude })
        getNearestArticle(
          articleFromResult._id,
          articleFromResult.address.wardCode,
          articleFromResult.categoryId.categoryId,
        )

        setLoadingPage(false)
      }
    })

    return () => {
      promise.abort()
    }
  }, [])

  const getExactAddress = (data: Article): string => {
    if (
      data.address.provinceName &&
      data.address.districtName &&
      data.address.wardName &&
      data.address.streetAddress
    )
      return `${data.address.streetAddress}, ${data.address.wardName}, ${data.address.districtName}, ${data.address.provinceName}`
    if (
      data.address.provinceName &&
      data.address.districtName &&
      data.address.wardName
    )
      return `${data.address.streetAddress}, ${data.address.wardName}, ${data.address.districtName}`
    if (data.address.provinceName && data.address.districtName)
      return `${data.address.districtName}, ${data.address.provinceName}`
    if (data.address.provinceName) return data.address.provinceName
    return ''
  }

  return loading || loadingPage ? (
    <Loading />
  ) : (
    <UserLayout haveSearch={false}>
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={4}>
              <Box
                height={300}
                sx={{
                  backgroundImage: `url(${article?.images[0]})`,
                  backgroundSize: 'cover',
                }}
                position={'relative'}
              >
                <Fancybox
                  options={{
                    Carousel: {
                      infinite: false,
                    },
                  }}
                >
                  <Button
                    startIcon={<FormatListBulletedIcon />}
                    href={article?.images[0]}
                    style={{ position: 'absolute', bottom: 10, right: 10 }}
                    variant="contained"
                    className="f-carousel__slide"
                    data-fancybox="gallery"
                  >
                    {t('articleDetails.allImages')}
                  </Button>
                  {article?.images.map((x, index) => {
                    return (
                      index !== 0 && (
                        <Button key={x} data-fancybox="gallery" href={x} />
                      )
                    )
                  })}
                </Fancybox>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h3" mb={2}>
              {article?.title}
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }} elevation={5}>
              <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableRow>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.address')}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <Typography color={'primary'} fontWeight={500}>
                      {article ? getExactAddress(article) : null}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.price')}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <Typography color={'primary'} fontWeight={500}>
                      {VNDCurrencyFormat.format(article?.price as number)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.category')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography color={'primary'} fontWeight={500}>
                      {article?.categoryId.name}
                    </Typography>
                  </TableCell>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.owner')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={'primary'} fontWeight={500}>
                      {article?.createdBy.fullName}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.acreage')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={'primary'} fontWeight={500}>
                      {article?.acreage}m<sup>2</sup>
                    </Typography>
                  </TableCell>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.phone')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={'primary'} fontWeight={500}>
                      {article?.createdBy.phone ?? 0}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.updatedAt')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={'primary'} fontWeight={500}>
                      {moment().locale('vi').startOf('day').fromNow()}
                    </Typography>
                  </TableCell>
                  <TableCell variant="head">
                    <Typography fontWeight={700}>
                      {t('articleDetails.email')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={'primary'} fontWeight={500}>
                      {article?.createdBy.email}
                    </Typography>
                  </TableCell>
                </TableRow>
              </Table>
            </TableContainer>
            <Paper elevation={5} sx={{ mb: 2 }}>
              <Box p={2}>
                <Typography variant="h4">
                  {t('articleDetails.description')}
                </Typography>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(article?.description as string, {
                      USE_PROFILES: { html: true },
                    }),
                  }}
                ></Box>
              </Box>
            </Paper>
            <Paper elevation={5} sx={{ mb: 2 }}>
              <Grid container p={2}>
                <Typography variant="h4" mb={1}>
                  {t('articleDetails.map')}
                </Typography>
                <Grid item xs={12} height={300}>
                  <GoongMap
                    data={viewportData}
                    markers={[marker]}
                    layer={false}
                  />
                </Grid>
              </Grid>
            </Paper>
            <Grid container mb={2}>
              <Grid item xs={12}>
                <Typography variant="h4" mb={1}>
                  {t('articleDetails.comment')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CommentInput type={0} />
              </Grid>
              <Grid item container xs={12}>
                {comments.map(x => (
                  <Grid item xs={12} key={x._id}>
                    <Comment
                      comment={x}
                      showAction={currentUser._id === x.createdBy._id}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h4" mb={1}>
                  {t('articleDetails.articleInWard')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {articleList.map(x => (
                  <PostItem key={x._id} data={x} />
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={5}>
              <Stack p={2} spacing={2} alignItems={'center'}>
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigate(`/trang-ca-nhan/${article?.createdBy._id}`)
                  }}
                >
                  <Box width={100} height={100}>
                    <Box
                      component={'img'}
                      boxShadow={2}
                      width={1}
                      height={1}
                      src={article?.createdBy.avatar}
                      borderRadius={'50%'}
                    ></Box>
                  </Box>
                  <Typography>{article?.createdBy.fullName}</Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<PhoneIcon />}
                  fullWidth
                >
                  {article?.createdBy.phone ?? 0}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ConnectWithoutContactIcon />}
                  fullWidth
                >
                  {t('articleDetails.follow')}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </UserLayout>
  )
}

export default ArticleDetails
