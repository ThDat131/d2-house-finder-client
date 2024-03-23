import { Container } from '@mui/material'
import { Header } from '../Header'
import HeaderSearch from '../HeaderSearch'
import Footer from '../Footer'

interface Props {
  children: React.ReactNode
  haveSearch: boolean
}

export const UserLayout: React.FC<Props> = ({
  children,
  haveSearch,
}): JSX.Element => {
  return (
    <>
      <Header />
      {haveSearch && <HeaderSearch />}
      <Container sx={{ mt: 2, minHeight: '50vw' }}>{children}</Container>
      <Footer />
    </>
  )
}

export default UserLayout
