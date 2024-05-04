import React, { useEffect, useState } from 'react'
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
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

  const isSelected = (value: number[]) => {
    return value[0] === acreage[0] && value[1] === acreage[1]
  }

  useEffect(() => {
    setAcreage(acreageFilter)
  }, [acreageFilter])

  return (
    <Dialog
      PaperProps={{ sx: { minHeight: 400 } }}
      fullWidth
      open={open}
      maxWidth={'md'}
      onClose={() => {
        setOpen(false)
      }}
      disableScrollLock
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
        <Stack
          direction={'row'}
          spacing={2}
          flexWrap={'wrap'}
          useFlexGap
          mt={2}
        >
          <Chip
            color="primary"
            variant={isSelected([0, 20]) ? 'filled' : 'outlined'}
            label={`${t('acreageFilter.underAcreage', { acreage: 20 })}m²`}
            onClick={() => {
              setAcreage([0, 20])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([20, 30]) ? 'filled' : 'outlined'}
            label={`${t('acreageFilter.fromAcreageToAcreage', {
              from: 20,
              to: 30,
            })}m²`}
            onClick={() => {
              setAcreage([20, 30])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([30, 50]) ? 'filled' : 'outlined'}
            label={`${t('acreageFilter.fromAcreageToAcreage', {
              from: 30,
              to: 50,
            })}m²`}
            onClick={() => {
              setAcreage([30, 50])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([50, 70]) ? 'filled' : 'outlined'}
            label={`${t('acreageFilter.fromAcreageToAcreage', {
              from: 50,
              to: 70,
            })}m²`}
            onClick={() => {
              setAcreage([50, 70])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([70, 90]) ? 'filled' : 'outlined'}
            label={`${t('acreageFilter.fromAcreageToAcreage', {
              from: 70,
              to: 90,
            })}m²`}
            onClick={() => {
              setAcreage([70, 90])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([90, 0]) ? 'filled' : 'outlined'}
            label={`${t('acreageFilter.overAcreage', {
              acreage: 90,
            })}m²`}
            onClick={() => {
              setAcreage([90, 0])
            }}
          />
        </Stack>
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
