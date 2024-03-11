import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import UserLayout from '../../components/Layout/UserLayout'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import PhoneIcon from '@mui/icons-material/Phone'
import ArticleBox from './component/ArticleBox'
import { useEffect, useRef, useState } from 'react'
import { User } from '../../model/user/user'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import { Article } from '../../model/article/article'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { toast } from 'react-toastify'

export const Profile = () => {
  const { t } = useTranslation()
  const { httpService } = new HttpService()
  const [user, setUser] = useState<User>()
  const [articles, setArticles] = useState<Article[]>([])
  const { id } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const ref = useRef(false)
  const currentUser = useAppSelector((root: RootState) => root.auth.user)

  const fetchUser = async () => {
    return await httpService.get(`${ApiPathEnum.Users}/${id}`)
  }

  const fetchArticle = async () => {
    return await httpService.get(`${ApiPathEnum.Article}`, {
      params: {
        createdBy: id,
      },
    })
  }

  const handleFollow = () => {
    if (user?._id === currentUser._id) {
      toast.warning(t('profile.canNotFollowYourSelf'))
    }
  }

  useEffect(() => {
    if (id !== undefined) {
      if (!ref.current) {
        Promise.all([fetchUser(), fetchArticle()]).then(responses => {
          setUser(responses[0].data.data)
          setArticles(responses[1].data.data.results)
        })

        setLoading(false)
      }
    }

    return () => {
      ref.current = true
    }
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <UserLayout haveSearch={false}>
      <Grid container justifyContent={'center'}>
        <Grid item xs={12}>
          <Paper>
            <Stack
              spacing={2}
              justifyContent={'center'}
              alignItems={'center'}
              p={2}
            >
              <Box width={150} height={150}>
                <Box
                  boxShadow={1}
                  component={'img'}
                  src={user?.avatar}
                  width={1}
                  height={1}
                  borderRadius={'50%'}
                />
              </Box>
              <Box>
                <Typography variant={'h3'}>{user?.fullName}</Typography>
              </Box>
              <Stack direction={'row'}>
                <Stack
                  p={3}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flex={1}
                  minWidth={100}
                >
                  <Box>
                    <Typography fontWeight={600} whiteSpace={'nowrap'}>
                      {t('profile.article')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={20}>{articles.length}</Typography>
                  </Box>
                </Stack>
                <Stack
                  p={3}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flex={1}
                  minWidth={100}
                >
                  <Box>
                    <Typography fontWeight={600} whiteSpace={'nowrap'}>
                      {t('profile.followers')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={20}>
                      {user?.followers.length}
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  p={3}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flex={1}
                  minWidth={100}
                  whiteSpace={'nowrap'}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {t('profile.followings')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={20}>
                      {user?.followings.length}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <Button
                  startIcon={<ConnectWithoutContactIcon />}
                  variant="contained"
                  onClick={handleFollow}
                >
                  {t('profile.follow')}
                </Button>
                <Button startIcon={<PhoneIcon />} variant="contained">
                  {user?.phone}
                </Button>
              </Stack>
            </Stack>
          </Paper>
          <Grid item xs={12} mt={2}>
            <Box my={2}>
              <Typography variant={'h3'}>
                {t('profile.userArticles')}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {articles.length > 0 &&
                articles.map(x => (
                  <Grid key={x._id} item xs={3}>
                    <ArticleBox article={x} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </UserLayout>
  )
}
export default Profile
