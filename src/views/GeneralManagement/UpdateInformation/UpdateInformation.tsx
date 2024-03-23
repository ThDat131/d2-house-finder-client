import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'

const UpdateInformation = (): JSX.Element => {
  const { t } = useTranslation()
  const auth = useAppSelector((state: RootState) => state.auth.user)

  const initialValues = {
    fullName: auth.fullName,
    phone: auth.phone,
    role: 'USER',
    active: true,
    email: auth.email,
  }

  const onSubmit = () => {}

  const validationSchema = Yup.object().shape({})
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  return (
    <>
      <Box borderBottom={1} mb={4}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.updateInformation.updatePersonalInformation')}
        </Typography>
      </Box>
      <Container>
        <Stack spacing={5}>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.updateInformation.email')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.updateInformation.phone')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.updateInformation.fullName')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="fullName"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.updateInformation.password')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Link to="/quan-ly/cap-nhat-mat-khau">
                {t('generalManagement.updateInformation.updatePassword')}
              </Link>
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.updateInformation.avatar')}
              </Typography>
            </Grid>
            <Grid item>
              <Stack spacing={2}>
                <Box
                  width={150}
                  height={150}
                  borderRadius={'50%'}
                  overflow={'hidden'}
                  boxShadow={1}
                >
                  <Box
                    component={'img'}
                    src={auth.avatar}
                    width={1}
                    height={1}
                  />
                </Box>
                <Button component="label">
                  {t('generalManagement.updateInformation.choosePicture')}
                  <input type="file" hidden />
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <Button fullWidth variant="contained">
                {t('generalManagement.updateInformation.saveUpdate')}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  )
}

export default UpdateInformation
