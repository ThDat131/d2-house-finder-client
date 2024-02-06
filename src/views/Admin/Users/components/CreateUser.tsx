import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import FileUploadIcon from '@mui/icons-material/FileUpload'

const CreateUser = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        display={'flex'}
        justifyContent={'space-between'}
        mb={4}
      >
        <Typography variant={'h3'} mb={2}>
          {t('admin.user.createAUser')}
        </Typography>
      </Grid>
      <Grid item container xs={4} minHeight={'70vh'}>
        <Paper sx={{ width: 1 }}>
          <Grid
            container
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius={2}
            p={3}
            height={1}
            flexDirection={'column'}
          >
            <Box
              borderRadius={'50%'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              height={200}
              width={200}
              sx={{
                backgroundColor: 'rgba(145, 158, 171, 0.08)',
                boxShadow: '0px 0px 14px 4px #888888',
              }}
              padding={2}
              mb={2}
            >
              <AddAPhotoIcon />
            </Box>
            <Button variant="contained" startIcon={<FileUploadIcon />}>
              {t('admin.user.uploadAvatar')}
            </Button>
          </Grid>
        </Paper>
      </Grid>
      <Grid item container xs={8} minHeight={'70vh'}>
        <Paper>
          <Grid container spacing={4} borderRadius={2} p={3}>
            <Grid item xs={6}>
              <TextField fullWidth label={t('admin.user.fullName')} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label={t('admin.user.email')} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label={t('admin.user.phone')} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label={t('admin.user.password')} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label={t('admin.user.role')} />
            </Grid>
            <Grid item xs={6} display={'flex'} alignItems={'center'}>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={t('admin.user.active')}
              />
            </Grid>
            <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
              >
                {t('admin.user.createAUser')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default CreateUser
