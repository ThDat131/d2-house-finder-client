import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { VNDCurrencyFormat, decodeHtmlEntities } from '../utils/utils'
import { type Article } from '../model/article/article'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

interface PostItemProps {
  data: Article
}

const PostItem: React.FC<PostItemProps> = ({ data }): JSX.Element => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const getExactAddress = (): string => {
    if (data.address.provinceName && data.address.districtName)
      return `${data.address.districtName}, ${data.address.provinceName}`
    if (data.address.provinceName) return data.address.provinceName
    return ''
  }
  return (
    <Grid
      container
      padding={2}
      sx={{ backgroundColor: '#fff9f3' }}
      borderRadius={2}
    >
      <Grid item xs={4}>
        <Box height={240}>
          <Box
            component={'img'}
            src={data.images[0]}
            width={1}
            height={1}
            borderRadius={2}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate(`/bai-dang/${data._id}`)
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={8} display={'flex'} flexWrap={'wrap'} pl={2} height={240}>
        <Stack
          maxHeight={50}
          overflow={'hidden'}
          onClick={() => {
            navigate(`/bai-dang/${data._id}`)
          }}
        >
          <Typography
            fontSize={16}
            textTransform={'uppercase'}
            fontWeight={600}
            color={'primary'}
            sx={{ cursor: 'pointer' }}
          >
            {data.title}
          </Typography>
        </Stack>
        <Stack direction={'row'} spacing={2} alignItems={'center'} mb={1}>
          <Typography fontSize={18} color={'green'} flex={2}>
            {t('articleBox.vndPerMonth', {
              price: VNDCurrencyFormat.format(data.price),
            })}
          </Typography>
          <Typography>
            {data.acreage} m<sup>2</sup>
          </Typography>
        </Stack>
        <Stack overflow={'hidden'} mb={1} width={1}>
          <Typography>{getExactAddress()}</Typography>
        </Stack>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          width={1}
          mb={1}
        >
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate(`/trang-ca-nhan/${data?.createdBy._id}`)
            }}
          >
            <Box
              borderRadius={'50%'}
              component={'img'}
              width={35}
              height={35}
              src={data.createdBy.avatar}
            />
            <Typography>{data.createdBy.fullName}</Typography>
          </Stack>
          <Box display={'flex'} alignItems={'center'}>
            <Typography marginLeft={'auto'} color={'#808080'}>
              {moment(data.createdAt).locale('vi').startOf('hour').fromNow()}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default PostItem
