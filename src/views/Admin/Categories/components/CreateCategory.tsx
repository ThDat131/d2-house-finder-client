import {
  Button,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import * as Yup from 'yup'
import {
  clearError,
  createCategory,
} from '../../../../app/slice/category.slice'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { type RootState } from '../../../../app/store'
import { ALREADY_EXISTS } from '../../../../model/common/error-type'

const CreateCategory = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const error = useAppSelector((state: RootState) => state.category.error)

  const initialValues = {
    name: '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('admin.category.nameIsRequired')),
  })

  const onSubmit = () => {
    dispatch(createCategory(formik.values))
      .unwrap()
      .then(() => {
        toast.success(t('admin.category.createSuccess'))
        navigate('/admin/category')
      })
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  const onFocus = (): void => {
    dispatch(clearError())
  }

  const handleShowError = (error: string): string => {
    if (error.includes(ALREADY_EXISTS)) return t('admin.category.alreadyExists')
    return error
  }

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
            {t('admin.category.createACategory')}
          </Typography>
        </Grid>
        <Grid item container xs={12} minHeight={'70vh'}>
          <Paper style={{ width: '100%' }}>
            <Grid container spacing={4} borderRadius={2} p={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('admin.category.name')}
                  name="name"
                  onChange={formik.handleChange}
                  onFocus={onFocus}
                  error={
                    error !== '' ||
                    (formik.touched.name && Boolean(formik.errors.name))
                  }
                  helperText={formik.touched.name && formik.errors.name}
                />
                {error ? (
                  <FormHelperText error>
                    {handleShowError(error)}
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  {t('admin.category.createACategory')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </form>
  )
}

export default CreateCategory
