import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { HttpService } from '../../../../api/HttpService'
import { CommonResponse } from '../../../../model/common/common-response'
import { ApiPathEnum } from '../../../../api/ApiPathEnum'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { EmailRegex, PhoneRegex } from '../../../../common/common-regex'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionType } from '../../../../common/common-enum'
import { User } from '../../../../model/user/user'

interface CreateUserProps {
  type: ActionType
}

const CreateUser: React.FC<CreateUserProps> = ({ type }): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const { httpService } = new HttpService()
  const [avatar, setAvatar] = useState({
    blob: '',
    url: '',
  })
  const [user, setUser] = useState<User>()
  const initialValues = {
    _id: type === ActionType.CREATE ? '' : user?._id ?? '',
    fullName: type === ActionType.CREATE ? '' : user?.fullName ?? '',
    email: type === ActionType.CREATE ? '' : user?.email ?? '',
    password: type === ActionType.CREATE ? '' : user?.password ?? '',
    avatar: type === ActionType.CREATE ? '' : user?.avatar ?? '',
    phone: type === ActionType.CREATE ? '' : user?.phone ?? '',
    role: type === ActionType.CREATE ? '' : user?.role ?? '',
    active: type === ActionType.CREATE ? false : user?.active ?? false,
    streetAddress: type === ActionType.CREATE ? '' : user?.streetAddress ?? '',
    latitude: type === ActionType.CREATE ? '' : user?.latitude ?? '',
    longitude: type === ActionType.CREATE ? '' : user?.longitude ?? '',
    provinceCode: type === ActionType.CREATE ? '' : user?.provinceCode ?? '',
    districtCode: type === ActionType.CREATE ? '' : user?.districtCode ?? '',
    wardCode: type === ActionType.CREATE ? '' : user?.wardCode ?? '',
    provinceName: type === ActionType.CREATE ? '' : user?.provinceName ?? '',
    districtName: type === ActionType.CREATE ? '' : user?.districtName ?? '',
    wardName: type === ActionType.CREATE ? '' : user?.wardName ?? '',
  }

  let validationSchema

  if (type === ActionType.CREATE) {
    validationSchema = Yup.object().shape({
      fullName: Yup.string().required(t('admin.user.noEnteredFullName')),
      email: Yup.string()
        .required(t('admin.user.noEnteredEmail'))
        .matches(EmailRegex, t('admin.user.invalidEmail')),
      phone: Yup.string()
        .required(t('admin.user.noEnteredPhone'))
        .matches(PhoneRegex, t('admin.user.invalidPhone')),
      password: Yup.string().required(t('admin.user.noEnteredPassword')),
      role: Yup.string().required(t('admin.user.noChooseRole')),
    })
  } else {
    validationSchema = Yup.object().shape({
      fullName: Yup.string().required(t('admin.user.noEnteredFullName')),
      email: Yup.string()
        .required(t('admin.user.noEnteredEmail'))
        .matches(EmailRegex, t('admin.user.invalidEmail')),
      phone: Yup.string()
        .required(t('admin.user.noEnteredPhone'))
        .matches(PhoneRegex, t('admin.user.invalidPhone')),
      role: Yup.string().required(t('admin.user.noChooseRole')),
    })
  }

  const onSubmit = () => {
    type === ActionType.CREATE ? handleCreateUser() : handleUpdateUser()
  }

  const handleCreateUser = () => {
    httpService
      .post(ApiPathEnum.Users, formik.values)
      .then(res => {
        if (res.status === 201) {
          toast.success(t('admin.user.createSuccess'))
          navigate('/admin/user')
        } else {
          toast.error(t('admin.user.createFailed'))
        }
      })
      .catch(() => {
        toast.error(t('admin.user.createFailed'))
      })
  }

  const handleUpdateUser = () => {
    httpService
      .patch(ApiPathEnum.Users, formik.values)
      .then(res => {
        if (res.status === 200) {
          toast.success(t('admin.user.updateSuccess'))
          navigate('/admin/user')
        } else {
          toast.error(t('admin.user.updateFailed'))
        }
      })
      .catch(() => {
        toast.error(t('admin.user.updateFailed'))
      })
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  const handleChangeFiles = (evt: any) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        const blobUrl = URL.createObjectURL(file)
        const formData = new FormData()

        setAvatar(prev => ({ ...prev, blob: blobUrl }))
        formData.append('file', file)

        httpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              setAvatar(prev => ({
                ...prev,
                url: res.data.data.path,
              }))
              formik.setFieldValue('avatar', res.data.data.path)
            }
          })
      }
    }
  }

  useEffect(() => {
    if (type === ActionType.UPDATE) {
      setUser(location.state)
    }
  }, [])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          display={'flex'}
          justifyContent={'space-between'}
          mb={4}
        >
          <Typography variant={'h3'} mb={2}>
            {type === ActionType.CREATE
              ? t('admin.user.createAUser')
              : t('admin.user.updateAUser')}
          </Typography>
        </Grid>
        <Grid item container xs={4} minHeight={'70vh'}>
          <Paper sx={{ width: 1 }}>
            <Grid
              container
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              borderRadius={2}
              p={3}
              height={1}
              flexDirection={'column'}
            >
              <Box
                borderRadius={'50%'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                height={200}
                width={200}
                sx={{
                  backgroundColor: 'rgba(145, 158, 171, 0.08)',
                }}
                boxShadow={3}
                mb={2}
                overflow={'hidden'}
              >
                {avatar.blob ? (
                  <Box
                    component={'img'}
                    src={avatar.blob}
                    width={1}
                    height={1}
                    borderRadius={'50%'}
                    sx={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                ) : user?.avatar ? (
                  <Box
                    component={'img'}
                    src={user?.avatar}
                    width={1}
                    height={1}
                    borderRadius={'50%'}
                    sx={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                ) : (
                  <AddAPhotoIcon />
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<FileUploadIcon />}
                component={'label'}
                sx={{ mt: 2 }}
              >
                {t('admin.user.uploadAvatar')}
                <input
                  type="file"
                  hidden
                  onChange={evt => {
                    handleChangeFiles(evt)
                  }}
                />
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item container xs={8} minHeight={'70vh'}>
          <Paper>
            <Grid container spacing={4} borderRadius={2} p={3}>
              <Grid item xs={6}>
                <TextField
                  autoComplete="false"
                  id="fullName"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fullName && Boolean(formik.errors.fullName)
                  }
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  fullWidth
                  label={t('admin.user.fullName')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="false"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                  label={t('admin.user.email')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="false"
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  fullWidth
                  label={t('admin.user.phone')}
                />
              </Grid>
              {!user?._id && (
                <Grid item xs={6}>
                  <TextField
                    autoComplete="false"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    fullWidth
                    type="password"
                    label={t('admin.user.password')}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <TextField
                  autoComplete="false"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                  label={t('admin.user.role')}
                />
              </Grid>
              <Grid item xs={6} display={'flex'} alignItems={'center'}>
                <FormControlLabel
                  id="active"
                  name="active"
                  value={formik.values.active}
                  onChange={formik.handleChange}
                  control={<Checkbox defaultChecked />}
                  label={t('admin.user.active')}
                />
              </Grid>
              <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  {type === ActionType.CREATE
                    ? t('admin.user.createAUser')
                    : t('admin.user.update')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </form>
  )
}

export default CreateUser
