import { type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid'
import DataTable from '../../../components/DataTable'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const Users = () => {
    const [roleSelect, setRoleSelect] = useState(-1)
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 90,
            flex: 1
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName} ${params.row.lastName}`,
        },
    ]

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ]
    return <Box width={'100%'}>
        <Typography variant={'h3'} mb={2}>Danh sách người dùng</Typography>
        <Box display={'flex'} gap={1} paddingY={1}>
            <FormControl>
                <InputLabel id="user-role">Vai Trò</InputLabel>
                <Select
                    labelId="user-role"
                    id="demo-simple-select"
                    value={roleSelect}
                    label="Vai trò"
                    onChange={(evt) => { setRoleSelect(evt.target.value as number) }}
                >
                    <MenuItem value={2}>Admin</MenuItem>
                    <MenuItem value={1}>Chủ trọ</MenuItem>
                    <MenuItem value={0}>Người thuê trọ</MenuItem>
                    <MenuItem value={-1}>Tất cả</MenuItem>
                </Select>
            </FormControl>
            <TextField variant='outlined' label='Tìm kiếm' sx={{ flex: 1 }} />
        </Box>
        <DataTable columns={columns} data={rows} />
    </Box>
}

export default Users
