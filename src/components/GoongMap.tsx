import React from 'react'
import { type SetStateAction, useState } from 'react'
import ReactMapGL, { Marker } from '@goongmaps/goong-map-react'
import { type ViewPort } from '../model/map'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface GoongMapProps {
    data: ViewPort
    setData: React.Dispatch<React.SetStateAction<ViewPort>>
    markers: any[] | undefined
    layer: boolean
}

const GoongMap: React.FC<GoongMapProps> = ({ data, setData, markers, layer }) => {
    const MapAPIKey = import.meta.env.VITE_GOONG_MAPTILES_KEY

    return <ReactMapGL
        {...data}
        onViewportChange={(nextViewport: ViewPort) => { setData(nextViewport) }}
        goongApiAccessToken={MapAPIKey}
    >
        {(markers !== undefined) && markers.length > 0
            ? markers.map((marker: any, index: number) => {
                return (
                    <Marker key={index} latitude={marker.latitude} longitude={marker.longitude}>
                        <LocationOnIcon />
                    </Marker>
                )
            })
            : ''}
    </ReactMapGL>
}
export default GoongMap
