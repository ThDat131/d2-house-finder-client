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

  const isSelected = (value: number[]) => {
    return value[0] === price[0] && value[1] === price[1]
  }

  useEffect(() => {
    setPrice(priceFilter)
  }, [priceFilter])

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
        <Stack
          direction={'row'}
          spacing={2}
          flexWrap={'wrap'}
          useFlexGap
          mt={2}
        >
          <Chip
            color="primary"
            variant={isSelected([0, 1]) ? 'filled' : 'outlined'}
            label={t('priceFilter.underMillion', { price: 1 })}
            onClick={() => {
              setPrice([0, 1])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([1, 2]) ? 'filled' : 'outlined'}
            label={t('priceFilter.fromPriceToPrice', {
              fromPrice: 1,
              toPrice: 2,
            })}
            onClick={() => {
              setPrice([1, 2])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([2, 3]) ? 'filled' : 'outlined'}
            label={t('priceFilter.fromPriceToPrice', {
              fromPrice: 2,
              toPrice: 3,
            })}
            onClick={() => {
              setPrice([2, 3])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([3, 5]) ? 'filled' : 'outlined'}
            label={t('priceFilter.fromPriceToPrice', {
              fromPrice: 3,
              toPrice: 5,
            })}
            onClick={() => {
              setPrice([3, 5])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([5, 7]) ? 'filled' : 'outlined'}
            label={t('priceFilter.fromPriceToPrice', {
              fromPrice: 5,
              toPrice: 7,
            })}
            onClick={() => {
              setPrice([5, 7])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([7, 10]) ? 'filled' : 'outlined'}
            label={t('priceFilter.fromPriceToPrice', {
              fromPrice: 7,
              toPrice: 10,
            })}
            onClick={() => {
              setPrice([7, 10])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([10, 15]) ? 'filled' : 'outlined'}
            label={t('priceFilter.fromPriceToPrice', {
              fromPrice: 10,
              toPrice: 15,
            })}
            onClick={() => {
              setPrice([10, 15])
            }}
          />
          <Chip
            color="primary"
            variant={isSelected([15, 0]) ? 'filled' : 'outlined'}
            label={t('priceFilter.overMillion', { price: 15 })}
            onClick={() => {
              setPrice([15, 0])
            }}
          />
        </Stack>
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
