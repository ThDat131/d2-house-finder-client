import React from 'react'
import { Link } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Box width={400}>
        <Box
          component={'img'}
          src="https://realtor.com.cy/assets/images/404-image.png"
          width={1}
          height={1}
        />
      </Box>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '16px' }}>
        {t('notFound.yourContentIsNotFound')}
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        style={{ marginTop: '16px' }}
      >
        {t('notFound.goBackToHome')}
      </Button>
    </div>
  )
}

export default NotFoundPage
