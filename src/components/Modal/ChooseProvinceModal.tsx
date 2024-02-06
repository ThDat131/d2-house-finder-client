import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { type RootState } from '../../app/store'
import React, { useState } from 'react'

interface ChooseProvinceModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChooseProvinceModal: React.FC<ChooseProvinceModalProps> = ({
  open,
  setOpen,
}) => {
  const provinces = useSelector((state: RootState) => state.province)
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [page, setPage] = useState<number>(0)
  const [provinceSelected, setProvinceSelected] = useState<number>(-1)
  const [districtSelected, setDistrictSelected] = useState<number>(-1)
  const [wardSelected, setWardSelected] = useState<number>(-1)
  const handleChangePage = (code: number) => {
    if (page === 0) {
      setProvinceSelected(code)
      setDistricts(provinces.find((x: any) => x.code === code).districts)
      setPage(1)
    } else if (page === 1) {
      setDistrictSelected(code)
      setWards(districts.find((x: any) => x.code === code).wards)
      setPage(2)
    } else {
      setWardSelected(code)
      setOpen(false)
      setPage(0)
      console.log(provinceSelected, districtSelected, code)
    }
  }

  const ProvinceSection = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}>
          <FormControlLabel
            value={'Toàn quốc'}
            control={<Radio />}
            label={'Toàn quốc'}
            sx={{ width: 1 }}
          />
        </Box>
        {provinces.map((p: any, index: number) => (
          <Box
            key={index}
            sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}
          >
            <FormControlLabel
              value={p.name}
              control={<Radio />}
              label={p.name}
              sx={{ width: 1 }}
              onClick={() => {
                handleChangePage(p.code)
              }}
            />
          </Box>
        ))}
      </>
    )
  }

  const DistrictSection = () => {
    return (
      <>
        {districts.map((p: any, index: number) => (
          <Box
            key={index}
            sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}
          >
            <FormControlLabel
              value={p.name}
              control={<Radio />}
              label={p.name}
              sx={{ width: 1 }}
              onClick={() => {
                handleChangePage(p.code)
              }}
            />
          </Box>
        ))}
      </>
    )
  }

  const WardSection = () => {
    return (
      <>
        {wards.map((p: any, index: number) => (
          <Box
            key={index}
            sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}
          >
            <FormControlLabel
              value={p.name}
              control={<Radio />}
              label={p.name}
              sx={{ width: 1 }}
              onClick={() => {
                handleChangePage(p.code)
              }}
            />
          </Box>
        ))}
      </>
    )
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
        Chọn tỉnh thành
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <RadioGroup defaultValue={'Toàn quốc'}>
            {page === 0 ? (
              <ProvinceSection />
            ) : page === 1 ? (
              <DistrictSection />
            ) : page === 2 ? (
              <WardSection />
            ) : (
              <></>
            )}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained">Xác nhận</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChooseProvinceModal
