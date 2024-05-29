import { Box, List, ListItem, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { styled } from '@mui/system'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setPriceFilter } from '../app/slice/filter.slice'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { RootState } from '../app/store'

const PriceFilter = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const priceFilter = useAppSelector((root: RootState) => root.filter.price)
  const ListItemStyle: React.CSSProperties = {
    width: '50%',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  }

  const SelectedStyle = {
    fontWeight: 'bold',
  }

  const CustomListItem = styled(ListItem)({
    paddingLeft: 0,
  })

  const isSelected = (value: number[]) => {
    return value[0] === priceFilter[0] && value[1] === priceFilter[1]
  }

  const handleFilter = (value: number[]) => {
    dispatch(setPriceFilter(value))
  }

  return (
    <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
      <Typography component={'h4'} fontSize={18} fontWeight={'bold'}>
        {t('priceFilter.byPrice')}
      </Typography>
      <List style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([0, 1]) ? handleFilter([0, 0]) : handleFilter([0, 1])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([0, 1]) ? SelectedStyle : null}>
            {t('priceFilter.underMillion', { price: 1 })}
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([1, 2]) ? handleFilter([0, 0]) : handleFilter([1, 2])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([1, 2]) ? SelectedStyle : null}>
            {t('priceFilter.fromPriceToPrice', { fromPrice: 1, toPrice: 2 })}
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([2, 3]) ? handleFilter([0, 0]) : handleFilter([2, 3])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([2, 3]) ? SelectedStyle : null}>
            {t('priceFilter.fromPriceToPrice', { fromPrice: 2, toPrice: 3 })}
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([3, 5]) ? handleFilter([0, 0]) : handleFilter([3, 5])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([3, 5]) ? SelectedStyle : null}>
            {t('priceFilter.fromPriceToPrice', { fromPrice: 3, toPrice: 5 })}
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([5, 7]) ? handleFilter([0, 0]) : handleFilter([5, 7])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([5, 7]) ? SelectedStyle : null}>
            {t('priceFilter.fromPriceToPrice', { fromPrice: 5, toPrice: 7 })}
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([7, 10]) ? handleFilter([0, 0]) : handleFilter([7, 10])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([7, 10]) ? SelectedStyle : null}>
            {t('priceFilter.fromPriceToPrice', { fromPrice: 7, toPrice: 10 })}
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([10, 15]) ? handleFilter([0, 0]) : handleFilter([10, 15])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([10, 15]) ? SelectedStyle : null}>
            {t('priceFilter.fromPriceToPrice', { fromPrice: 10, toPrice: 15 })}
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([15, 0]) ? handleFilter([0, 0]) : handleFilter([15, 0])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([15, 0]) ? SelectedStyle : null}>
            {t('priceFilter.overMillion', { price: 15 })}
          </Typography>
        </CustomListItem>
      </List>
    </Box>
  )
}

export default PriceFilter
