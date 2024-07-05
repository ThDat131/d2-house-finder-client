import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
  Box,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import HouseImage from '../../assets/image/house-img.jpg'
import { toast } from 'react-toastify'
import BlackLogo from '../../assets/image/logo/BlackLogo.png'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'

const ChangePassword = (): JSX.Element => {
  const { httpService } = new HttpService()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const { t } = useTranslation()
  const { state } = useLocation()

  useEffect(() => {
    if (!state) navigate('/not-found')
  }, [state])

  const initialValues = {
    email: state,
    newPassword: '',
    reNewPassword: '',
  }

  const validationSchema = Yup.object().shape({
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

  const onSubmit = () => {
    setLoading(true)
    httpService
      .patch(ApiPathEnum.ForgotPassword, {
        email: formik.values.email,
        newPassword: formik.values.newPassword,
      })
      .then(res => {
        if (res.status === 200) {
          navigate('/dang-nhap')
          toast.success(
            t('generalManagement.updatePassword.updatePasswordSuccessfully'),
          )
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onFocus = () => {
    setError(false)
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
  })

  return (
    <Grid container component="main" height={1}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${HouseImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        alignItems={'center'}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box width={200} height={200}>
            <Box component={'img'} src={BlackLogo} width={1} height={1} />
          </Box>
          <Typography color={'#808080'} mb={2}>
            {t('signin.welcome')}
          </Typography>
          <Typography component="h1" variant="h5" mb={2}>
            {t('generalManagement.updatePassword.updatePassword')}
          </Typography>
          <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              onFocus={onFocus}
              label={t('generalManagement.updatePassword.newPassword')}
              name={'newPassword'}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              type="password"
            />
            <TextField
              onFocus={onFocus}
              fullWidth
              label={t('generalManagement.updatePassword.reNewPassword')}
              name={'reNewPassword'}
              value={formik.values.reNewPassword}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
              error={
                formik.touched.reNewPassword &&
                Boolean(formik.errors.reNewPassword)
              }
              type="password"
            />
            {error ? (
              <FormHelperText error> {t('signin.error')} </FormHelperText>
            ) : null}
            <LoadingButton
              loading={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('generalManagement.updatePassword.updatePassword')}
            </LoadingButton>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ChangePassword
