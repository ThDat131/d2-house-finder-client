import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import GppGoodIcon from '@mui/icons-material/GppGood'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'

const VerificationCard = ({
  loading,
  total,
}: {
  loading: boolean
  total: number
}) => {
  const { t } = useTranslation()

  return (
    <Card
      sx={{ borderTop: 5, borderColor: theme.palette.error.main, height: 170 }}
    >
      <CardContent>
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          color={theme.palette.error.main}
        >
          <Box>
            <GppGoodIcon fontSize="large" />
          </Box>
          <Box>
            <Typography fontSize={30} fontWeight={'bold'}>
              {total}
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={400}>
              {t('admin.analytic.totalVerification')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default VerificationCard
