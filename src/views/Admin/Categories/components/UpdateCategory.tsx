import React, { useEffect, useState } from 'react'
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
  ListItem,
  TextField,
  Typography,
  styled,
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
import { ALL_SUB_CATEGORY } from '../../../../app/sample-sub-category'
import _ from 'lodash'

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
  const [types, setTypes] = useState<any>()

  const handleClose = () => {
    setOpen(false)
  }
  const initialValues = {
    _id: category?._id,
    name: category?.name,
    active: category?.active as boolean,
    subCategories: category?.subCategories.map((x: any) => x._id) as string[],
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

  const CustomListItem = styled(ListItem)({
    paddingLeft: 0,
  })

  const ListItemStyle: React.CSSProperties = {
    width: '50%',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  }

  const ConditionList = (types: any, key: string) => {
    if (!types) return

    const array = types[key]

    return (
      <Grid container spacing={1}>
        {array.map((x: any) => (
          <Grid item key={x._id} xs={4}>
            <CustomListItem style={ListItemStyle}>
              <FormControlLabel
                control={<Checkbox />}
                label={x.name}
                defaultChecked={false}
                checked={formik.values.subCategories.includes(x._id)}
                onClick={() => {
                  const temp = [...formik.values.subCategories]

                  if (!formik.values?.subCategories.includes(x._id)) {
                    formik.setFieldValue('subCategories', [...temp, x._id])
                  } else {
                    formik.setFieldValue(
                      'subCategories',
                      temp.filter(y => y !== x._id),
                    )
                  }
                }}
              />
            </CustomListItem>
          </Grid>
        ))}
      </Grid>
    )
  }

  useEffect(() => {
    if (open) {
      const types = _.groupBy(ALL_SUB_CATEGORY, 'type')
      setTypes(types)
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      maxWidth={'lg'}
      fullWidth
    >
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
          <Grid
            container
            item
            xs={12}
            display={'flex'}
            justifyContent={'flex-end'}
          >
            {types &&
              Object.keys(types).map(x => (
                <Grid item key={x} xs={12}>
                  <Typography component={'h5'} fontWeight={'bold'} my={2}>
                    {x}
                  </Typography>
                  {ConditionList(types, x)}
                </Grid>
              ))}
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
