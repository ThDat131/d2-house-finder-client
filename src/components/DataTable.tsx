import React from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

interface DataTableProps {
  columns: GridColDef[]
  data: any
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={row => row._id}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      checkboxSelection
      disableRowSelectionOnClick
      autoHeight={true}
    />
  )
}

export default DataTable
