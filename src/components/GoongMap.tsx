import React, { useEffect, useState } from 'react'
import ReactMapGL, { Marker } from '@goongmaps/goong-map-react'
import { type ViewPort } from '../model/utils/map'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { v4 as uuidv4 } from 'uuid'

interface GoongMapProps {
  data: ViewPort
  markers: any[] | undefined
  layer: boolean
}

const GoongMap: React.FC<GoongMapProps> = ({ data, markers, layer }) => {
  const MapAPIKey = import.meta.env.VITE_GOONG_MAPTILES_KEY
  const [viewPort, setViewPort] = useState({
    latitude: 10,
    longitude: 106,
    zoom: 0,
  })

  useEffect(() => {
    setViewPort(data)
  }, [data])

  return (
    <ReactMapGL
      {...viewPort}
      onViewportChange={(nextViewport: ViewPort) => {
        setViewPort(nextViewport)
      }}
      goongApiAccessToken={MapAPIKey}
    >
      {markers !== undefined && markers.length > 0
        ? markers.map((marker: any) => {
            return (
              <Marker
                key={uuidv4()}
                latitude={marker.latitude}
                longitude={marker.longitude}
              >
                <LocationOnIcon sx={{ color: '#ff0000', fontSize: 50 }} />
              </Marker>
            )
          })
        : ''}
    </ReactMapGL>
  )
}
export default GoongMap
