import React from 'react'
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const VerifyArticle = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Box>
      <Box borderBottom={1} mb={4}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.verifyArticle.requestVerify')}
        </Typography>
      </Box>
      <Container>
        <Stack spacing={5}>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.verifyArticle.latedImage')}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {t('generalManagement.verifyArticle.upload')}
                <input type="file" hidden />
              </Button>
            </Grid>
            <Grid item xs={8} display={'flex'} alignItems={'center'}>
              <Box
                component={'img'}
                style={{ objectFit: 'cover' }}
                width={1}
                height={300}
                // src="https://nestjs-accommodation-finder.s3.amazonaws.com/737aff99-258a-49b0-b1d4-9de9c0907a93-bright-forget-me-nots-royalty-free-image-1677788394.jpg"
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.verifyArticle.personalIdImage')}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {t('generalManagement.verifyArticle.upload')}
                <input type="file" hidden />
              </Button>
            </Grid>
            <Grid item xs={8} display={'flex'} alignItems={'center'}>
              <Box
                component={'img'}
                style={{ objectFit: 'cover' }}
                width={1}
                height={300}
                // src="https://nestjs-accommodation-finder.s3.amazonaws.com/737aff99-258a-49b0-b1d4-9de9c0907a93-bright-forget-me-nots-royalty-free-image-1677788394.jpg"
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.verifyArticle.contract')}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {t('generalManagement.verifyArticle.upload')}
                <input type="file" hidden />
              </Button>
            </Grid>
            <Grid item xs={8} display={'flex'} alignItems={'center'}>
              <Box
                component={'img'}
                style={{ objectFit: 'cover' }}
                width={1}
                height={300}
                // src="https://nestjs-accommodation-finder.s3.amazonaws.com/737aff99-258a-49b0-b1d4-9de9c0907a93-bright-forget-me-nots-royalty-free-image-1677788394.jpg"
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.verifyArticle.video')}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {t('generalManagement.verifyArticle.upload')}
                <input type="file" hidden />
              </Button>
            </Grid>
            <Grid item xs={8} display={'flex'} alignItems={'center'}>
              <Box
                component={'img'}
                style={{ objectFit: 'cover' }}
                width={1}
                height={300}
                // src="https://nestjs-accommodation-finder.s3.amazonaws.com/737aff99-258a-49b0-b1d4-9de9c0907a93-bright-forget-me-nots-royalty-free-image-1677788394.jpg"
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}

export default VerifyArticle
