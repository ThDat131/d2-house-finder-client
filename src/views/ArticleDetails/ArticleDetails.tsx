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
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HttpService } from '../../api/HttpService'
import { type GetArticleResponse } from '../../model/article/article-response'
import { ApiPathEnum } from '../../api/ApiPathEnum'
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

const ArticleDetails = (): JSX.Element => {
  const { id } = useParams()
  const { httpService } = new HttpService()
  const { t } = useTranslation()

  const [article, setArticle] = useState<Article>()
  const [loading, setLoading] = useState<boolean>(true)
  const [viewportData, setViewportData] = useState<ViewPort>({
    width: '100%',
    height: '100%',
    latitude: 10,
    longitude: 106,
    zoom: 15,
    maxZoom: 16,
    minZoom: 6,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  })
  const [marker, setMarker] = useState({
    longitude: 100,
    latitude: 10,
  })

  useEffect(() => {
    moment.locale('vi')
  }, [])

  useEffect(() => {
    getArticleDetails()
  }, [])

  const getArticleDetails = async () => {
    const response = await httpService.get<GetArticleResponse>(
      `${ApiPathEnum.Article}/${id}`,
    )

    if (response.status === 200) {
      const result = response.data.data.article

      setArticle(result)

      setViewportData(prev => ({
        ...prev,
        longitude: result.address.longitude,
        latitude: result.address.latitude,
      }))

      setMarker({
        longitude: result.address.longitude,
        latitude: result.address.latitude,
      })
    }

    setLoading(false)
  }

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

  return loading ? (
    <Loading />
  ) : (
    <>
      <Header />
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
                    {t('articleDetails.address')}
                  </TableCell>
                  <TableCell colSpan={3}>
                    {getExactAddress(article as Article)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    {t('articleDetails.price')}
                  </TableCell>
                  <TableCell colSpan={3}>
                    {VNDCurrencyFormat.format(article?.price as number)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    {t('articleDetails.category')}
                  </TableCell>
                  <TableCell>{article?.categoryId}</TableCell>
                  <TableCell variant="head">
                    {t('articleDetails.owner')}
                  </TableCell>
                  <TableCell>{article?.createdBy.fullName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    {t('articleDetails.acreage')}
                  </TableCell>
                  <TableCell>
                    {article?.acreage}m<sup>2</sup>
                  </TableCell>
                  <TableCell variant="head">
                    {t('articleDetails.phone')}
                  </TableCell>
                  <TableCell>{article?.createdBy.phone ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">
                    {t('articleDetails.updatedAt')}
                  </TableCell>
                  <TableCell>
                    {moment().locale('vi').startOf('day').fromNow()}
                  </TableCell>
                  <TableCell variant="head">
                    {t('articleDetails.email')}
                  </TableCell>
                  <TableCell>{article?.createdBy.email}</TableCell>
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
            <Paper elevation={5}>
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
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={5}>
              <Stack p={2} spacing={2} alignItems={'center'}>
                <Box width={100} height={100}>
                  <Box
                    component={'img'}
                    width={1}
                    height={1}
                    src={article?.createdBy.avatar}
                    borderRadius={'50%'}
                  ></Box>
                </Box>
                <Typography>{article?.createdBy.fullName}</Typography>
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
    </>
  )
}

export default ArticleDetails
