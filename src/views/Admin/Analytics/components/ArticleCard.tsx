import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'
import FeedIcon from '@mui/icons-material/Feed'

const ArticleCard = ({
  loading,
  total,
}: {
  loading: boolean
  total: number
}) => {
  const { t } = useTranslation()

  return (
    <Card
      sx={{
        borderTop: 5,
        borderColor: theme.palette.success.main,
        height: 170,
      }}
    >
      <CardContent>
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          color={theme.palette.success.main}
        >
          <Box>
            <FeedIcon fontSize="large" />
          </Box>
          <Box>
            <Typography fontSize={30} fontWeight={'bold'}>
              {total}
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={400}>
              {t('admin.analytic.totalArticles')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ArticleCard
