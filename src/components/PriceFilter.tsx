import { Box, List, ListItem, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { styled } from '@mui/system'

const PriceFilter = () => {
    const ListItemStyle: React.CSSProperties = {
        width: '50%',
        whiteSpace: 'nowrap',
    }

    const CustomListItem = styled(ListItem)({
        paddingLeft: 0,
    })

    return <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
        <Typography component={'h4'} fontSize={18} fontWeight={'bold'}>Xem theo giá</Typography>
        <List style={{ display: 'flex', flexWrap: 'wrap' }}>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Dưới 1 triệu</Typography>
            </CustomListItem>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Từ 1 - 2 triệu</Typography>
            </CustomListItem>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Từ 2 - 3 triệu</Typography>
            </CustomListItem>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Từ 3 - 5 triệu</Typography>
            </CustomListItem>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Từ 5 - 7 triệu</Typography>
            </CustomListItem>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Từ 7 - 10 triệu</Typography>
            </CustomListItem>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Từ 10 - 15 triệu</Typography>
            </CustomListItem>
            <CustomListItem style={ListItemStyle}>
                <KeyboardArrowRightIcon />
                <Typography>Trên 15 triệu</Typography>
            </CustomListItem>
        </List>
    </Box>
}

export default PriceFilter
