import React, { useEffect, useState } from 'react'
import ReactMapGL, {
  Layer,
  Marker,
  Popup,
  Source,
} from '@goongmaps/goong-map-react'
import { type ViewPort } from '../model/utils/map'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Article } from '../model/article/article'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface GoongMapProps {
  data: ViewPort
  markers: Article[] | undefined
  layer: boolean
  lock?: boolean
  showPopup?: boolean
}

const GoongMap: React.FC<GoongMapProps> = ({
  data,
  markers,
  layer,
  lock,
  showPopup,
}) => {
  const { t } = useTranslation()
  const MapAPIKey = import.meta.env.VITE_GOONG_MAPTILES_KEY
  const [viewPort, setViewPort] = useState<ViewPort>({
    latitude: 0,
    longitude: 0,
    zoom: 0,
    maxZoom: 16,
    minZoom: 16,
  })
  const [popups, setPopups] = useState<Article[]>([])

  const generatePolygon = (): number[][] => {
    const radiusMeters = 3000

    const radiusDegreesLatitude = radiusMeters / 111320
    const radiusDegreesLongitude =
      radiusMeters / (111320 * Math.cos((viewPort.latitude * Math.PI) / 180))

    const circleCoordinates = []

    for (let i = 0; i <= 360; i += 10) {
      const angle = (i * Math.PI) / 180
      const latitude =
        viewPort.latitude + radiusDegreesLatitude * Math.sin(angle)
      const longitude =
        viewPort.longitude + radiusDegreesLongitude * Math.cos(angle)

      circleCoordinates.push([longitude, latitude])
    }

    return circleCoordinates
  }

  const geojsonPolygon: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [generatePolygon()],
        },
        properties: ['polygon'],
      },
    ],
  }

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
      dragPan={!lock}
      scrollZoom={!lock}
    >
      {markers !== undefined &&
        markers.length > 0 &&
        markers.map(marker => {
          return (
            <Marker
              key={marker._id}
              latitude={marker.location.coordinates[1]}
              longitude={marker.location.coordinates[0]}
            >
              <LocationOnIcon
                sx={{ color: '#ff0000', fontSize: 50 }}
                onClick={() => {
                  setPopups(prev => [...prev, marker])
                }}
              />
            </Marker>
          )
        })}
      {showPopup &&
        popups &&
        popups.length > 0 &&
        popups.map(x => {
          return (
            <Popup
              key={x._id}
              latitude={x.location.coordinates[1]}
              longitude={x.location.coordinates[0]}
              onClose={() => {
                setPopups(popups.filter(pop => x._id !== pop._id))
              }}
            >
              <Card sx={{ maxWidth: 280 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={x.images[0]}
                  title={x.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {x.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    size="small"
                    href={`/bai-dang/${x._id}`}
                  >
                    {t('goongMap.watchNow')}
                  </Button>
                </CardActions>
              </Card>
            </Popup>
          )
        })}
      {layer && (
        <Source type="geojson" data={geojsonPolygon} id="polygon">
          <Layer
            id="polygon"
            type="line"
            paint={{
              'line-color': '#FF0000',
            }}
          />
        </Source>
      )}
    </ReactMapGL>
  )
}
export default GoongMap
