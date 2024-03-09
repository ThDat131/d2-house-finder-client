import { Box, Paper, Stack, Typography } from '@mui/material'
import { Article } from '../../../model/article/article'
import { useTranslation } from 'react-i18next'
import { VNDCurrencyFormat, getProvinceAndDistrict } from '../../../utils/utils'
import moment from 'moment'
import 'moment/dist/locale/vi'

interface ArticleBoxProps {
  article: Article
}
const ArticleBox: React.FC<ArticleBoxProps> = ({ article }): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Paper sx={{ overflow: 'hidden' }} elevation={3}>
      <Stack>
        <Box height={200}>
          <Box component={'img'} src={article.images[0]} width={1} height={1} />
        </Box>
        <Box p={2}>
          <Box height={60}>
            <Typography fontWeight={600} fontSize={18}>
              {article.title}
            </Typography>
          </Box>
          <Box>
            <Stack direction={'row'} spacing={2}>
              <Typography fontWeight={600} m={0}>
                {t('articleBox.vndPerMonth', {
                  price: VNDCurrencyFormat.format(article.price),
                })}
              </Typography>
              <Typography fontWeight={600} m={0}>
                {article.acreage} m<sup>2</sup>
              </Typography>
            </Stack>
          </Box>
          <Box>
            <Typography>{getProvinceAndDistrict(article)}</Typography>
          </Box>
          <Box>
            <Typography color={'rgba(153,153,153,1)'}>
              {moment(article.createdAt).locale('vi').startOf('hour').fromNow()}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  )
}

export default ArticleBox
