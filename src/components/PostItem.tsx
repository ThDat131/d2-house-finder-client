import { Box, Button, Grid, Stack, Typography } from '@mui/material'

const PostItem = () => {
    return <Grid container padding={2} sx={{ backgroundColor: '#fff9f3' }} borderRadius={2}>
        <Grid item xs={4}>
            <Box component={'img'} src='https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/07/05/img-2737_1688550736.jpg' width={1} height={1} borderRadius={2}></Box>
        </Grid>
        <Grid item xs={8} display={'flex'} flexWrap={'wrap'} pl={2} height={240}>
            <Stack maxHeight={60} overflow={'hidden'}>
                <Typography fontSize={20} textTransform={'uppercase'}>Phong tro chung cu abc</Typography>
            </Stack>
            <Stack direction={'row'} spacing={2} alignItems={'center'} mb={1}>
                <Typography fontSize={16} color={'green'}>1.7 Trieu / thang</Typography>
                <Typography>10 m<sup>2</sup></Typography>
                <Typography>Quan 7, Ho Chi Minh</Typography>
            </Stack>
            <Stack overflow={'hidden'} mb={1} height={60}>
                <Typography fontSize={14}>
                    Cần cho thuê phòng riêng chung cư Long Sơn Building , Huỳnh Tấn Phát ngay mặt tiền lớn thuận tiện đi lại , không ngập nước.- Phòng 10m2 có thông gió vách…
                </Typography>
            </Stack>

            <Box display={'flex'} justifyContent={'space-between'} width={1} >
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Box borderRadius={'50%'} component={'img'} width={35} height={35} src='https://phongtro123.com/images/default-user.png' />
                    <Typography>Le Tu</Typography>
                </Stack>
                <Button variant='contained'>Gọi 01234567899</Button>
            </Box>
        </Grid>
    </Grid>
}

export default PostItem
