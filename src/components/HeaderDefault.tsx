import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TerrainIcon from '@mui/icons-material/Terrain'
import SearchIcon from '@mui/icons-material/Search'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import ChooseCategoryModal from './Modal/ChooseCategoryModal'
import { useState } from 'react'
import ChooseProvinceModal from './Modal/ChooseProvinceModal'
import ChoosePricemodal from './Modal/ChoosePriceModal'
import ChooseAcreageModal from './Modal/ChooseAcreageModal'
import { AppBar, Box, Typography, Toolbar, Button, Tabs, Tab, styled } from '@mui/material'
import { Header } from './Header'

const HeaderDefault = () => {
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
            backgroundColor: '#fff'
        }
    }))

    return <>
        <Header></Header>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} py={2} sx={{ backgroundColor: '#febb02' }}>
            <StyledButton sx={buttonStyle} variant='text' onClick={handleOpenChooseCategoryModal}>
                <HomeWorkIcon />
                <Typography component={'p'}>Chọn loại bất động sản</Typography>
            </StyledButton>
            <StyledButton sx={buttonStyle} variant='text' onClick={handleOpenChooseProvinceModal}>
                <LocationOnIcon />
                <Typography component={'p'}>Toàn quốc</Typography>
            </StyledButton>
            <StyledButton sx={buttonStyle} variant='text' onClick={handleOpenChoosePriceModal}>
                <AttachMoneyIcon />
                <Typography component={'p'}>Chọn giá</Typography>
            </StyledButton>
            <StyledButton sx={buttonStyle} variant='text' onClick={handleOpenChooseAcreageModal}>
                <TerrainIcon />
                <Typography component={'p'}>Chọn diện tích</Typography>
            </StyledButton>
            <Button sx={{ gap: 1, paddingX: 2, minWidth: 200 }} variant='contained'>
                <Typography component={'p'}>Tìm kiếm</Typography>
                <SearchIcon />
            </Button>
        </Box>
        <ChooseCategoryModal open={categoryModal} setOpen={setCategoryModal} />
        <ChooseProvinceModal open={provinceModal} setOpen={setProvinceModal} />
        <ChoosePricemodal open={priceModal} setOpen={setPriceModal} />
        <ChooseAcreageModal open={acreageModal} setOpen={setAcreageModal} />
    </>
}

export default HeaderDefault
