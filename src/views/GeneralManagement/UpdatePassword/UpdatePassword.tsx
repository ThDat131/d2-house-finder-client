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
import * as Yup from 'yup'
import { useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'

const UpdatePassword = (): JSX.Element => {
  const { t } = useTranslation()
  const auth = useAppSelector((state: RootState) => state.auth.user)

  const initialValues = {
    oldPassword: '',
    newPassword: '',
  }

  const onSubmit = () => {}

  const validationSchema = Yup.object().shape({})
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return (
    <>
      <Box borderBottom={1} mb={4}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.updatePassword.updatePassword')}
        </Typography>
      </Box>
      <Container>
        <Stack spacing={5}>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.updatePassword.oldPassword')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.oldPassword &&
                  Boolean(formik.errors.oldPassword)
                }
                helperText={
                  formik.touched.oldPassword && formik.errors.oldPassword
                }
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'}>
            <Grid item textAlign={'center'} xs={2}>
              <Typography>
                {t('generalManagement.updatePassword.newPassword')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="newPassword"
                name="newPassword"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <Button fullWidth variant="contained">
                {t('generalManagement.updatePassword.update')}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  )
}

export default UpdatePassword
