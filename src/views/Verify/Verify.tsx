import { Box, FormHelperText, Grid, Paper, Typography } from '@mui/material'
import HouseImage from '../../assets/image/house-img.jpg'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import BlackLogo from '../../assets/image/logo/BlackLogo.png'
import VerificationCodeInput from '../../components/VerificationCodeInput'

const Verify = (): JSX.Element => {
  const { httpService } = new HttpService()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [codes, setCodes] = useState<string[]>(new Array(6).fill(''))
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const defaultTime = import.meta.env.VITE_PENDING_TIME / 1000
  const [timer, setTimer] = useState<number>(defaultTime)
  const email = JSON.parse(localStorage.getItem('verify') ?? '').email ?? ''

  const handleSendMailVerify = () => {
    setDisabled(true)

    httpService
      .post(ApiPathEnum.SendCode, {
        email,
      })
      .then(() => {
        toast.success(t('verify.pleaseVerify'))

        setTimeout(
          () => {
            setDisabled(false)
          },
          import.meta.env.VITE_PENDING_TIME,
        )

        setTimer(defaultTime)
      })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          clearInterval(interval)
          return prevTimer
        } else {
          return prevTimer - 1
        }
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [disabled])

  const handleSubmitCode = () => {
    const check = codes.every(x => x !== '')
    console.log(check)

    if (!check) {
      setError(true)
      return
    }

    setLoading(true)

    httpService
      .post(ApiPathEnum.Verify, {
        email,
        passcode: codes.join(''),
      })
      .then(res => {
        if (res.status === 201) {
          toast.success(t('verify.verifySuccessfully'))
          localStorage.removeItem('verify')
          navigate('/dang-nhap')
        }
      })
      .catch(res => {
        if (res.response.status === 404) {
          toast.error(t('verify.verifyFailed'))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
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
          <Typography component="h1" variant="h5" mb={2}>
            {t('verify.verifyAccount')}
          </Typography>
          <Typography color={'#808080'} mb={2}>
            {t('verify.weHaveSentEmail', { email })}
          </Typography>
          <VerificationCodeInput
            setCodes={setCodes}
            codes={codes}
            setError={setError}
          />
          {/* <Stack direction={'row'} spacing={1} width={1}>
            <Button
              onClick={() => {
                handleSendMailVerify()
              }}
              variant="contained"
              disabled={disabled}
            >
              {disabled
                ? t('verify.pleaseWaitSecond', { time: timer })
                : t('verify.sendNewCode')}
              {}
            </Button>
          </Stack> */}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              handleSubmitCode()
            }}
            loading={loading}
          >
            {t('verify.submit')}
          </LoadingButton>
          {error && (
            <FormHelperText error>{t('verify.pleaseInputCode')}</FormHelperText>
          )}
          <Typography component={'span'} mt={1}>
            <Typography component={'span'} color={'#808080'} mb={2}>
              {t('verify.didNotSeeEmail')}
            </Typography>
            &nbsp;
            <Typography
              component={'span'}
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => {
                handleSendMailVerify()
              }}
            >
              {t('verify.sendNewCode')}
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Verify
