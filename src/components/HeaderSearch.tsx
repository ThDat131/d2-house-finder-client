import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TerrainIcon from '@mui/icons-material/Terrain'
import SearchIcon from '@mui/icons-material/Search'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import ChooseCategoryModal from './Modal/ChooseCategoryModal'
import { useState } from 'react'
import ChooseAddressModal from './Modal/ChooseAddressModal/ChooseAddressModal'
import ChoosePricemodal from './Modal/ChoosePriceModal'
import ChooseAcreageModal from './Modal/ChooseAcreageModal'
import { Box, Typography, Button, styled } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'

const HeaderSearch = () => {
  const provinceSelected = useAppSelector(
    (root: RootState) => root.provinces.selected,
  )
  const districtSelected = useAppSelector(
    (root: RootState) => root.districts.selected,
  )
  const wardSelected = useAppSelector((root: RootState) => root.wards.selected)
  const [categoryModal, setCategoryModal] = useState<boolean>(false)
  const [provinceModal, setProvinceModal] = useState<boolean>(false)
  const [priceModal, setPriceModal] = useState<boolean>(false)
  const [acreageModal, setAcreageModal] = useState<boolean>(false)
  const buttonStyle = {
    minWidth: 200,
    paddingY: 1,
    paddingX: 3,
    color: '#777',
  }
  const handleOpenChooseCategoryModal = () => {
    setCategoryModal(true)
  }
  const handleOpenChooseProvinceModal = () => {
    setProvinceModal(true)
  }
  const handleOpenChoosePriceModal = () => {
    setPriceModal(true)
  }
  const handleOpenChooseAcreageModal = () => {
    setAcreageModal(true)
  }
  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#fff',
    textTransform: 'none',
    gap: 5,
    '&:hover': {
      backgroundColor: '#fff',
    },
  }))

  const handleShowSelectedAddress = (): string => {
    if (provinceSelected && districtSelected && wardSelected) {
      return `${provinceSelected.province_name}, ${districtSelected.district_name}, ${wardSelected.ward_name}`
    }
    if (provinceSelected && districtSelected) {
      return `${provinceSelected.province_name}, ${districtSelected.district_name}`
    }
    if (provinceSelected) return `${provinceSelected.province_name}`
    return 'Toàn quốc'
  }

  return (
    <>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={2}
        py={2}
        sx={{ backgroundColor: '#febb02' }}
      >
        <StyledButton
          sx={buttonStyle}
          variant="text"
          onClick={handleOpenChooseCategoryModal}
        >
          <HomeWorkIcon />
          <Typography component={'p'}>Chọn loại bất động sản</Typography>
        </StyledButton>
        <StyledButton
          sx={buttonStyle}
          variant="text"
          onClick={handleOpenChooseProvinceModal}
        >
          <LocationOnIcon />
          <Typography component={'p'}>{handleShowSelectedAddress()}</Typography>
        </StyledButton>
        <StyledButton
          sx={buttonStyle}
          variant="text"
          onClick={handleOpenChoosePriceModal}
        >
          <AttachMoneyIcon />
          <Typography component={'p'}>Chọn giá</Typography>
        </StyledButton>
        <StyledButton
          sx={buttonStyle}
          variant="text"
          onClick={handleOpenChooseAcreageModal}
        >
          <TerrainIcon />
          <Typography component={'p'}>Chọn diện tích</Typography>
        </StyledButton>
        <Button sx={{ gap: 1, paddingX: 2, minWidth: 200 }} variant="contained">
          <Typography component={'p'}>Tìm kiếm</Typography>
          <SearchIcon />
        </Button>
      </Box>
      <ChooseCategoryModal open={categoryModal} setOpen={setCategoryModal} />
      <ChooseAddressModal open={provinceModal} setOpen={setProvinceModal} />
      <ChoosePricemodal open={priceModal} setOpen={setPriceModal} />
      <ChooseAcreageModal open={acreageModal} setOpen={setAcreageModal} />
    </>
  )
}

export default HeaderSearch
