import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UpgradeLandlordRequest } from '../../../../model/upgrade-landlord-request/upgrade-landlord-request'
import moment from 'moment'
import {
  GenderEnum,
  LandlordRequestStatusEnum,
} from '../../../../common/common-enum'
import { DatePicker } from '@mui/x-date-pickers'
import { DEFAULT_FORMAT_DATE } from '../../../../common/common-constant'
import { LoadingButton } from '@mui/lab'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'
import { RootState } from '../../../../app/store'
import { useAppSelector } from '../../../../app/hooks'
import { HttpService } from '../../../../api/HttpService'
import { CompareResponse } from '../../../../model/face-plus-plus/face-plus-plus'
import { toast } from 'react-toastify'
import Fancybox from '../../../../components/FancyBox'

interface DetailsUpgradeDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  request: UpgradeLandlordRequest | undefined
}

const DetailsUpgradeDialog: React.FC<DetailsUpgradeDialogProps> = ({
  open,
  setOpen,
  request,
}) => {
  const { t } = useTranslation()
  const { httpFacePlusPlusService } = new HttpService()
  const currentRole = useAppSelector(
    (state: RootState) => state.auth.auth.user.role,
  )
  const [analyzeResult, setAnalyzeResult] = useState({
    confidence: -1,
    text: '',
  })
  const [analyzeLoading, setAnalyzeLoading] = useState(false)

  const analyzeFace = () => {
    setAnalyzeLoading(true)

    const data = new FormData()

    data.append('api_key', import.meta.env.VITE_FACE_PLUS_PLUS_KEY)
    data.append('api_secret', import.meta.env.VITE_FACE_PLUS_PLUS_SECRET)
    data.append('image_url1', request?.images[0] as string)
    data.append('image_url2', request?.images[2] as string)

    httpFacePlusPlusService
      .post<CompareResponse>('compare', data)
      .then(res => {
        if (res.status === 200) {
          const result = res.data

          let text = ''

          if (result.faces1.length === 0) {
            text = t(
              'generalManagement.upgradeLandlord.canNotIdentifyFaceInPersonalId',
            )
          } else if (result.faces2.length === 0) {
            text = t(
              'generalManagement.upgradeLandlord.canNotIdentifyFaceInProfileImage',
            )
          } else
            text = t('generalManagement.upgradeLandlord.matchRatioIs', {
              number: result.confidence,
            })

          console.log(res.data.confidence, text)

          setAnalyzeResult({
            confidence: res.data.confidence ?? 0,
            text,
          })
        } else {
          toast.error(t('admin.user.updateFailed'))
        }
      })
      .catch(() => {
        toast.error(t('admin.user.updateFailed'))
      })
      .finally(() => {
        setAnalyzeLoading(false)
      })
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    setAnalyzeResult({
      confidence: -1,
      text: '',
    })
  }, [open])

  if (!request) return <></>

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={'lg'}
      sx={{ zIndex: 2000 }}
    >
      <DialogTitle>
        {t('generalManagement.upgradeLandlord.requestDetailsInformation')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.id')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="id"
                name="id"
                value={request._id}
                size="small"
                fullWidth
                InputProps={{ disabled: true }}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12} alignItems={'center'} spacing={2}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.status')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              {request.status === LandlordRequestStatusEnum.PENDING ? (
                <Chip
                  label={t('generalManagement.upgradeLandlord.pending')}
                  color="warning"
                />
              ) : request.status === LandlordRequestStatusEnum.APPROVED ? (
                <Chip
                  label={t('generalManagement.upgradeLandlord.approved')}
                  color="success"
                />
              ) : (
                <Chip
                  label={t('generalManagement.upgradeLandlord.rejected')}
                  color="error"
                />
              )}
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.personalId')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="personalID"
                name="personalID"
                value={request.personalID}
                size="small"
                fullWidth
                InputProps={{ disabled: true }}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.dayOfBirth')}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <DatePicker
                name="dayOfBirth"
                sx={{ width: 1 }}
                value={moment(request.dayOfBirth)}
                disabled
              />
            </Grid>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.gender')}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <RadioGroup name="gender" row value={request.gender}>
                <FormControlLabel
                  value={GenderEnum.FEMALE}
                  control={<Radio />}
                  label={t('generalManagement.upgradeLandlord.female')}
                />
                <FormControlLabel
                  value={GenderEnum.MALE}
                  control={<Radio />}
                  label={t('generalManagement.upgradeLandlord.male')}
                />
              </RadioGroup>
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.address')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="address"
                name="address"
                value={request.address}
                InputProps={{ disabled: true }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.nationality')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="nationality"
                name="nationality"
                value={request.nationality}
                InputProps={{ disabled: true }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.placeOfIssue')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="placeOfIssue"
                name="placeOfIssue"
                value={request.placeOfIssue}
                InputProps={{ disabled: true }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.dateOfIssue')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <DatePicker
                name="dateOfIssue"
                sx={{ width: 1 }}
                value={moment(request.dateOfIssue)}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.feedBack')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="feedBack"
                name="feedBack"
                value={request.feedBack}
                InputProps={{ disabled: true }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} alignItems={'center'}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.createdAt')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="createdAt"
                name="createdAt"
                value={moment(request.createdAt).format(DEFAULT_FORMAT_DATE)}
                InputProps={{ disabled: true }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item container xs={12} alignItems={'center'} spacing={2}>
            <Grid item textAlign={'right'} xs={2}>
              <Typography>
                {t('generalManagement.upgradeLandlord.updatedAt')}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="updatedAt"
                name="updatedAt"
                value={moment(request.updatedAt).format(DEFAULT_FORMAT_DATE)}
                InputProps={{ disabled: true }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={2}
          >
            <Grid item>
              <Stack alignItems={'center'}>
                <Typography>
                  {t('generalManagement.upgradeLandlord.frontImagePersonalId')}
                </Typography>
                <Box
                  height={200}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.open(request.images[0])
                  }}
                >
                  <Box
                    component={'img'}
                    src={
                      request.images[0] ??
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                    }
                    width={1}
                    height={1}
                  />
                </Box>
              </Stack>
            </Grid>
            <Grid item>
              <Stack alignItems={'center'}>
                <Typography>
                  {t('generalManagement.upgradeLandlord.backImagePersonalId')}
                </Typography>
                <Box
                  height={200}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.open(request.images[1])
                  }}
                >
                  <Box
                    component={'img'}
                    src={
                      request.images[1] ??
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                    }
                    width={1}
                    height={1}
                  />
                </Box>
              </Stack>
            </Grid>
            <Grid item>
              <Stack alignItems={'center'}>
                <Typography>
                  {t('generalManagement.upgradeLandlord.profileImage')}
                </Typography>
                <Box
                  height={200}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.open(request.images[2])
                  }}
                >
                  <Box
                    component={'img'}
                    src={
                      request.images[2] ??
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6C7KefXhbUwl5NEW8iFCGfowi0GlBVYFDhjR06w7wcQ&s'
                    }
                    width={1}
                    height={1}
                  />
                </Box>
              </Stack>
            </Grid>
            {currentRole.name.toUpperCase().includes('ADMIN') && (
              <>
                <Grid item xs={12} container justifyContent={'center'}>
                  <LoadingButton
                    loading={analyzeLoading}
                    variant="contained"
                    endIcon={<FaceRetouchingNaturalIcon />}
                    onClick={() => {
                      analyzeFace()
                    }}
                  >
                    {t('generalManagement.upgradeLandlord.analyzeFace')}
                  </LoadingButton>
                </Grid>
                <Grid item xs={12}>
                  {analyzeResult.confidence >= 0 && (
                    <Alert
                      severity={
                        analyzeResult.confidence > 60
                          ? 'success'
                          : analyzeResult.confidence > 30
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {analyzeResult.text}
                    </Alert>
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose()
          }}
        >
          {t('generalManagement.upgradeLandlord.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailsUpgradeDialog
