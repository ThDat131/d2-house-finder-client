import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  createPermission,
  updatePermission,
} from '../../../../app/slice/permission.slice'
import { ActionType } from '../../../../common/common-enum'
import { Permission } from '../../../../model/permission/permission'
import { toast } from 'react-toastify'
import { RootState } from '../../../../app/store'

interface CreateUpdateDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  type: ActionType
  permission: Permission | null
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({
  open,
  setOpen,
  type,
  permission,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const permissionState = useAppSelector((state: RootState) => state.permission)

  const initialValues = {
    _id: type === ActionType.CREATE ? '' : permission?._id,
    name: type === ActionType.CREATE ? '' : permission?.name,
    apiPath: type === ActionType.CREATE ? '' : permission?.apiPath,
    method: type === ActionType.CREATE ? 'GET' : permission?.method,
    module: type === ActionType.CREATE ? '' : permission?.module,
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('admin.permission.youCantLeaveThisEmpty'),
    apiPath: Yup.string().required('admin.permission.youCantLeaveThisEmpty'),
    module: Yup.string().required('admin.permission.youCantLeaveThisEmpty'),
  })

  const onSubmit = () => {
    if (type === ActionType.CREATE)
      dispatch(createPermission(formik.values as Permission))
        .unwrap()
        .then(() => {
          toast.success(t('admin.permission.createPermissionSuccessfully'))
          setOpen(false)
        })
        .catch(() => {
          toast.error(t('admin.permission.errorHaveOccurPleaseTryAgain'))
        })

    if (type === ActionType.UPDATE)
      dispatch(updatePermission(formik.values as Permission))
        .unwrap()
        .then(() => {
          toast.success(t('admin.permission.updatePermissionSuccessfully'))
          setOpen(false)
        })
        .catch(() => {
          toast.error(t('admin.permission.errorHaveOccurPleaseTryAgain'))
        })
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
    >
      <DialogTitle>
        {type === ActionType.CREATE
          ? t('admin.permission.createPermission')
          : t('admin.permission.updatePermission')}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                label={t('admin.permission.name')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="apiPath"
                fullWidth
                value={formik.values.apiPath}
                onChange={formik.handleChange}
                label={t('admin.permission.apiPath')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl sx={{ width: 1 }}>
                <InputLabel id="method-label">
                  {t('admin.permission.method')}
                </InputLabel>
                <Select
                  name="method"
                  defaultValue="GET"
                  labelId={'method-label'}
                  fullWidth
                  value={formik.values.method}
                  label={t('admin.permission.method')}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="module"
                fullWidth
                value={formik.values.module}
                onChange={formik.handleChange}
                label={t('admin.permission.module')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" loading={permissionState.loading}>
            {type === ActionType.CREATE
              ? t('admin.permission.create')
              : t('admin.permission.update')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateUpdateDialog
