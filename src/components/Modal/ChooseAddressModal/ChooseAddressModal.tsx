import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { type RootState } from '../../../app/store'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { getAllProvinces, selectProvince } from './province.slice'
import { type District } from '../../../model/address/district'
import { type Ward } from '../../../model/address/ward'
import { type Province } from '../../../model/address/province'
import { getAllDistricts, selectDistrict } from './district.slice'
import { getAllWards, selectWard } from './ward.slice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Loading from '../../Loading'
import { useTranslation } from 'react-i18next'

interface ChooseAddressModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChooseAddressModal: React.FC<ChooseAddressModalProps> = ({
  open,
  setOpen,
}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const provinces = useAppSelector((state: RootState) => state.provinces.data)
  const provinceLoading = useAppSelector((state: RootState) => state.provinces.loading)
  const districtLoading = useAppSelector((state: RootState) => state.districts.loading)
  const wardLoading = useAppSelector((state: RootState) => state.wards.loading)
  const provinceSelected = useAppSelector((root: RootState) => root.provinces.selected)
  const districtSelected = useAppSelector((root: RootState) => root.districts.selected)
  const wardSelected = useAppSelector((root: RootState) => root.wards.selected)

  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [page, setPage] = useState<number>(0)

  useEffect(() => {
    const provincePromise = dispatch(getAllProvinces())

    return () => {
      provincePromise.abort()
    }
  }, [])

  const handleChangeWard = (ward: Ward) => {
    if (page === 2) {
      dispatch(selectWard(ward))
    }
  }

  const handleChangeProvince = (province: Province) => {
    if (page === 0) {
      dispatch(selectProvince(province))

      dispatch(getAllDistricts(province.province_id)).then(response => {
        setDistricts(response.payload.results)
      })

      setPage(1)
    }
  }
  const handleChangeDistrict = (district: District) => {

    if (page === 1) {
      dispatch(selectDistrict(district))

      dispatch(getAllWards(district.district_id)).then(response => {
        setWards(response.payload.results)
      })

      setPage(2)
    }
  }

  const handleGoBack = () => {
    if (page > 0)
      setPage(page - 1)
  }

  const handleSubmit = () => {
    setOpen(false)
    setPage(0)
  }

  const handleSelectAll = () => {
    dispatch(selectProvince(null))
    dispatch(selectDistrict(null))
    dispatch(selectWard(null))
  }

  const ProvinceSection = () => {
    return (
      <FormControl fullWidth>
        <RadioGroup>
          <Box sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}>
            <FormControlLabel
              value={-1}
              control={<Radio />}
              label={t('chooseAddressModal.nationWide')}
              sx={{ width: 1 }}
              onClick={handleSelectAll}
            />
          </Box>
          {provinces.map((p) => (
            <Box
              key={p.province_id}
              sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}
            >
              <FormControlLabel
                value={p.province_id}
                control={<Radio />}
                label={p.province_name}
                sx={{ width: 1 }}
                onClick={() => {
                  handleChangeProvince(p)
                }}
                checked={provinceSelected?.province_id === p.province_id}
              />
            </Box>
          ))}
        </RadioGroup>
      </FormControl>
    )
  }

  const DistrictSection = () => {
    return <FormControl fullWidth>
      <RadioGroup>
        {districts.map((d) => (
          <Box
            key={d.district_id}
            sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}
          >
            <FormControlLabel
              value={d.district_id}
              control={<Radio />}
              label={d.district_name}
              sx={{ width: 1 }}
              onClick={() => {
                handleChangeDistrict(d)
              }}
              checked={districtSelected?.district_id === d.district_id}
            />
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  }

  const WardSection = () => {
    return <FormControl fullWidth>
      <RadioGroup>
        {wards.map((w) => (
          <Box
            key={w.ward_id}
            sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}
          >
            <FormControlLabel
              value={w.ward_id}
              control={<Radio />}
              label={w.ward_name}
              sx={{ width: 1 }}
              onClick={() => {
                handleChangeWard(w)
              }}
              checked={wardSelected?.ward_id === w.ward_id}
            />
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  }

  const SelectionAddress = (): JSX.Element => {
    if (page === 0)
      return <ProvinceSection />

    if (page === 1)
      return <DistrictSection />

    if (page === 2)
      return <WardSection />

    return <></>
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
        {t('chooseAddressModal.chooseProvince')}
      </DialogTitle>
      <IconButton
        onClick={handleGoBack}
        sx={{
          position: 'absolute',
          left: 8,
          top: 10,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <DialogContent>
        {
          provinceLoading || districtLoading || wardLoading ? <Loading /> :
            <SelectionAddress />
        }
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>{t('chooseAddressModal.submit')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChooseAddressModal
