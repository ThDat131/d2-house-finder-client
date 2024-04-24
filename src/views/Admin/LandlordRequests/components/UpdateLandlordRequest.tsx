import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LandlordRequestStatusEnum } from '../../../../common/common-enum'
import { UpgradeLandlordRequestUpdateModel } from '../../../../model/upgrade-landlord-request/upgrade-landlord-request'
import { toast } from 'react-toastify'
import { useAppDispatch } from '../../../../app/hooks'
import { updateLandlordRequest } from '../../../../app/slice/landlord-requests.slice'

interface UpdateLandlordRequestProps {
  id: string | undefined
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const UpdateLandlordRequest: React.FC<UpdateLandlordRequestProps> = ({
  id,
  open,
  setOpen,
}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [feedBack, setFeedBack] = useState<string>('')
  const [status, setStatus] = useState<string>(
    LandlordRequestStatusEnum.REJECTED,
  )

  const onCancel = () => {
    setOpen(false)
  }

  const onConfirm = () => {
    if (!id) {
      return
    }

    setIsLoading(true)

    const data: UpgradeLandlordRequestUpdateModel = {
      id,
      feedBack,
      status,
    }

    dispatch(updateLandlordRequest(data))
      .unwrap()
      .then(res => {
        toast.success(t('admin.landlordRequest.updateSuccess'))
        setOpen(false)
        setIsLoading(false)
      })
  }

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>
        {t('admin.landlordRequest.updateRequestId', { id })}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <FormControl fullWidth>
            <InputLabel id="status">
              {t('admin.landlordRequest.status')}
            </InputLabel>
            <Select
              labelId="status"
              value={status}
              onChange={evt => {
                setStatus(evt.target.value)
              }}
              label={t('admin.landlordRequest.status')}
            >
              <MenuItem value={LandlordRequestStatusEnum.APPROVED}>
                {t('admin.landlordRequest.approved')}
              </MenuItem>
              <MenuItem value={LandlordRequestStatusEnum.REJECTED}>
                {t('admin.landlordRequest.rejected')}
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            value={feedBack}
            onChange={evt => {
              setFeedBack(evt.target.value)
            }}
            label={t('admin.landlordRequest.feedBack')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading} color="primary">
          {t('admin.landlordRequest.cancel')}
        </Button>
        <LoadingButton loading={isLoading} onClick={onConfirm} color="primary">
          {t('admin.landlordRequest.update')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateLandlordRequest
