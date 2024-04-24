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
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { ChangeEvent, useState } from 'react'
import { HttpService } from '../../../api/HttpService'
import { CommonResponse } from '../../../model/common/common-response'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import {
  getCurrentUser,
  updateCurrentUser,
} from '../../../app/slice/auth.slice'

interface ImageType {
  blob: string | null
  url: string | null
}

const UpdateInformation = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { authHttpService, httpService } = new HttpService()
  const auth = useAppSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()

  const [avatar, setAvatar] = useState<ImageType>({
    blob: null,
    url: null,
  })
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)

  const initialValues = {
    _id: auth._id,
    fullName: auth.fullName,
    phone: auth.phone,
    role: 'USER',
    active: true,
    email: auth.email,
    avatar: auth.avatar,
  }

  const fetchUser = async () => {
    await httpService.get(`${ApiPathEnum.Users}/${auth._id}`).then(res => {
      if (res.status === 200) {
        dispatch(updateCurrentUser(res.data.data))
      }
    })
  }

  const onSubmit = () => {
    setLoadingSubmit(true)

    authHttpService
      .patch(ApiPathEnum.Users, formik.values)
      .then(res => {
        if (res.status === 200) {
          fetchUser()
          toast.success(t('generalManagement.updateInformation.updateSuccess'))
        }
      })
      .catch(() => {
        toast.error(t('generalManagement.updateInformation.updateFailed'))
      })
      .finally(() => {
        setLoadingSubmit(false)
      })

    dispatch(getCurrentUser())
  }

  const validationSchema = Yup.object().shape({})
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  const handleChangeFile = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        const formData = new FormData()
        const blobUrl = URL.createObjectURL(file)

        setAvatar(prev => ({ ...prev, blob: blobUrl }))

        formData.append('file', file)

        authHttpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              setAvatar(prev => ({ ...prev, url: res.data.data.path }))
              formik.setFieldValue('avatar', res.data.data.path)
            }
          })
      }
    }
  }

  return (
    <>
      <Box borderBottom={1} mb={4}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.updateInformation.updatePersonalInformation')}
        </Typography>
      </Box>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={5}>
            <Grid container item xs={9} spacing={4}>
              <Grid container item alignItems={'center'}>
                <Grid item xs={2}>
                  <Typography>
                    {t('generalManagement.updateInformation.email')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    size="small"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems={'center'}>
                <Grid item xs={2}>
                  <Typography>
                    {t('generalManagement.updateInformation.phone')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems={'center'}>
                <Grid item xs={2}>
                  <Typography>
                    {t('generalManagement.updateInformation.fullName')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    id="fullName"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.fullName && Boolean(formik.errors.fullName)
                    }
                    helperText={
                      formik.touched.fullName && formik.errors.fullName
                    }
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems={'center'}>
                <Grid item xs={2}>
                  <Typography>
                    {t('generalManagement.updateInformation.password')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Button
                    onClick={() => {
                      navigate('/quan-ly/cap-nhat-mat-khau')
                    }}
                  >
                    {t('generalManagement.updateInformation.updatePassword')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid container item xs={3}>
              <Grid container item alignItems={'center'}>
                <Grid item width={1}>
                  <Stack spacing={3} alignItems={'center'}>
                    <Box
                      width={150}
                      height={150}
                      borderRadius={'50%'}
                      overflow={'hidden'}
                      boxShadow={1}
                    >
                      <Box
                        component={'img'}
                        src={avatar.blob ?? auth.avatar}
                        width={1}
                        height={1}
                      />
                    </Box>
                    <Button component="label">
                      {t('generalManagement.updateInformation.choosePicture')}
                      <input type="file" hidden onChange={handleChangeFile} />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <LoadingButton
                  fullWidth
                  variant="contained"
                  type="submit"
                  loading={loadingSubmit}
                >
                  {t('generalManagement.updateInformation.saveUpdate')}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  )
}

export default UpdateInformation
