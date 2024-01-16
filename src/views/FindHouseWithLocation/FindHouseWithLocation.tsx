import { useState } from 'react';
import { type ViewPort } from '../../model/map';
import { FlyToInterpolator } from '@goongmaps/goong-map-react';
import GoongMap from '../../components/GoongMap';
import { Box, Paper, TextField } from '@mui/material';
import { Header } from '../../components/Header';

const FindHouseWithLocation = () => {
    const [viewportData, setViewPortData] = useState<ViewPort>({
        width: '100%',
        height: '100%',
        latitude: 10.8231,
        longitude: 106.6297,
        zoom: 11,
        maxZoom: 11,
        minZoom: 11,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
    });
    const [markers, setMarkers] = useState<any[]>();


    return <>
        <Header />
        <Box width={1} height={'100vh'} position={'relative'}>

            <Box position={'absolute'} zIndex={1} mt={1} mr={1} top={0} right={0} sx={{ backgroundColor: '#fff' }} minWidth={'500px'} >
                <Paper >
                    <TextField label="Nhập địa điểm" variant="filled" sx={{ width: 1 }} />
                </Paper>
            </Box>
            <GoongMap data={viewportData} setData={setViewPortData} layer={false} markers={markers} />;

        </Box>;
    </>;
};

export default FindHouseWithLocation;