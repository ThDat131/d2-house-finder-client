import { Box, CircularProgress } from '@mui/material'

const Loading = () => {
    return <Box display={'flex'} justifyContent={'center'} width={1} height={1}>
        <CircularProgress />
    </Box>
}

export default Loading