import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import * as Yup from 'yup'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useState } from 'react'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { LoadingButton } from '@mui/lab'
import { Link, useNavigate } from 'react-router-dom'

export const Signup = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { httpService } = new HttpService()

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('signup.emailIsRequired'))
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, t('signup.emailIsRequired')),
    fullName: Yup.string().required(t('signup.fullNameIsRequired')),
    confirmPassword: Yup.string()
      .required(t('signup.confirmPasswordIsRequired'))
      .oneOf([Yup.ref('password')], t('signup.passwordMustMatch')),
    password: Yup.string()
      .required(t('signup.passwordIsRequired'))
      .min(4, t('signup.passwordIsTooShort')),
  })

  const onSubmit = () => {
    setLoading(true)
    httpService
      .post(ApiPathEnum.Signup, {
        fullName: formik.values.fullName,
        email: formik.values.email,
        password: formik.values.password,
      })
      .then(res => {
        if (res.status === 201) {
          httpService.post(ApiPathEnum.SendCode, {
            email: formik.values.email,
          })
          navigate('/xac-nhan')
          localStorage.setItem(
            'verify',
            JSON.stringify({ email: formik.values.email }),
          )
        }
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onFocus = () => {
    setError(false)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: t =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng ký
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              label={t('signup.email')}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onFocus={onFocus}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              id="fullName"
              label={t('signup.fullName')}
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onFocus={onFocus}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              name="password"
              label={t('signup.password')}
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onFocus={onFocus}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              label={t('signup.confirmPassword')}
              type="password"
              id="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onFocus={onFocus}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
            {error && (
              <FormHelperText error sx={{ mt: 2 }}>
                {t('signup.emailAlreadyExist')}{' '}
              </FormHelperText>
            )}
            <LoadingButton
              loading={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('signup.signup')}
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Typography>
                  <Link to={'/dang-nhap'}>
                    {t('signup.alreadyHaveAccountSignin')}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}
