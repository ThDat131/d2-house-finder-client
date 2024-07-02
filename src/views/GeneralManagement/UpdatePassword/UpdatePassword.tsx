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
import { HttpService } from '../../../api/HttpService'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAppSelector((state: RootState) => state.auth.auth.user)
  const { httpService } = new HttpService()

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    reNewPassword: '',
  }

  const onSubmit = () => {
    httpService
      .patch(ApiPathEnum.ChangePassword, formik.values)
      .then(res => {
        if (res.status === 200) {
          toast.success(
            t('generalManagement.updatePassword.updatePasswordSuccessfully'),
          )
          navigate('/quan-ly/cap-nhat-thong-tin-ca-nhan')
        } else {
          toast.error(
            t('generalManagement.updatePassword.wrongPasswordTryAgain'),
          )
        }
      })
      .catch(() => {
        toast.error(t('generalManagement.updatePassword.wrongPasswordTryAgain'))
      })
  }

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(
      t('generalManagement.updatePassword.youCantLeaveThisEmpty'),
    ),
    newPassword: Yup.string().required(
      t('generalManagement.updatePassword.youCantLeaveThisEmpty'),
    ),
    reNewPassword: Yup.string()
      .required(t('generalManagement.updatePassword.youCantLeaveThisEmpty'))
      .oneOf(
        [Yup.ref('newPassword')],
        t('generalManagement.updatePassword.passwordMustMatch'),
      ),
  })
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
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={5}>
            <Grid container item alignItems={'center'}>
              <Grid item xs={2}>
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
              <Grid item xs={2}>
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
            <Grid container item alignItems={'center'}>
              <Grid item xs={2}>
                <Typography>
                  {t('generalManagement.updatePassword.reNewPassword')}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="reNewPassword"
                  name="reNewPassword"
                  type="password"
                  value={formik.values.reNewPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.reNewPassword &&
                    Boolean(formik.errors.reNewPassword)
                  }
                  helperText={
                    formik.touched.reNewPassword && formik.errors.reNewPassword
                  }
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">
                  {t('generalManagement.updatePassword.update')}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </form>
      </Container>
    </>
  )
}

export default UpdatePassword
