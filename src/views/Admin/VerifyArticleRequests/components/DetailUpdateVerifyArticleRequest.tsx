import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { VerificationStatusEnum } from '../../../../common/common-enum'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HttpService } from '../../../../api/HttpService'
import { ApiPathEnum } from '../../../../api/ApiPathEnum'
import { Article } from '../../../../model/article/article'
import DOMPurify from 'dompurify'
import { VNDCurrencyFormat } from '../../../../utils/utils'
import ReactPlayer from 'react-player'
import ErrorIcon from '@mui/icons-material/Error'

const DetailUpdateVerifyArticleRequest = () => {
  const { httpService } = new HttpService()
  const { t } = useTranslation()
  const location = useLocation()

  const [loading, setLoading] = useState<boolean>(false)
  const [article, setArticle] = useState<Article>()
  const [errorVideo, setErrorVideo] = useState<boolean>(false)

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

  useEffect(() => {
    setLoading(true)
    httpService
      .get(`${ApiPathEnum.Article}/${location.state.articleId._id}`)
      .then(res => {
        setArticle(res.data.data.article)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <CircularProgress />

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
        <Typography variant={'h3'} mb={2}>
          {t('admin.verifyArticleRequest.detailOfVerifyArticleRequest')}
        </Typography>
      </Grid>

      <Grid item container xs={12}>
        <Paper sx={{ width: 1 }}>
          <Grid container item xs={12} p={3}>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.verifyArticleRequest.status')}
              </Typography>
              {location.state.status === VerificationStatusEnum.PENDING ? (
                <Chip
                  label={t('generalManagement.upgradeLandlord.pending')}
                  color="warning"
                />
              ) : location.state.status === VerificationStatusEnum.SUCCEED ? (
                <Chip
                  label={t('generalManagement.upgradeLandlord.approved')}
                  color="primary"
                />
              ) : (
                <Chip
                  label={t('generalManagement.upgradeLandlord.rejected')}
                  color="error"
                />
              )}
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.article.addressForRent')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack>
                    <Typography noWrap fontWeight={500}>
                      {t('admin.article.streetAndHouseNumber')}
                    </Typography>
                    <Typography>
                      {article && getExactAddress(article)}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.article.description')}
              </Typography>
              <Grid container>
                <Grid item mb={2}>
                  <Stack>
                    <Typography fontWeight={500}>
                      {t('admin.article.category')}
                    </Typography>
                    <Typography>{article?.categoryId.name}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography fontWeight={500}>
                      {t('admin.article.title')}
                    </Typography>
                    <Typography>{article?.title}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography fontWeight={500}>
                      {t('admin.article.content')}
                    </Typography>
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          article?.description as string,
                          {
                            USE_PROFILES: { html: true },
                          },
                        ),
                      }}
                    ></Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography fontWeight={500}>
                      {t('admin.article.price')}
                    </Typography>
                    <Typography>
                      {VNDCurrencyFormat.format(article?.price as number)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography fontWeight={500}>
                      {t('admin.article.acreage')}
                    </Typography>
                    <Typography>
                      {article?.acreage}m<sup>2</sup>
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography fontWeight={500}>
                      {t('admin.article.quantity')}
                    </Typography>
                    <Typography>{article?.quantity}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.article.picture')}
              </Typography>
              <Grid container spacing={4} mb={2}>
                {article?.images.map((item, index) => (
                  <Grid item xs={3} key={item} flexDirection={'column'}>
                    <Box height={'200px'} overflow={'hidden'} boxShadow={5}>
                      <Box
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src =
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                        }}
                        component={'img'}
                        src={
                          item ??
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                        }
                        width={'100%'}
                        height={'100%'}
                        sx={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.verifyArticleRequest.latedImage')}
              </Typography>
              <Grid container spacing={4} mb={2}>
                {location.state.latedImage.map((item: string) => (
                  <Grid item xs={3} key={item} flexDirection={'column'}>
                    <Box height={'200px'} overflow={'hidden'} boxShadow={5}>
                      <Box
                        component={'img'}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src =
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                        }}
                        src={
                          item ??
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                        }
                        width={'100%'}
                        height={'100%'}
                        sx={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.verifyArticleRequest.contract')}
              </Typography>
              <Grid container spacing={4} mb={2}>
                {location.state.contract.map((item: string) => (
                  <Grid item xs={3} key={item} flexDirection={'column'}>
                    <Box overflow={'hidden'} boxShadow={5}>
                      <Box
                        component={'img'}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src =
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                        }}
                        src={
                          item ??
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                        }
                        width={'100%'}
                        height={'100%'}
                        sx={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.verifyArticleRequest.video')}
              </Typography>
              <Grid container spacing={4} mb={2}>
                {location.state.video.map((item: string) => (
                  <Grid item xs={3} key={item} flexDirection={'column'}>
                    <Box overflow={'hidden'} boxShadow={5}>
                      {errorVideo ? (
                        <Box
                          alignItems={'center'}
                          justifyContent={'center'}
                          display={'flex'}
                          height={1}
                          minHeight={300}
                        >
                          <ErrorIcon />
                        </Box>
                      ) : (
                        <ReactPlayer
                          url={item}
                          onError={() => {
                            setErrorVideo(true)
                          }}
                          width={'100%'}
                          height={'100%'}
                          controls={true}
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('admin.verifyArticleRequest.feedBack')}
              </Typography>
              <Typography mb={2}>{location.state.feedBack}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default DetailUpdateVerifyArticleRequest
