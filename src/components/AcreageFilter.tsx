import { Box, List, ListItem, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { styled } from '@mui/system'

const AcreageFilter = () => {
  const ListItemStyle: React.CSSProperties = {
    width: '50%',
    whiteSpace: 'nowrap',
  }

  const CustomListItem = styled(ListItem)({
    paddingLeft: 0,
  })

  return (
    <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
      <Typography component={'h4'} fontSize={18} fontWeight={'bold'}>
        Xem theo diện tích
      </Typography>
      <List style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CustomListItem style={ListItemStyle}>
          <KeyboardArrowRightIcon />
          <Typography>
            Dưới 20 m<sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem style={ListItemStyle}>
          <KeyboardArrowRightIcon />
          <Typography>
            Từ 20 - 30 m<sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem style={ListItemStyle}>
          <KeyboardArrowRightIcon />
          <Typography>
            Từ 30 - 50 m<sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem style={ListItemStyle}>
          <KeyboardArrowRightIcon />
          <Typography>
            Từ 50 - 70 m<sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem style={ListItemStyle}>
          <KeyboardArrowRightIcon />
          <Typography>
            Từ 70 - 90 m<sup>2</sup>
          </Typography>
        </CustomListItem>
        <CustomListItem style={ListItemStyle}>
          <KeyboardArrowRightIcon />
          <Typography>
            Trên 90 m<sup>2</sup>
          </Typography>
        </CustomListItem>
      </List>
    </Box>
  )
}

export default AcreageFilter
