import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import HouseImage from '../../assets/image/house-img.jpg'
import { LoadingButton } from '@mui/lab'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Verify = (): JSX.Element => {
  const { httpService } = new HttpService()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const defaultTime = import.meta.env.VITE_PENDING_TIME / 1000
  const [timer, setTimer] = useState<number>(defaultTime)

  const handleSendMailVerify = () => {
    const dataString = localStorage.getItem('verify')
    if (dataString === null) return
    const data = JSON.parse(dataString)
    setDisabled(true)

    httpService
      .post(ApiPathEnum.SendCode, {
        email: data.email,
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
    if (!code) {
      setError(true)
      return
    }

    const dataString = localStorage.getItem('verify')
    if (dataString === null) return
    const data = JSON.parse(dataString)

    setLoading(true)

    httpService
      .post(ApiPathEnum.Verify, {
        email: data.email,
        passcode: code,
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

  const handleFocus = () => {
    setError(false)
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mb={2}>
            {t('verify.verifyAccount')}
          </Typography>
          <Stack direction={'row'} spacing={1} width={1}>
            <TextField
              label={t('verify.code')}
              sx={{ marginBottom: 2, flex: 1 }}
              value={code}
              onChange={evt => {
                setCode(evt.target.value)
              }}
              onFocus={() => {
                handleFocus()
              }}
            />
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
          </Stack>
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
        </Box>
      </Grid>
    </Grid>
  )
}

export default Verify
