import { Box, List, ListItem, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { styled } from '@mui/system'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { RootState } from '../app/store'
import { setAcreageFilter, setPriceFilter } from '../app/slice/filter.slice'
import { getArticle, getArticles } from '../app/slice/article.slice.'

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
    dispatch(setPriceFilter([0, 0]))
    dispatch(
      getArticles({
        acreage: [value[0], value[1]],
        current: 1,
      }),
    )
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
            handleFilter([0, 19])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([0, 19]) ? SelectedStyle : null}>
            {t('acreageFilter.underAcreage', { acreage: 20 })} m<sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem
          style={ListItemStyle}
          onClick={() => {
            handleFilter([20, 30])
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
            handleFilter([30, 50])
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
            handleFilter([50, 70])
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
            handleFilter([70, 90])
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
            handleFilter([91, 0])
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography sx={isSelected([91, 0]) ? SelectedStyle : null}>
            {t('acreageFilter.overAcreage', { acreage: 90 })}m<sup>2</sup>
          </Typography>
        </CustomListItem>
      </List>
    </Box>
  )
}

export default AcreageFilter
