import { useEffect, useRef } from 'react'
import { getCategories } from '../app/slice/category.slice'
import { getAllProvinces } from '../app/slice/address.slice'
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import PostItem from './PostItem'
import PriceFilter from './PriceFilter'
import AcreageFilter from './AcreageFilter'
import HeaderDefault from './HeaderDefault'
import { useAppDispatch } from '../app/hooks'
import { getCurrentUserFromCookie } from '../app/slice/auth.slice'

export const Main = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const currentUserRef = useRef(false)

    useEffect(() => {
        const promise = dispatch(getCategories())
        const provincePromise = dispatch(getAllProvinces())
        if (!currentUserRef.current) {
            dispatch(getCurrentUserFromCookie())
        }

        return () => {
            promise.abort()
            provincePromise.abort()
            currentUserRef.current = true
        }
    }, [dispatch])

    return <>
        <HeaderDefault />
        <Container sx={{ mt: 2 }}>
            <Grid container spacing={2} maxWidth={'100vw'} justifyContent={'space-between'} >
                <Grid item xs={8}>
                    <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
                        <Typography>Tổng 117.995 kết quả</Typography>
                        <Box display={'flex'} alignItems={'center'} gap={1}>
                            <Typography>Sắp xếp:</Typography>
                            <Stack direction={'row'}>
                                <Button>Mặc định</Button>
                                <Button>Mới nhất</Button>
                            </Stack>
                        </Box>
                        <Stack spacing={1}>
                            <PostItem />
                            <PostItem />
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Stack spacing={2}>
                        <PriceFilter />
                        <AcreageFilter />
                    </Stack>
                </Grid>
            </Grid>
        </Container>

    </>
}

export default Main
