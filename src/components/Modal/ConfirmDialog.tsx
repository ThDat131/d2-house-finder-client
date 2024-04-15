import { FC } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'

interface ConfirmDialogProps {
  open: boolean
  title: string
  content: string
  isLoading?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      {
        <DialogActions>
          {onCancel ? (
            <Button onClick={onCancel} disabled={isLoading} color="primary">
              {t('confirmDialog.cancel')}
            </Button>
          ) : (
            <></>
          )}
          {onConfirm ? (
            <LoadingButton
              loading={isLoading}
              onClick={onConfirm}
              color="primary"
            >
              {t('confirmDialog.ok')}
            </LoadingButton>
          ) : (
            <></>
          )}
        </DialogActions>
      }
    </Dialog>
  )
}

export default ConfirmDialog
