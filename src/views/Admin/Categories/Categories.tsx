import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  deleteCategory,
  getCategories,
} from '../../../app/slice/category.slice'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { type RootState } from '../../../app/store'
import AddIcon from '@mui/icons-material/Add'
import { Category } from '../../../model/category/category'
import UpdateCategory from './components/UpdateCategory'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import { toast } from 'react-toastify'

const Categories = () => {
  const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>()

  const categoryState = useAppSelector((state: RootState) => state.category)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  })
  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: t('admin.category.id'),
      flex: 1,
    },
    {
      field: 'name',
      headerName: t('admin.category.name'),
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('admin.category.action'),
      renderCell: params => {
        return (
          <Stack spacing={1} direction={'row'}>
            <Button
              variant="contained"
              onClick={() => {
                handleUpdate(params.row)
              }}
            >
              {t('admin.category.update')}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleOpenDelete(params.row)
              }}
            >
              {t('admin.category.delete')}
            </Button>
          </Stack>
        )
      },
      width: 230,
    },
  ]

  const handleUpdate = (category: Category) => {
    setSelectedCategory(category)
    setOpenUpdate(true)
  }

  const handleOpenDelete = (category: Category) => {
    setSelectedCategory(category)
    setOpenDelete(true)
  }

  const handleDeleteCategory = (category: Category) => {
    dispatch(deleteCategory(category))
      .unwrap()
      .then(() => {
        toast.success(t('admin.category.deleteSuccess'))
        setOpenDelete(false)
      })
  }

  useEffect(() => {
    if (!openUpdate && !openDelete) {
      return
    }

    if (!openUpdate) {
      const categoryPromise = dispatch(getCategories())

      return () => {
        categoryPromise.abort()
      }
    }
  }, [openUpdate])

  useEffect(() => {
    if (!openDelete) {
      const categoryPromise = dispatch(getCategories())

      return () => {
        categoryPromise.abort()
      }
    }
  }, [openDelete])

  return (
    <Grid item container xs={12} height={1}>
      <Grid
        item
        container
        justifyContent={'space-between'}
        xs={12}
        height={'10%'}
      >
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
      <Grid item xs={12} height={'90%'}>
        <Box height={1}>
          <DataGrid
            getRowId={x => x._id}
            rows={categoryState.category}
            paginationMode={'server'}
            rowCount={categoryState.totalCategories}
            columns={columns}
            loading={categoryState.loading}
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick={true}
            pageSizeOptions={[10]}
          />
        </Box>
      </Grid>
      <UpdateCategory
        category={selectedCategory}
        open={openUpdate}
        setOpen={setOpenUpdate}
      />
      <ConfirmDialog
        content={t('admin.category.areYouSureToDeleteThisCategory')}
        title={t('admin.category.deleteCategory')}
        open={openDelete}
        onConfirm={() => {
          handleDeleteCategory(selectedCategory as Category)
        }}
        onCancel={() => {
          setOpenDelete(false)
        }}
        isLoading={categoryState.loading}
      />
    </Grid>
  )
}

export default Categories
