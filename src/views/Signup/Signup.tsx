import {
  Box,
  CssBaseline,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useState } from 'react'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { LoadingButton } from '@mui/lab'
import { Link, useNavigate } from 'react-router-dom'
import BlackLogo from '../../assets/image/logo/BlackLogo.png'

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
          <Box width={200} height={200}>
            <Box component={'img'} src={BlackLogo} width={1} height={1} />
          </Box>
          <Typography color={'#808080'} mb={2}>
            {t('signin.welcome')}
          </Typography>
          <Typography component="h1" variant="h5" mb={2}>
            {t('signup.signup')}
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
            <Grid container justifyContent={'center'}>
              <Grid item>
                <Typography>
                  <Link to={'/dang-nhap'}>
                    {t('signup.alreadyHaveAccountSignin')}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} textAlign="center">
              {t('signin.or')}
            </Divider>
          </form>
          <Grid container justifyContent={'center'} mt={2}>
            <Grid item>
              <Stack direction={'row'} spacing={2} mt={1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                >
                  <linearGradient
                    id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                    x1="9.993"
                    x2="40.615"
                    y1="9.993"
                    y2="40.615"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#2aa4f4"></stop>
                    <stop offset="1" stopColor="#007ad9"></stop>
                  </linearGradient>
                  <path
                    fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                    d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                  ></path>
                </svg>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
