import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setAcreageFilter } from '../../app/slice/filter.slice'
import { RootState } from '../../app/store'

interface ChooseAcreageModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChooseAcreageModal: React.FC<ChooseAcreageModalProps> = ({
  open,
  setOpen,
}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const acreageFilter = useAppSelector((root: RootState) => root.filter.acreage)
  const [acreage, setAcreage] = useState<number[]>(acreageFilter)
  const valuetext = (value: number) => {
    return `${value}`
  }
  const handleChangeAcreage = (event: Event, newValue: number | number[]) => {
    setAcreage(newValue as number[])
  }

  return (
    <Dialog
      PaperProps={{ sx: { minHeight: 400 } }}
      fullWidth
      open={open}
      maxWidth={'md'}
      onClose={() => {
        setOpen(false)
      }}
    >
      <DialogTitle
        textAlign={'center'}
        pb={2}
        borderBottom={1}
        borderColor={'grey.500'}
      >
        {t('chooseAcreageModal.chooseAcreage')}
      </DialogTitle>
      <DialogContent>
        <Typography textAlign={'center'} mt={2}>
          {`${acreage[0]} - ${acreage[1]} m`}
          <sup>2</sup>
        </Typography>
        <Slider
          value={acreage}
          onChange={handleChangeAcreage}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          sx={{ marginTop: 5 }}
          max={90}
          min={0}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false)
            dispatch(setAcreageFilter(acreage))
          }}
        >
          {t('chooseAcreageModal.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChooseAcreageModal
