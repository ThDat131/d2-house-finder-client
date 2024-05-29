import { useEffect, useState } from 'react'
import { type ViewPort } from '../../model/utils/map'
import GoongMap from '../../components/GoongMap'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import {
  Autocomplete,
  Box,
  Grid,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import parse from 'autosuggest-highlight/parse'
import UserLayout from '../../components/Layout/UserLayout'
import { CommonResponse } from '../../model/common/common-response'
import { Article } from '../../model/article/article'
import { FlyToInterpolator } from '@goongmaps/goong-map-react'
import { useTranslation } from 'react-i18next'

interface MainTextMatchedSubstrings {
  offset: number
  length: number
}

interface StructuredFormatting {
  main_text: string
  secondary_text: string
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[]
}

interface PlaceType {
  description: string
  structured_formatting: StructuredFormatting
  place_id: string
}

const FindHouseWithLocation = () => {
  const { t } = useTranslation()
  const { httpGoongService, httpService } = new HttpService()
  const [search, setSearch] = useState<string>('')
  const [addresses, setAddresses] = useState<any[]>([])
  const [value, setValue] = useState<PlaceType | null>(null)
  const [viewportData, setViewportData] = useState<ViewPort>({
    width: '100%',
    height: '100%',
    latitude: 10.8231,
    longitude: 106.6297,
    zoom: 11,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  })
  const [markers, setMarkers] = useState<Article[]>([])
  const [radius, setRadius] = useState<number>(0)

  const handleSearch = () => {
    httpGoongService
      .get(ApiPathEnum.AutoComplete, {
        params: {
          api_key: import.meta.env.VITE_GOONG_API_KEY,
          input: search,
        },
      })
      .then(res => {
        if (res.status === 200 && res.data.status !== 'NOT_FOUND') {
          setAddresses(res.data.predictions)
        }
      })
  }

  const handleUpdateViewport = async (placeId: string) => {
    const getPlaceDetail = await httpGoongService.get(ApiPathEnum.Detail, {
      params: {
        api_key: import.meta.env.VITE_GOONG_API_KEY,
        place_id: placeId,
      },
    })

    if (getPlaceDetail.status === 200) {
      const lng = getPlaceDetail.data.result.geometry.location.lng
      const lat = getPlaceDetail.data.result.geometry.location.lat
      setViewportData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        zoom: 13,
      }))

      const getArticlesNearBy = await httpService.get<
        CommonResponse<Article[]>
      >(`${ApiPathEnum.Article}/maps/search-by-location`, {
        params: {
          longitude: Number.parseFloat(lng).toFixed(4),
          latitude: Number.parseFloat(lat).toFixed(4),
        },
      })

      if (getArticlesNearBy.status === 200) {
        setMarkers(getArticlesNearBy.data.data)
      }
    }
  }

  const handleChange = (event: any, newValue: PlaceType | null) => {
    setRadius(3000)
    setAddresses(newValue ? [newValue, ...addresses] : addresses)
    setValue(newValue)
    handleUpdateViewport(newValue?.place_id ?? '')
  }

  useEffect(() => {
    const debounce = setTimeout(handleSearch, 500)

    return () => {
      clearTimeout(debounce)
    }
  }, [search])

  return (
    <UserLayout fluid={true} haveSearch={false}>
      <Box position={'relative'} height={1} overflow={'hidden'}>
        <Box
          position={'absolute'}
          zIndex={1}
          mt={1}
          mr={1}
          top={0}
          right={0}
          sx={{ backgroundColor: '#fff' }}
          minWidth={'500px'}
        >
          <Paper>
            <Autocomplete
              PopperComponent={({ style, ...props }) => (
                <Popper {...props} style={{ ...style, height: 0 }} />
              )}
              options={addresses}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value}
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    label={t('findHouseWithLocation.enterYourLocation')}
                    fullWidth
                    variant="filled"
                  />
                )
              }}
              onInputChange={(event, value) => {
                setSearch(value)
              }}
              getOptionLabel={option =>
                typeof option === 'string' ? option : option.description
              }
              filterOptions={x => x}
              noOptionsText="No locations"
              onChange={handleChange}
              renderOption={(props, option) => {
                const matches =
                  option.structured_formatting.main_text_matched_substrings ||
                  []

                const parts = parse(
                  option.structured_formatting.main_text,
                  matches.map((match: any) => [
                    match.offset,
                    match.offset + match.length,
                  ]),
                )

                return (
                  <li {...props}>
                    <Grid container alignItems="center">
                      <Grid item sx={{ display: 'flex', width: 44 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary' }} />
                      </Grid>
                      <Grid
                        item
                        sx={{
                          width: 'calc(100% - 44px)',
                          wordWrap: 'break-word',
                        }}
                      >
                        {parts.map((part: any, index: number) => (
                          <Box
                            key={index}
                            component="span"
                            sx={{
                              fontWeight: part.highlight ? 'bold' : 'regular',
                            }}
                          >
                            {part.text}
                          </Box>
                        ))}
                        <Typography variant="body2" color="text.secondary">
                          {option.structured_formatting.secondary_text}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                )
              }}
            />
          </Paper>
        </Box>
        <Box height={1}>
          <GoongMap
            data={viewportData}
            layer={true}
            markers={markers}
            lock={true}
            showPopup={true}
            radiusMeters={radius}
          />
        </Box>
      </Box>
    </UserLayout>
  )
}

export default FindHouseWithLocation
