import { Box, Container, Divider, Typography } from '@mui/material'

const Footer = (): JSX.Element => {
  const currYear: number = new Date().getFullYear()

  return (
    <Box bgcolor={'primary.main'} color={'primary.contrastText'} mt={2}>
      <Container sx={{ paddingY: 2 }}>
        <Box textAlign={'center'}>
          <Typography>Copyright &copy; {currYear} Nhà trọ D2</Typography>
        </Box>
      </Container>
      <Divider />
      <Container>
        <Box textAlign={'center'} sx={{ paddingY: 2 }}>
          <Typography>
            Cơ quan chủ quản: Công ty TNHH Nhà trọ D2. Trụ sở: 371 Nguyễn Kiệm,
            Gò Vấp, TP. Hồ Chí Minh
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
export default Footer
