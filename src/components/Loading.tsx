import { Box, CircularProgress } from '@mui/material'
import Logo from './../assets/image/logo/BlackLogo.png'
const Loading = () => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      width={1}
      height={1}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <Box width={350} height={350}>
        <Box component={'img'} src={Logo} width={1} height={1} />
      </Box>
      <CircularProgress />
    </Box>
  )
}

export default Loading
