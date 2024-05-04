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
import { setPriceFilter } from '../../app/slice/filter.slice'
import { RootState } from '../../app/store'

interface ChoosePriceModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChoosePriceModal: React.FC<ChoosePriceModalProps> = ({
  open,
  setOpen,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const priceFilter = useAppSelector((root: RootState) => root.filter.price)
  const [price, setPrice] = useState<number[]>(priceFilter)
  const valuetext = (value: number) => {
    return `${value}`
  }
  const handleChangePrice = (event: Event, newValue: number | number[]) => {
    setPrice(newValue as number[])
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
      disableScrollLock
    >
      <DialogTitle
        textAlign={'center'}
        pb={2}
        borderBottom={1}
        borderColor={'grey.500'}
      >
        {t('choosePriceModal.choosePrice')}
      </DialogTitle>
      <DialogContent>
        <Typography textAlign={'center'} mt={2}>
          {t('choosePriceModal.millionDong', {
            price: `${price[0]} - ${price[1]}`,
          })}
        </Typography>
        <Slider
          value={price}
          onChange={handleChangePrice}
          getAriaValueText={valuetext}
          sx={{ marginTop: 5 }}
          max={30}
          min={0}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(setPriceFilter(price))
            setOpen(false)
          }}
        >
          {t('choosePriceModal.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChoosePriceModal
