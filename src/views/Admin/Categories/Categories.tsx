import { Box, Button, Grid, Typography } from '@mui/material'
import DataTable from '../../../components/DataTable'
import { useTranslation } from 'react-i18next'
import { type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { getCategories } from './category.slice'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { type RootState } from '../../../app/store'
import AddIcon from '@mui/icons-material/Add'

const Categories = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const categories = useAppSelector(
    (state: RootState) => state.category.category,
  )

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('admin.category.id'),
      width: 70,
    },
    {
      field: 'name',
      headerName: t('admin.category.name'),
      width: 130,
    },
  ]

  useEffect(() => {
    const categoryPromise = dispatch(getCategories())

    return () => {
      categoryPromise.abort()
    }
  }, [])

  return (
    <Box width={'100%'}>
      <Grid container spacing={2} justifyContent={'space-between'}>
        <Grid item>
          <Typography variant={'h3'} mb={2}>
            {t('admin.category.listOfCategory')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate(`${location.pathname}/create`)
            }}
            startIcon={<AddIcon />}
          >
            {t('admin.category.create')}
          </Button>
        </Grid>
      </Grid>
      <DataTable columns={columns} data={categories} />
    </Box>
  )
}

export default Categories
