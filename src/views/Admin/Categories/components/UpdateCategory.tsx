import React from 'react'
import { Category } from '../../../../model/category/category'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { RootState } from '../../../../app/store'
import {
  clearError,
  updateCategory,
} from '../../../../app/slice/category.slice'
import { ALREADY_EXISTS } from '../../../../model/common/error-type'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'

interface UpdateCategoryProps {
  category: Category | undefined
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const UpdateCategory: React.FC<UpdateCategoryProps> = ({
  category,
  open,
  setOpen,
}): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const categoryState = useAppSelector((state: RootState) => state.category)

  const handleClose = () => {
    setOpen(false)
  }
  const initialValues = {
    _id: category?._id,
    name: category?.name,
    active: category?.active as boolean,
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('admin.category.nameIsRequired')),
  })

  const onSubmit = () => {
    dispatch(updateCategory(formik.values))
      .unwrap()
      .then(() => {
        toast.success(t('admin.category.updateSuccess'))
        setOpen(false)
      })
  }

  const handleShowError = (error: string): string => {
    if (error.includes(ALREADY_EXISTS)) return t('admin.category.alreadyExists')
    return error
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })
  const onFocus = (): void => {
    dispatch(clearError())
  }
  return (
    <Dialog open={open}>
      <DialogTitle>{t('admin.category.updateCategory')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={1} borderRadius={2} p={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('admin.category.name')}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onFocus={onFocus}
                error={
                  categoryState.error !== '' ||
                  (formik.touched.name && Boolean(formik.errors.name))
                }
                helperText={formik.touched.name && formik.errors.name}
              />
              {categoryState.error ? (
                <FormHelperText error>
                  {handleShowError(categoryState.error)}
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="active"
                    value={formik.values.active}
                    onChange={formik.handleChange}
                    checked={Boolean(formik.values.active)}
                  />
                }
                label={t('admin.category.active')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('admin.category.cancel')}</Button>
          <LoadingButton loading={categoryState.loading} type="submit">
            {t('admin.category.update')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UpdateCategory
