import { Container } from '@mui/material'
import { Header } from '../Header'

interface Props {
  children: React.ReactNode
}

export const UserLayout: React.FC<Props> = ({ children }): JSX.Element => {
  return (
    <>
      <Header />
      <Container sx={{ mt: 2 }}>{children}</Container>
    </>
  )
}

export default UserLayout
