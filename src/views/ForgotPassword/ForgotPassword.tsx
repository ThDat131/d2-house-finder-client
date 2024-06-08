import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useFormik } from 'formik'
import { getCurrentUser, signinAPI } from '../../app/slice/auth.slice'
import { type SigninModel } from '../../model/auth/signin-model'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import HouseImage from '../../assets/image/house-img.jpg'
import { type RootState } from '../../app/store'
import { toast } from 'react-toastify'
import BlackLogo from '../../assets/image/logo/BlackLogo.png'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'

const ForgotPassword = (): JSX.Element => {
  const { httpService } = new HttpService()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const { t } = useTranslation()
  const currentUser = useAppSelector(
    (state: RootState) => state?.auth?.auth?.user,
  )
  const [emailToSend, setEmailToSend] = useState<string>('')

  const handleSendEmail = () => {}

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    reNewPassword: '',
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

  const onSubmit = () => {}

  const onFocus = () => {
    setError(false)
  }

  const formik = useFormik({
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
            {t('signin.forgotPassword')}
          </Typography>
          <Box width={1}>
            <TextField
              fullWidth
              value={emailToSend}
              onChange={evt => {
                setEmailToSend(evt.target.value)
              }}
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
              onClick={handleSendEmail}
            >
              {t('signin.sendRequestForgotPassword')}
            </LoadingButton>
            <Grid container justifyContent={'center'}>
              <Grid item>
                <Typography>
                  <Link to={'/dang-nhap'}>
                    {t('signin.notProblemContinueSignIn')}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ForgotPassword
