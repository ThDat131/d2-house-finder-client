import { LoadingButton } from '@mui/lab'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { ActionType } from '../../../../common/common-enum'
import { Permission } from '../../../../model/permission/permission'
import { toast } from 'react-toastify'
import { RootState } from '../../../../app/store'
import { Role } from '../../../../model/role/role'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import _ from 'lodash'
import { createRole, updateRole } from '../../../../app/slice/role.slice'

interface CreateUpdateDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  type: ActionType
  role: Role | null
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({
  open,
  setOpen,
  type,
  role,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const permissionState = useAppSelector((state: RootState) => state.permission)

  const initialValues = {
    _id: type === ActionType.CREATE ? '' : role?._id ?? '',
    name: type === ActionType.CREATE ? '' : role?.name ?? '',
    description: type === ActionType.CREATE ? '' : role?.description ?? '',
    isActive: type === ActionType.CREATE ? false : role?.isActive ?? false,
    permissions: type === ActionType.CREATE ? [] : role?.permissions ?? [],
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('admin.role.youCantLeaveThisEmpty')),
    description: Yup.string().required(t('admin.role.youCantLeaveThisEmpty')),
  })

  const onSubmit = () => {
    if (type === ActionType.CREATE)
      dispatch(createRole(formik.values))
        .unwrap()
        .then(() => {
          toast.success(t('admin.role.createRoleSuccessfully'))
          setOpen(false)
        })
        .catch(() => {
          toast.error(t('admin.role.errorHaveOccurPleaseTryAgain'))
        })
    if (type === ActionType.UPDATE)
      dispatch(updateRole(formik.values))
        .unwrap()
        .then(() => {
          toast.success(t('admin.role.updateRoleSuccessfully'))
          setOpen(false)
        })
        .catch(() => {
          toast.error(t('admin.role.errorHaveOccurPleaseTryAgain'))
        })
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  const [selectedModule, setSelectedModule] = useState<string | false>(false)
  const [modules, setModules] = useState<any>()

  const handleChangeModule =
    (module: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setSelectedModule(newExpanded ? module : false)
    }

  const handleSelectMultiPermission = (x: string) => {
    const permission = modules[x].map((m: any) => m._id)

    const currentPermission = [...formik.values.permissions]

    const checkAll =
      currentPermission.length > 0 &&
      permission.every((p: string) => currentPermission.includes(p))

    if (!checkAll) {
      const data: string[] = []
      permission.forEach((p: string) => {
        if (!currentPermission.includes(p)) {
          data.push(p)
        }
      })

      formik.setFieldValue('permissions', currentPermission.concat(data))
    } else {
      formik.setFieldValue(
        'permissions',
        currentPermission.filter(p => !permission.includes(p)),
      )
    }
  }

  const PermissionList = (modules: any, key: string) => {
    if (!modules) return

    const array = modules[key]

    const getColor = (method: string) => {
      if (method === 'GET') return '#61affe'
      if (method === 'POST') return '#49cc90'
      if (method === 'PATCH') return '#50e3c2'
      if (method === 'PUT') return '#fca130'
      if (method === 'DELETE') return '#f93e3e'
    }

    return (
      <Grid container spacing={2}>
        {array.map((p: Permission) => (
          <Grid key={p._id} item xs={6}>
            <Stack direction={'row'}>
              <Box>
                <Switch
                  value={p._id}
                  checked={formik.values.permissions.includes(p._id as string)}
                  onChange={evt => {
                    const value = evt.target.value
                    const permissions = formik.values.permissions

                    if (permissions.includes(value)) {
                      formik.setFieldValue(
                        'permissions',
                        permissions.filter(x => x !== value),
                      )
                    } else
                      formik.setFieldValue('permissions', [
                        ...permissions,
                        value,
                      ])
                  }}
                />
              </Box>
              <Stack>
                <Typography>{p.name}</Typography>
                <Stack direction={'row'}>
                  <Typography fontWeight={'bold'} color={getColor(p.method)}>
                    {p.method}
                  </Typography>
                  <Typography color={'rgb(102, 102, 102)'} pl={1}>
                    {p.apiPath}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>
    )
  }

  useEffect(() => {
    const modules = _.groupBy(permissionState.permissions, 'module')

    setModules(modules)
  }, [permissionState])

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      maxWidth={'xl'}
    >
      <DialogTitle>
        {type === ActionType.CREATE
          ? t('admin.role.createRole')
          : t('admin.role.updateRole')}
      </DialogTitle>
      <DialogContent>
        <form id="permission-form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} alignItems={'center'}>
            <Grid item xs={12} md={6} mt={2}>
              <TextField
                name="name"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                label={t('admin.role.name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      value={formik.values.isActive}
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                    />
                  }
                  label={t('admin.role.active')}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                label={t('admin.role.description')}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>{t('admin.role.permission')}</Typography>
              <Grid container>
                {modules &&
                  Object.keys(modules).map(x => (
                    <Grid item key={x} xs={12}>
                      <Accordion
                        id={x}
                        aria-controls={x}
                        expanded={x === selectedModule}
                        onChange={handleChangeModule(x)}
                      >
                        <AccordionSummary>
                          <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            width={1}
                          >
                            <Typography>{x}</Typography>
                            <Switch
                              onClick={evt => {
                                evt.stopPropagation()
                              }}
                              checked={modules[x].every((p: Permission) =>
                                formik.values.permissions.includes(
                                  p._id as string,
                                ),
                              )}
                              onChange={() => {
                                handleSelectMultiPermission(x)
                              }}
                            />
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                          {PermissionList(modules, x)}
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems={'center'}></Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          form="permission-form"
          type="submit"
          loading={permissionState.loading}
        >
          {type === ActionType.CREATE
            ? t('admin.role.create')
            : t('admin.role.update')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default CreateUpdateDialog
