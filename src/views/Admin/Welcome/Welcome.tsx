import React, { useEffect } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

const WelcomePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('admin.welcomeToAdminPage')}
        </Typography>
        <Typography variant="h6" component="p">
          {t('admin.manageYourApplicationSettingsAndInformationFromHere')}
        </Typography>
      </Box>
    </Container>
  )
}

export default WelcomePage
