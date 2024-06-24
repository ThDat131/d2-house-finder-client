import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  ListItem,
  Paper,
  TextField,
  Typography,
  styled,
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
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { ALL_SUB_CATEGORY } from '../../../../app/sample-sub-category'

const CreateCategory = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const error = useAppSelector((state: RootState) => state.category.error)

  const [types, setTypes] = useState<any>()
  const [selectedSubCategories, setSelectedSubCategories] = useState<any>([])

  const initialValues = {
    name: '',
    active: true,
    subCategories: [],
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('admin.category.nameIsRequired')),
  })

  const onSubmit = () => {
    formik.values.subCategories = selectedSubCategories

    dispatch(createCategory(formik.values))
      .unwrap()
      .then(res => {
        if (res.statusCode === 201) {
          toast.success(t('admin.category.createSuccess'))
          navigate('/admin/category')
        }
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
            <CustomListItem key={x._id} style={ListItemStyle}>
              <FormControlLabel
                control={<Checkbox />}
                label={x.name}
                checked={selectedSubCategories.includes(x._id)}
                onClick={() => {
                  if (!selectedSubCategories.includes(x._id)) {
                    setSelectedSubCategories((prev: any) => [...prev, x._id])
                  } else {
                    setSelectedSubCategories((prev: any) =>
                      prev.filter((y: any) => y !== x._id),
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
    const types = _.groupBy(ALL_SUB_CATEGORY, 'type')

    setTypes(types)
  }, [])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} height={1}>
        <Grid item>
          <Typography variant={'h3'} mb={2}>
            {t('admin.category.createACategory')}
          </Typography>
        </Grid>
        <Grid item container xs={12} flex={1}>
          <Paper sx={{ width: 1, height: 1 }}>
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
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      name="active"
                      onChange={formik.handleChange}
                    />
                  }
                  label={t('admin.category.active')}
                />
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
