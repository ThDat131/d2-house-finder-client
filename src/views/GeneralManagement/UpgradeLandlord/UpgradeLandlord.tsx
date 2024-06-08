import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  Popper,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { DatePicker } from '@mui/x-date-pickers'
import {
  GenderEnum,
  LandlordRequestStatusEnum,
} from '../../../common/common-enum'
import moment from 'moment'
import {
  UpgradeLandlordRequest,
  UpgradeLandlordRequestResponse,
} from '../../../model/upgrade-landlord-request/upgrade-landlord-request'
import { HttpService } from '../../../api/HttpService'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { DEFAULT_FORMAT_DATE } from '../../../common/common-constant'
import { CommonResponse } from '../../../model/common/common-response'
import { toast } from 'react-toastify'
import DetailsUpgradeDialog from './components/DetailsUpgradeDialog'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { Camera } from 'react-camera-pro'

enum TypeTabEnum {
  CREATE = 'CREATE',
  LIST = 'LIST',
}

const CustomPopper = (props: any) => <Popper {...props} style={{ height: 0 }} />

const UpgradeLandlord = (): JSX.Element => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const { t } = useTranslation()
  const { httpService } = new HttpService()
  const auth = useAppSelector((state: RootState) => state.auth)
  const requestsRef = useRef(false)

  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState<TypeTabEnum>(
    TypeTabEnum.CREATE,
  )
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const [requests, setRequests] = useState<UpgradeLandlordRequestResponse>()
  const [fetchRequestsLoading, setFetchRequestsLoading] =
    useState<boolean>(false)
  const [canCreate, setCanCreate] = useState<boolean>(true)
  const [openDetails, setOpenDetails] = useState<boolean>(false)
  const [selectedRequest, setSelectedRequest] =
    useState<UpgradeLandlordRequest>()
  const [frontImageLoading, setFrontImageLoading] = useState<boolean>(false)
  const [backImageLoading, setBackImageLoading] = useState<boolean>(false)
  const [profileImageLoading, setProfileImageLoading] = useState<boolean>(false)
  const [imageUpload, setImageUpload] = useState<any>([])
  const [openVideo, setOpenVideo] = useState<boolean>(false)
  const camera = useRef(null)
  const [image, setImage] = useState(null)

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('generalManagement.upgradeLandlord.id'),
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: t('generalManagement.upgradeLandlord.createdAt'),
      valueFormatter: params =>
        moment(params.value).format(DEFAULT_FORMAT_DATE),
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: t('generalManagement.upgradeLandlord.updatedAt'),
      valueFormatter: params =>
        moment(params.value).format(DEFAULT_FORMAT_DATE),
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('generalManagement.upgradeLandlord.status'),
      renderCell: params => {
        switch (params.value) {
          case LandlordRequestStatusEnum.PENDING:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.pending')}
                color="warning"
              />
            )
          case LandlordRequestStatusEnum.APPROVED:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.approved')}
                color="success"
              />
            )
          case LandlordRequestStatusEnum.REJECTED:
            return (
              <Chip
                label={t('generalManagement.upgradeLandlord.rejected')}
                color="error"
              />
            )
        }
      },
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('generalManagement.upgradeLandlord.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            <Button
              variant="contained"
              onClick={() => {
                handleSeeDetail(params.row)
              }}
            >
              {t('generalManagement.upgradeLandlord.details')}
            </Button>
          </Stack>
        )
      },
      flex: 1,
    },
  ]

  const initialValues: UpgradeLandlordRequest = {
    personalID: '',
    dayOfBirth: new Date(),
    address: '',
    gender: GenderEnum.FEMALE,
    nationality: '',
    dateOfIssue: new Date(),
    status: LandlordRequestStatusEnum.PENDING,
    placeOfIssue: '',
    images: ['', '', ''],
  }

  const validationSchema = Yup.object().shape({
    personalID: Yup.string().required(
      t('generalManagement.upgradeLandlord.noEnteredPersonalId'),
    ),
    address: Yup.string().required(
      t('generalManagement.upgradeLandlord.noEnteredAddress'),
    ),
    nationality: Yup.string().required(
      t('generalManagement.upgradeLandlord.noEnteredNationality'),
    ),
    placeOfIssue: Yup.string().required(
      t('generalManagement.upgradeLandlord.noEnteredPlaceOfIssue'),
    ),
  })

  const onSubmit = () => {
    handleCreateLandlordRequest(formik.values)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  const handleSeeDetail = (request: UpgradeLandlordRequest) => {
    setOpenDetails(true)
    setSelectedRequest(request)
  }

  const handleCreateLandlordRequest = (model: UpgradeLandlordRequest) => {
    setLoadingSubmit(true)

    model.images = imageUpload.map((x: any) => x.url)

    httpService
      .post(ApiPathEnum.LandlordRequest, model)
      .then(res => {
        if (res.status === 201) {
          setIsUpdated(!isUpdated)
          toast.success(
            t('generalManagement.upgradeLandlord.sendRequestSuccessfully'),
          )
          setCanCreate(false)
        }
      })
      .finally(() => {
        setLoadingSubmit(false)
      })
  }

  const fetchLandlordRequest = () => {
    setFetchRequestsLoading(true)

    httpService
      .get<CommonResponse<UpgradeLandlordRequestResponse>>(
        ApiPathEnum.LandlordRequest,
        {
          params: {
            createdBy: auth.auth.user._id,
            pageSize: paginationModel.pageSize,
            current: paginationModel.page + 1,
          },
        },
      )
      .then(res => {
        if (res.status === 200) {
          const data = res.data.data
          setRequests(data)

          const havePending = data.results.some(
            x => x.status === LandlordRequestStatusEnum.PENDING,
          )

          if (havePending) {
            setCanCreate(false)
          }
        }
      })
      .finally(() => {
        setFetchRequestsLoading(false)
      })
  }

  const handleChangeFrontImage = (evt: any) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        const formData = new FormData()
        formData.append('file', file)

        setFrontImageLoading(true)
        httpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              const temp = [...imageUpload]
              temp[0] = {
                url: res.data.data.path,
                name: file.name,
              }
              setImageUpload(temp)
            }
          })
          .finally(() => {
            setFrontImageLoading(false)
          })
      }
    }
  }

  const handleChangeBackImage = (evt: any) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        const formData = new FormData()
        formData.append('file', file)

        setBackImageLoading(true)
        httpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              const temp = [...imageUpload]
              temp[1] = {
                url: res.data.data.path,
                name: file.name,
              }
              setImageUpload(temp)
            }
          })
          .finally(() => {
            setBackImageLoading(false)
          })
      }
    }
  }

  const handleChangeProfileImage = () => {
    setOpenVideo(true)
  }

  const handleDeleteImagesFile = (index: number) => {
    const temp = [...imageUpload]

    temp.splice(index, 1)

    setImageUpload(temp)
  }

  useEffect(() => {
    if (!requestsRef.current) {
      fetchLandlordRequest()
      requestsRef.current = true
    } else {
      requestsRef.current = false
    }
  }, [paginationModel, isUpdated])

  return (
    <Grid item container>
      <Grid item borderBottom={1} xs={12}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.upgradeLandlord.upgradeLandlord')}
        </Typography>
      </Grid>
      <Grid item xs={12} height={1}>
        <TabContext value={selectedTab}>
          <Box>
            <TabList
              onChange={(evt, value) => {
                setSelectedTab(value)
              }}
            >
              <Tab
                label={t('generalManagement.upgradeLandlord.create')}
                value={TypeTabEnum.CREATE}
              />
              <Tab
                label={t('generalManagement.upgradeLandlord.requestedList')}
                value={TypeTabEnum.LIST}
              />
            </TabList>
          </Box>
          <TabPanel value={TypeTabEnum.CREATE}>
            <Container>
              <Alert severity={canCreate ? 'info' : 'warning'} sx={{ mb: 4 }}>
                {canCreate
                  ? t('generalManagement.upgradeLandlord.pleaseInputInfo')
                  : t('generalManagement.upgradeLandlord.alreadyHaveRequest')}
              </Alert>
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={5}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={4}
                      container
                      justifyContent={'center'}
                      direction={'column'}
                      alignItems={'center'}
                      gap={2}
                    >
                      <Typography>
                        {t(
                          'generalManagement.upgradeLandlord.frontImagePersonalId',
                        )}
                      </Typography>
                      {imageUpload[0]?.url && !frontImageLoading ? (
                        <Grid
                          item
                          xs={3}
                          key={imageUpload[0].name}
                          flexDirection={'column'}
                        >
                          <Box height={200} overflow={'hidden'} boxShadow={5}>
                            <Box
                              component={'img'}
                              srcSet={imageUpload[0].url}
                              src={imageUpload[0].url}
                              width={'100%'}
                              height={'100%'}
                            />
                          </Box>
                          <Button
                            startIcon={<DeleteIcon />}
                            fullWidth
                            variant="contained"
                            onClick={() => {
                              handleDeleteImagesFile(0)
                            }}
                          >
                            {t('generalManagement.createNewArticle.delete')}
                          </Button>
                        </Grid>
                      ) : (
                        <LoadingButton
                          variant="contained"
                          startIcon={<FileUploadIcon />}
                          component={'label'}
                          loading={frontImageLoading}
                          disabled={!canCreate}
                        >
                          {t('generalManagement.verifyArticle.upload')}
                          <input
                            type="file"
                            multiple
                            hidden
                            onChange={evt => {
                              handleChangeFrontImage(evt)
                            }}
                          />
                        </LoadingButton>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      container
                      justifyContent={'center'}
                      direction={'column'}
                      alignItems={'center'}
                      gap={2}
                    >
                      <Typography>
                        {t(
                          'generalManagement.upgradeLandlord.backImagePersonalId',
                        )}
                      </Typography>
                      {imageUpload[1]?.url && !backImageLoading ? (
                        <Grid
                          item
                          xs={3}
                          key={imageUpload[1].name}
                          flexDirection={'column'}
                        >
                          <Box height={200} overflow={'hidden'} boxShadow={5}>
                            <Box
                              component={'img'}
                              srcSet={imageUpload[1].url}
                              src={imageUpload[1].url}
                              width={'100%'}
                              height={'100%'}
                            />
                          </Box>
                          <Button
                            startIcon={<DeleteIcon />}
                            fullWidth
                            variant="contained"
                            onClick={() => {
                              handleDeleteImagesFile(1)
                            }}
                          >
                            {t('generalManagement.createNewArticle.delete')}
                          </Button>
                        </Grid>
                      ) : (
                        <LoadingButton
                          variant="contained"
                          startIcon={<FileUploadIcon />}
                          component={'label'}
                          loading={backImageLoading}
                          disabled={!canCreate}
                        >
                          {t('generalManagement.verifyArticle.upload')}
                          <input
                            type="file"
                            multiple
                            hidden
                            onChange={evt => {
                              handleChangeBackImage(evt)
                            }}
                          />
                        </LoadingButton>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      container
                      justifyContent={'center'}
                      direction={'column'}
                      alignItems={'center'}
                      gap={2}
                    >
                      <Typography>
                        {t('generalManagement.upgradeLandlord.profileImage')}
                      </Typography>
                      {imageUpload[2]?.url && !profileImageLoading ? (
                        <Grid
                          item
                          xs={3}
                          key={imageUpload[2].name}
                          flexDirection={'column'}
                        >
                          <Box height={200} overflow={'hidden'} boxShadow={5}>
                            <Box
                              component={'img'}
                              srcSet={imageUpload[2].url}
                              src={imageUpload[2].url}
                              width={'100%'}
                              height={'100%'}
                            />
                          </Box>
                          <Button
                            startIcon={<DeleteIcon />}
                            fullWidth
                            variant="contained"
                            onClick={() => {
                              handleDeleteImagesFile(2)
                            }}
                          >
                            {t('generalManagement.createNewArticle.delete')}
                          </Button>
                        </Grid>
                      ) : (
                        <LoadingButton
                          variant="contained"
                          startIcon={<FileUploadIcon />}
                          component={'label'}
                          loading={profileImageLoading}
                          disabled={!canCreate}
                          onClick={() => {
                            handleChangeProfileImage()
                          }}
                        >
                          {t('generalManagement.upgradeLandlord.takePhoto')}
                        </LoadingButton>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container item alignItems={'center'}>
                    <Grid item textAlign={'center'} xs={2}>
                      <Typography>
                        {t('generalManagement.upgradeLandlord.personalId')}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        id="personalID"
                        name="personalID"
                        value={formik.values.personalID}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.personalID &&
                          Boolean(formik.errors.personalID)
                        }
                        helperText={
                          formik.touched.personalID && formik.errors.personalID
                        }
                        size="small"
                        fullWidth
                        disabled={!canCreate}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item alignItems={'center'}>
                    <Grid item textAlign={'center'} xs={2}>
                      <Typography>
                        {t('generalManagement.upgradeLandlord.dayOfBirth')}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <DatePicker
                        slots={{
                          popper: CustomPopper,
                        }}
                        name="dayOfBirth"
                        sx={{ width: 1 }}
                        value={moment(formik.values.dayOfBirth)}
                        onChange={value => {
                          formik.setFieldValue('dayOfBirth', value?.toDate())
                        }}
                        disabled={!canCreate}
                      />
                    </Grid>
                    <Grid item textAlign={'center'} xs={2}>
                      <Typography>
                        {t('generalManagement.upgradeLandlord.gender')}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <RadioGroup
                        defaultValue={GenderEnum.FEMALE}
                        name="gender"
                        row
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel
                          value={GenderEnum.FEMALE}
                          control={<Radio />}
                          label={t('generalManagement.upgradeLandlord.female')}
                          disabled={!canCreate}
                        />
                        <FormControlLabel
                          value={GenderEnum.MALE}
                          control={<Radio />}
                          label={t('generalManagement.upgradeLandlord.male')}
                          disabled={!canCreate}
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Grid container item alignItems={'center'}>
                    <Grid item textAlign={'center'} xs={2}>
                      <Typography>
                        {t('generalManagement.upgradeLandlord.address')}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        id="address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                        size="small"
                        fullWidth
                        disabled={!canCreate}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item alignItems={'center'}>
                    <Grid item textAlign={'center'} xs={2}>
                      <Typography>
                        {t('generalManagement.upgradeLandlord.dateOfIssue')}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <DatePicker
                        slots={{
                          popper: CustomPopper,
                        }}
                        name="dateOfIssue"
                        sx={{ width: 1 }}
                        value={moment(formik.values.dateOfIssue)}
                        onChange={value => {
                          formik.setFieldValue('dateOfIssue', value?.toDate())
                        }}
                        disabled={!canCreate}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item alignItems={'center'}>
                    <Grid item textAlign={'center'} xs={2}>
                      <Typography>
                        {t('generalManagement.upgradeLandlord.placeOfIssue')}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        id="placeOfIssue"
                        name="placeOfIssue"
                        value={formik.values.placeOfIssue}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.placeOfIssue &&
                          Boolean(formik.errors.placeOfIssue)
                        }
                        helperText={
                          formik.touched.placeOfIssue &&
                          formik.errors.placeOfIssue
                        }
                        size="small"
                        fullWidth
                        disabled={!canCreate}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item alignItems={'center'}>
                    <Grid item textAlign={'center'} xs={2}>
                      <Typography>
                        {t('generalManagement.upgradeLandlord.nationality')}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        id="nationality"
                        name="nationality"
                        value={formik.values.nationality}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.nationality &&
                          Boolean(formik.errors.nationality)
                        }
                        helperText={
                          formik.touched.nationality &&
                          formik.errors.nationality
                        }
                        size="small"
                        fullWidth
                        disabled={!canCreate}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <LoadingButton
                        fullWidth
                        variant="contained"
                        type="submit"
                        loading={loadingSubmit}
                        disabled={!canCreate}
                      >
                        {t('generalManagement.updateInformation.saveUpdate')}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Stack>
              </form>
            </Container>
          </TabPanel>
          <TabPanel value={TypeTabEnum.LIST}>
            <Grid item xs={12} height={1} display={'grid'}>
              <DataGrid
                getRowId={x => x._id}
                rows={(requests?.results as UpgradeLandlordRequest[]) ?? []}
                paginationMode={'server'}
                rowCount={requests?.meta?.total ?? 1}
                columns={columns}
                loading={fetchRequestsLoading}
                initialState={{
                  pagination: {
                    paginationModel,
                  },
                }}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick={true}
                slots={{
                  noRowsOverlay: () => (
                    <Stack
                      alignItems={'center'}
                      justifyContent={'center'}
                      height={1}
                    >
                      {t('generalManagement.noDataFound')}
                    </Stack>
                  ),
                  noResultsOverlay: () => (
                    <Stack
                      alignItems={'center'}
                      justifyContent={'center'}
                      height={1}
                    >
                      {t('generalManagement.noDataFound')}
                    </Stack>
                  ),
                }}
                autoHeight={true}
              />
            </Grid>
          </TabPanel>
        </TabContext>
      </Grid>
      <DetailsUpgradeDialog
        open={openDetails}
        setOpen={setOpenDetails}
        request={selectedRequest as UpgradeLandlordRequest}
      />
      <Dialog
        open={openVideo}
        onClose={() => {
          setOpenVideo(false)
        }}
        maxWidth={'lg'}
        fullWidth
      >
        <DialogContent>
          <Box overflow={'hidden'} position={'relative'} height={800}>
            <Camera
              ref={camera}
              errorMessages={{
                noCameraAccessible: t(
                  'generalManagement.upgradeLandlord.pleaseAllowCameraAccess',
                ),
                permissionDenied: t(
                  'generalManagement.upgradeLandlord.pleaseAllowCameraAccess',
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const photo = camera.current as any
              const base64Photo = photo.takePhoto()

              if (base64Photo) {
                setProfileImageLoading(true)
                httpService
                  .post<CommonResponse<any>>(ApiPathEnum.UploadBase64File, {
                    base64: base64Photo,
                  })
                  .then(res => {
                    if (res.status === 201) {
                      const temp = [...imageUpload]
                      temp[2] = {
                        url: res.data.data.path,
                        name: 'profile',
                      }
                      setImageUpload(temp)
                    }
                  })
                  .finally(() => {
                    setProfileImageLoading(false)
                  })
              }

              setOpenVideo(false)
            }}
          >
            {t('generalManagement.upgradeLandlord.takePhoto')}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default UpgradeLandlord
