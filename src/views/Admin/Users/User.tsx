import { type GridRenderCellParams, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid'
import DataTable from '../../../components/DataTable'
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const Users = () => {
    const [roleSelect, setRoleSelect] = useState(-1)
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            width: 130
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 130,
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 130
        },
        {
            field: 'active',
            headerName: 'Active',
            type: 'number',
            width: 90,
            renderCell: (params: GridRenderCellParams) => {
                return <Checkbox
                    value={params.value}
                    checked={params.value}
                />
            }
        }
    ]

    const rows: User[] = [
        {
            id: '1',
            email: 'user1@example.com',
            avatar: 'avatar1.jpg',
            role: 'user',
            active: true,
            fullName: 'John Doe',
            phone: '123-456-7890'
        },
        {
            id: '2',
            email: 'user2@example.com',
            avatar: 'avatar2.jpg',
            role: 'admin',
            active: true,
            fullName: 'Jane Smith',
            phone: '987-654-3210'
        },
        {
            id: '3',
            email: 'user3@example.com',
            avatar: 'avatar3.jpg',
            role: 'user',
            active: true,
            fullName: 'Bob Johnson',
            phone: '555-123-4567'
        },
        {
            id: '4',
            email: 'user4@example.com',
            avatar: 'avatar4.jpg',
            role: 'user',
            active: false,
            fullName: 'Alice Brown',
            phone: '222-333-4444'
        },
        {
            id: '5',
            email: 'user5@example.com',
            avatar: 'avatar5.jpg',
            role: 'admin',
            active: true,
            fullName: 'Eva White',
            phone: '789-456-1230'
        },
        {
            id: '6',
            email: 'user6@example.com',
            avatar: 'avatar6.jpg',
            role: 'user',
            active: true,
            fullName: 'Michael Green',
            phone: '111-222-3333'
        },
        {
            id: '7',
            email: 'user7@example.com',
            avatar: 'avatar7.jpg',
            role: 'user',
            active: true,
            fullName: 'Sara Black',
            phone: '999-888-7777'
        },
        {
            id: '8',
            email: 'user8@example.com',
            avatar: 'avatar8.jpg',
            role: 'admin',
            active: false,
            fullName: 'David Taylor',
            phone: '444-555-6666'
        },
        {
            id: '9',
            email: 'user9@example.com',
            avatar: 'avatar9.jpg',
            role: 'user',
            active: true,
            fullName: 'Olivia Davis',
            phone: '666-777-8888'
        },
        {
            id: '10',
            email: 'user10@example.com',
            avatar: 'avatar10.jpg',
            role: 'user',
            active: true,
            fullName: 'Peter Wilson',
            phone: '123-987-6543'
        },
        {
            id: '11',
            email: 'user10@example.com',
            avatar: 'avatar10.jpg',
            role: 'user',
            active: true,
            fullName: 'Peter Wilson',
            phone: '123-987-6543'
        }
    ]

    return <Box width={'100%'}>
        <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant={'h3'} mb={2}>Danh sách người dùng</Typography>
            <Button variant='contained'>Tạo</Button>
        </Box>
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
