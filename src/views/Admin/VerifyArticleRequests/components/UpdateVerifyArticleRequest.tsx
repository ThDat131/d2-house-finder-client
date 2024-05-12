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
import { toast } from 'react-toastify'
import { useAppDispatch } from '../../../../app/hooks'
import { VerificationStatusEnum } from '../../../../common/common-enum'
import { VerifyArticleRequestsUpdateModel } from '../../../../model/verify-article-request/verify-article-request'
import { updateVerifyArticleRequest } from '../../../../app/slice/verify-article-requests.slice'

interface UpdateVerifyArticleRequestProps {
  id: string | undefined
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const UpdateVerifyArticleRequest: React.FC<UpdateVerifyArticleRequestProps> = ({
  id,
  open,
  setOpen,
}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [feedBack, setFeedBack] = useState<string>('')
  const [status, setStatus] = useState<string>(VerificationStatusEnum.REJECTED)

  const onCancel = () => {
    setOpen(false)
  }

  const onConfirm = () => {
    if (!id) {
      return
    }

    setIsLoading(true)

    const data: VerifyArticleRequestsUpdateModel = {
      id,
      feedBack,
      status,
    }

    dispatch(updateVerifyArticleRequest(data))
      .unwrap()
      .then(res => {
        console.log(res)
        if (res?.statusCode && res.statusCode !== 200) {
          toast.error(t('admin.permission.errorHaveOccurPleaseTryAgain'))
          return
        }
        toast.success(t('admin.verifyArticleRequest.updateSuccess'))
        setOpen(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>
        {t('admin.verifyArticleRequest.updateRequestId', { id })}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <FormControl fullWidth>
            <InputLabel id="status">
              {t('admin.verifyArticleRequest.status')}
            </InputLabel>
            <Select
              labelId="status"
              value={status}
              onChange={evt => {
                setStatus(evt.target.value)
              }}
              label={t('admin.verifyArticleRequest.status')}
            >
              <MenuItem value={VerificationStatusEnum.SUCCEED}>
                {t('admin.verifyArticleRequest.approved')}
              </MenuItem>
              <MenuItem value={VerificationStatusEnum.REJECTED}>
                {t('admin.verifyArticleRequest.rejected')}
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            value={feedBack}
            onChange={evt => {
              setFeedBack(evt.target.value)
            }}
            label={t('admin.verifyArticleRequest.feedBack')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading} color="primary">
          {t('admin.verifyArticleRequest.cancel')}
        </Button>
        <LoadingButton loading={isLoading} onClick={onConfirm} color="primary">
          {t('admin.verifyArticleRequest.update')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateVerifyArticleRequest
