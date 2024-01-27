import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
    Avatar,
    Box,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useFormik } from 'formik'
import { type RootState, useAppDispatch } from '../../app/store'
import { signinAPI } from '../../app/slice/auth.slice'
import { type SigninModel } from '../../model/auth/signin-model'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

const Signin = (): JSX.Element => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const { t } = useTranslation()
    const currentUser = useAppSelector((state: RootState) => state.auth.user)

    useEffect(() => {
        if (currentUser.id !== '') { navigate('/') }
    }, [])

    const initialValues: SigninModel = {
        username: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Email là bắt buộc')
            .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email không hợp lệ'),

        password: Yup.string()
            .required('Mật khẩu là bắt buộc')
            .min(4, 'Mật khẩu quá ngắn'),
    })

    const onSubmit = () => {
        dispatch(signinAPI(formik.values)).unwrap().then(() => {
            setLoading(false)
            navigate('/')
        }).catch(() => {
            setError(true)
            setLoading(false)
        })
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    })

    const onFocus = () => {
        setError(false)
    }

    return <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage:
                    'url(https://source.unsplash.com/random?wallpapers)',
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
                <Typography component="h1" variant="h5">
                    Đăng nhập
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="username"
                        label="Email"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onFocus={onFocus}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onFocus={onFocus}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Ghi nhớ tài khoản"
                    />
                    {
                        error ? <FormHelperText error> {t('signin.error')} </FormHelperText> : null
                    }
                    <LoadingButton
                        loading={loading}
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Đăng nhập
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Quên mật khẩu
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {'Chưa có tài khoản? Đăng ký ngay'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Grid>
    </Grid>
}

export default Signin
