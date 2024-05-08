import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'

const UserCard = ({ loading, total }: { loading: boolean; total: number }) => {
  const { t } = useTranslation()

  return (
    <Card
      sx={{
        borderTop: 5,
        borderColor: theme.palette.primary.main,
        height: 170,
      }}
    >
      <CardContent>
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          color={theme.palette.primary.main}
        >
          <Box>
            <PeopleAltIcon fontSize="large" />
          </Box>
          <Box>
            <Typography fontSize={30} fontWeight={'bold'}>
              {total}
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={400}>
              {t('admin.analytic.totalUsers')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default UserCard
