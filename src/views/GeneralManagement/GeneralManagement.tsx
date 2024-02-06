import { Grid } from '@mui/material'
import { Header } from '../../components/Header'
import UserSideNavbar from '../../components/NavBar/UserSideNavbar'

const GeneralManagement = (): JSX.Element => {
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={2}>
          <UserSideNavbar />
        </Grid>
        <Grid item xs={10}></Grid>
      </Grid>
    </>
  )
}

export default GeneralManagement
