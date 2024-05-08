import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'

const LandlordRequestCard = ({
  loading,
  total,
}: {
  loading: boolean
  total: number
}) => {
  const { t } = useTranslation()

  return (
    <Card
      sx={{ borderTop: 5, borderColor: theme.palette.info.main, height: 170 }}
    >
      <CardContent>
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          color={theme.palette.info.main}
        >
          <Box>
            <AccountCircleIcon fontSize="large" />
          </Box>
          <Box>
            <Typography fontSize={30} fontWeight={'bold'}>
              {total}
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={400}>
              {t('admin.analytic.totalLandlordRequest')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default LandlordRequestCard
