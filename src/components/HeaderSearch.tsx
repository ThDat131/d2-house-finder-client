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
import {
  Box,
  Typography,
  Button,
  styled,
  Container,
  Stack,
} from '@mui/material'
import { useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import { useTranslation } from 'react-i18next'

const HeaderSearch = () => {
  const { t } = useTranslation()
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
    paddingY: 1,
    paddingX: 3,
    color: '#777',
    flex: 1,
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
    return t('header.all')
  }

  return (
    <Box sx={{ backgroundColor: '#febb02' }}>
      <Container>
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          py={2}
          spacing={2}
          direction={'row'}
        >
          <StyledButton
            sx={buttonStyle}
            variant="text"
            onClick={handleOpenChooseCategoryModal}
          >
            <HomeWorkIcon />
            <Typography component={'p'}>{t('header.category')}</Typography>
          </StyledButton>
          <StyledButton
            sx={buttonStyle}
            variant="text"
            onClick={handleOpenChooseProvinceModal}
          >
            <LocationOnIcon />
            <Typography component={'p'}>
              {handleShowSelectedAddress()}
            </Typography>
          </StyledButton>
          <StyledButton
            sx={buttonStyle}
            variant="text"
            onClick={handleOpenChoosePriceModal}
          >
            <AttachMoneyIcon />
            <Typography component={'p'}>{t('header.choosePrice')}</Typography>
          </StyledButton>
          <StyledButton
            sx={buttonStyle}
            variant="text"
            onClick={handleOpenChooseAcreageModal}
          >
            <TerrainIcon />
            <Typography component={'p'}>{t('header.chooseAcreage')}</Typography>
          </StyledButton>
          <Button
            sx={{ gap: 1, paddingX: 2, minWidth: 200 }}
            variant="contained"
          >
            <Typography component={'p'}>{t('header.search')}</Typography>
            <SearchIcon />
          </Button>
        </Stack>
      </Container>
      <ChooseCategoryModal open={categoryModal} setOpen={setCategoryModal} />
      <ChooseAddressModal open={provinceModal} setOpen={setProvinceModal} />
      <ChoosePricemodal open={priceModal} setOpen={setPriceModal} />
      <ChooseAcreageModal open={acreageModal} setOpen={setAcreageModal} />
    </Box>
  )
}

export default HeaderSearch
