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

interface ChoosePricemodalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChoosePricemodal: React.FC<ChoosePricemodalProps> = ({
  open,
  setOpen,
}) => {
  const [price, setPrice] = useState<number[]>([4, 6])
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
    >
      <DialogTitle
        textAlign={'center'}
        pb={2}
        borderBottom={1}
        borderColor={'grey.500'}
      >
        Chọn giá bất động sản
      </DialogTitle>
      <DialogContent>
        <Typography
          textAlign={'center'}
          mt={2}
        >{`${price[0]} - ${price[1]} triệu`}</Typography>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={price}
          onChange={handleChangePrice}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          sx={{ marginTop: 5 }}
          max={10}
          min={0}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained">Xác nhận</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChoosePricemodal
