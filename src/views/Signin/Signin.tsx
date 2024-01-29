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
import { signinAPI } from '../../app/slice/auth.slice'
import { type SigninModel } from '../../model/auth/signin-model'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import HouseImage from '../../assets/image/house-img.jpg'
import { type RootState } from '../../app/store'
import cookie from 'react-cookies'

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
        email: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required(t('signin.emailValidation'))
            .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, t('signin.emailIsRequired')),

        password: Yup.string()
            .required(t('signin.passwordIsRequired'))
            .min(4, t('signin.passwordIsTooShort')),
    })

    const onSubmit = () => {
        dispatch(signinAPI(formik.values)).unwrap().then((res) => {
            cookie.save('credential', res, {})
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
                <Typography component="h1" variant="h5">
                    {t('signin.signin')}
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="email"
                        label={t('signin.email')}
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
                        name="password"
                        label={t('signin.password')}
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
                        label={t('signin.rememberAccount')}
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
                        {t('signin.signin')}
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                {t('signin.forgotPassword')}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {t('signin.didntHaveAccountGetOne')}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Grid>
    </Grid>
}

export default Signin
