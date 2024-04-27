import React from 'react'
import { Grid, Box, Stack, Skeleton } from '@mui/material'

const PostItemSkeleton = () => {
  return (
    <Grid
      container
      padding={2}
      sx={{ backgroundColor: '#fff' }}
      borderRadius={2}
      boxShadow={3}
    >
      <Grid item xs={5}>
        <Box height={240}>
          <Skeleton variant="rectangular" width="100%" height={240} />
        </Box>
      </Grid>
      <Grid item xs={7} display={'flex'} flexWrap={'wrap'} pl={2} height={240}>
        <Stack maxHeight={50} overflow={'hidden'} width={1}>
          <Skeleton variant="text" width={'100%'} />
        </Stack>
        <Stack
          direction={'row'}
          spacing={2}
          alignItems={'center'}
          mb={1}
          width={1}
        >
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={80} />
        </Stack>
        <Stack overflow={'hidden'} mb={1} width={1}>
          <Skeleton variant="text" width="100%" />
        </Stack>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          width={1}
          mb={1}
        >
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Skeleton variant="circular" width={35} height={35} />
            <Skeleton variant="text" width={100} />
          </Stack>
          <Box display={'flex'} alignItems={'center'}>
            <Skeleton variant="text" width={100} />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default PostItemSkeleton
