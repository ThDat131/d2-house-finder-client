import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TerrainIcon from '@mui/icons-material/Terrain'
import SearchIcon from '@mui/icons-material/Search'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import ChooseCategoryModal from './Modal/ChooseCategoryModal'
import { useState } from 'react'
import ChooseAddressModal from './Modal/ChooseAddressModal/ChooseAddressModal'
import ChoosePriceModal from './Modal/ChoosePriceModal'
import ChooseAcreageModal from './Modal/ChooseAcreageModal'
import {
  Box,
  Typography,
  Button,
  styled,
  Container,
  Stack,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import { useTranslation } from 'react-i18next'
import { getArticles } from '../app/slice/article.slice.'
import { setFilterQuery } from '../app/slice/filter.slice'

const HeaderSearch = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const provinceSelected = useAppSelector(
    (root: RootState) => root.provinces.selected,
  )
  const districtSelected = useAppSelector(
    (root: RootState) => root.districts.selected,
  )
  const wardSelected = useAppSelector((root: RootState) => root.wards.selected)
  const categorySelected = useAppSelector(
    (root: RootState) => root.category.selected,
  )
  const categories = useAppSelector((root: RootState) => root.category)
  const subCategories = useAppSelector((root: RootState) => root.subCategory)
  const filter = useAppSelector((root: RootState) => root.filter)
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
  const textStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'noWrap',
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

  const handleSearch = () => {
    let filterString = '?'
    if (categories.selected) {
      filterString = filterString.concat(
        `categoryId=${categories.selected._id}&`,
      )
    }
    if (filter.price[0] > 0) {
      filterString = filterString.concat(
        `price%3E=${filter.price[0] * 1000000}&`,
      )
    }
    if (filter.price[1] > 0) {
      filterString = filterString.concat(
        `price%3C=${filter.price[1] * 1000000}&`,
      )
    }
    if (filter.acreage[0] > 0) {
      filterString = filterString.concat(`acreage%3E=${filter.acreage[0]}&`)
    }
    if (filter.acreage[1] > 0) {
      filterString = filterString.concat(`acreage%3C=${filter.acreage[1]}&`)
    }
    if (provinceSelected) {
      filterString = filterString.concat(
        `address.provinceCode=${+provinceSelected.province_id}&`,
      )
    }
    if (districtSelected) {
      filterString = filterString.concat(
        `address.districtCode=${+districtSelected.district_id}&`,
      )
    }
    if (wardSelected) {
      filterString = filterString.concat(
        `address.wardCode=${+wardSelected.ward_id}&`,
      )
    }

    if (subCategories.selected.length > 0) {
      filterString = filterString.concat(
        `filter={"attributes":{"$all":["${subCategories.selected.join(
          '","',
        )}"]}}`,
      )
    }

    dispatch(setFilterQuery(filterString))
    dispatch(getArticles({ current: 1, filter: filterString }))
  }

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

  const handleShowSelectedCategory = (): string => {
    return categorySelected
      ? categorySelected?.name ?? ''
      : t('header.category')
  }

  const handleShowPriceFilter = (): string => {
    if ((filter.price && filter.price[0] !== 0) || filter.price[1] !== 0) {
      if (filter.price[1] === 0) {
        return t('header.overMillionDong', {
          price: `${filter.price[0]}`,
        })
      }
      return t('header.millionDong', {
        price: `${filter.price[0]} - ${filter.price[1]}`,
      })
    }
    return t('header.choosePrice')
  }

  const handleShowAcreageFilter = (): string => {
    if (
      filter.acreage &&
      (filter.acreage[0] !== 0 || filter.acreage[1] !== 0)
    ) {
      if (filter.acreage[1] === 0) {
        return t('header.over', {
          acreage: `${filter.acreage[0]} m${String.fromCharCode(178)}`,
        })
      }
      return `${filter.acreage[0]} - ${
        filter.acreage[1]
      } m${String.fromCharCode(178)}`
    }

    return t('header.chooseAcreage')
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
            <Typography component={'p'} sx={textStyle}>
              {handleShowSelectedCategory()}
            </Typography>
          </StyledButton>
          <StyledButton
            sx={buttonStyle}
            variant="text"
            onClick={handleOpenChooseProvinceModal}
          >
            <LocationOnIcon />
            <Typography sx={textStyle} component={'p'}>
              {handleShowSelectedAddress()}
            </Typography>
          </StyledButton>
          <StyledButton
            sx={buttonStyle}
            variant="text"
            onClick={handleOpenChoosePriceModal}
          >
            <AttachMoneyIcon />
            <Typography component={'p'} sx={textStyle}>
              {handleShowPriceFilter()}
            </Typography>
          </StyledButton>
          <StyledButton
            sx={buttonStyle}
            variant="text"
            onClick={handleOpenChooseAcreageModal}
          >
            <TerrainIcon />
            <Typography component={'p'} sx={textStyle}>
              {handleShowAcreageFilter()}
            </Typography>
          </StyledButton>
          <Button
            sx={{ gap: 1, paddingX: 2, minWidth: 200 }}
            variant="contained"
            onClick={() => {
              handleSearch()
            }}
          >
            <Typography component={'p'} sx={textStyle}>
              {t('header.search')}
            </Typography>
            <SearchIcon />
          </Button>
        </Stack>
      </Container>
      <ChooseCategoryModal open={categoryModal} setOpen={setCategoryModal} />
      <ChooseAddressModal open={provinceModal} setOpen={setProvinceModal} />
      <ChoosePriceModal open={priceModal} setOpen={setPriceModal} />
      <ChooseAcreageModal open={acreageModal} setOpen={setAcreageModal} />
    </Box>
  )
}

export default HeaderSearch
