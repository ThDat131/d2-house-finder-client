import { Box, List, ListItem, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { styled } from '@mui/system'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { RootState } from '../app/store'
import { setAcreageFilter } from '../app/slice/filter.slice'

const AcreageFilter = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const acreFilter = useAppSelector((root: RootState) => root.filter.acreage)
  const ListItemStyle: React.CSSProperties = {
    width: '50%',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  }

  const SelectedStyle = {
    fontWeight: 'bold',
  }

  const isSelected = (value: number[]) => {
    return value[0] === acreFilter[0] && value[1] === acreFilter[1]
  }

  const CustomListItem = styled(ListItem)({
    paddingLeft: 0,
  })

  const handleFilter = (value: number[]) => {
    dispatch(setAcreageFilter(value))
  }

  return (
    <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
      <Typography component={'h4'} fontSize={18} fontWeight={'bold'}>
        {t('acreageFilter.byAcreage')}
      </Typography>
      <List style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([0, 20]) ? handleFilter([0, 0]) : handleFilter([0, 20])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([0, 20]) ? SelectedStyle : null}>
            {t('acreageFilter.overAcreage', { acreage: 20 })} m<sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([20, 30]) ? handleFilter([0, 0]) : handleFilter([20, 30])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([20, 30]) ? SelectedStyle : null}>
            {t('acreageFilter.fromAcreageToAcreage', { from: 20, to: 30 })}m
            <sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([30, 50]) ? handleFilter([0, 0]) : handleFilter([30, 50])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([30, 50]) ? SelectedStyle : null}>
            {t('acreageFilter.fromAcreageToAcreage', { from: 30, to: 50 })}m
            <sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([50, 70]) ? handleFilter([0, 0]) : handleFilter([50, 70])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([50, 70]) ? SelectedStyle : null}>
            {t('acreageFilter.fromAcreageToAcreage', { from: 50, to: 70 })} m
            <sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([70, 90]) ? handleFilter([0, 0]) : handleFilter([70, 90])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([70, 90]) ? SelectedStyle : null}>
            {t('acreageFilter.fromAcreageToAcreage', { from: 70, to: 90 })} m
            <sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            isSelected([90, 0]) ? handleFilter([0, 0]) : handleFilter([90, 0])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([90, 0]) ? SelectedStyle : null}>
            {t('acreageFilter.overAcreage', { acreage: 90 })}m<sup>2</sup>
          </Typography>
        </CustomListItem>
      </List>
    </Box>
  )
}

export default AcreageFilter
