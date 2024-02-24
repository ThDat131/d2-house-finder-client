import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { VNDCurrencyFormat, decodeHtmlEntities } from '../utils/utils'
import { type Article } from '../model/article/article'

interface PostItemProps {
  data: Article
}

const PostItem: React.FC<PostItemProps> = ({ data }): JSX.Element => {
  const getExactAddress = (): string => {
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
  return (
    <Grid
      container
      padding={2}
      sx={{ backgroundColor: '#fff9f3' }}
      borderRadius={2}
    >
      <Grid item xs={4}>
        <Box
          component={'img'}
          src={data.images[0]}
          width={1}
          height={1}
          borderRadius={2}
        ></Box>
      </Grid>
      <Grid item xs={8} display={'flex'} flexWrap={'wrap'} pl={2} height={240}>
        <Stack maxHeight={60} overflow={'hidden'}>
          <Typography fontSize={20} textTransform={'uppercase'}>
            {data.title}
          </Typography>
        </Stack>
        <Stack direction={'row'} spacing={2} alignItems={'center'} mb={1}>
          <Typography fontSize={16} color={'green'} flex={2}>
            {VNDCurrencyFormat.format(data.price)}/thang
          </Typography>
          <Typography flex={1}>
            {data.acreage} m<sup>2</sup>
          </Typography>
          <Typography flex={4}>{getExactAddress()}</Typography>
        </Stack>
        <Stack overflow={'hidden'} mb={1} height={60}>
          <Typography fontSize={14}>
            {decodeHtmlEntities(data.description)}
          </Typography>
        </Stack>

        <Box display={'flex'} justifyContent={'space-between'} width={1}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Box
              borderRadius={'50%'}
              component={'img'}
              width={35}
              height={35}
              src={data.createdBy.avatar}
            />
            <Typography>{data.createdBy.fullName}</Typography>
          </Stack>
          <Button variant="contained">Gọi {data.createdBy.phone}</Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default PostItem
