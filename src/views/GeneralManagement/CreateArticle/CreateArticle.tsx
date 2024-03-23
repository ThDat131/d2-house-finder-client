import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState } from 'draft-js'
import { useTranslation } from 'react-i18next'
import { type ArticleCreatedModel } from '../../../model/article/article-create'
import * as Yup from 'yup'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { type RootState } from '../../../app/store'
import { type District } from '../../../model/address/district'
import { type Ward } from '../../../model/address/ward'
import { useEffect, useState } from 'react'
import {
  getAllProvinces,
  selectProvince,
} from '../../../app/slice/province.slice'
import { getAllWards, selectWard } from '../../../app/slice/ward.slice'
import { type Province } from '../../../model/address/province'
import {
  getAllDistricts,
  selectDistrict,
} from '../../../app/slice/district.slice'
import Loading from '../../../components/Loading'
import { getCategories } from '../../../app/slice/category.slice'
import DeleteIcon from '@mui/icons-material/Delete'
import { HttpService } from '../../../api/HttpService'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import { type CommonResponse } from '../../../model/common/common-response'
import { LoadingButton } from '@mui/lab'
import GoongMap from '../../../components/GoongMap'
import { FlyToInterpolator } from '@goongmaps/goong-map-react'
import { createArticle } from '../../../app/slice/article.slice.'
import { toast } from 'react-toastify'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { useNavigate } from 'react-router-dom'

interface ImageType {
  blob: string
  url: string
}

const CreateArticle = () => {
  const { authHttpService, httpGoongService } = new HttpService()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const provinces = useAppSelector((state: RootState) => state.provinces.data)
  const categories = useAppSelector(
    (state: RootState) => state.category.category,
  )
  const provinceLoading = useAppSelector(
    (state: RootState) => state.provinces.loading,
  )
  const districtLoading = useAppSelector(
    (state: RootState) => state.districts.loading,
  )
  const wardLoading = useAppSelector((state: RootState) => state.wards.loading)
  const error = useAppSelector((state: RootState) => state.article.error)

  // const filesRef = useRef<string[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [exactAddress, setExactAddress] = useState<string>('')
  const [description, setDescription] = useState<any>(EditorState.createEmpty())
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<ImageType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [viewportData, setViewPortData] = useState({
    width: '100%',
    height: 400,
    latitude: 16.5552212,
    longitude: 105.2351686,
    zoom: 4,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  })

  useEffect(() => {
    if (provinces?.length > 0 && categories?.length > 0) return
    const provincePromise = dispatch(getAllProvinces())
    const categoryPromise = dispatch(getCategories())
    return () => {
      provincePromise.abort()
      categoryPromise.abort()
    }
  }, [])

  const handleMoveMap = (address: string, type: string) => {
    let zoom: number

    if (type === 'province') {
      zoom = 8
    } else if (type === 'district') {
      zoom = 12
    } else if (type === 'ward') {
      zoom = 14
    } else {
      zoom = 16
    }

    httpGoongService
      .get(ApiPathEnum.Geocode, {
        params: {
          address,
          api_key: import.meta.env.VITE_GOONG_API_KEY,
        },
      })
      .then(res => {
        setViewPortData(prev => ({
          ...prev,
          zoom,
          latitude: res.data.results[0].geometry.location.lat,
          longitude: res.data.results[0].geometry.location.lng,
        }))
        formik.setFieldValue(
          'latitude',
          res.data.results[0].geometry.location.lat,
        )
        formik.setFieldValue(
          'longitude',
          res.data.results[0].geometry.location.lng,
        )
      })
  }

  const handleChangeProvince = (province: Province) => {
    dispatch(selectProvince(province))

    dispatch(getAllDistricts(province.province_id)).then(response => {
      setDistricts(response.payload.results)
    })

    formik.setFieldValue('provinceName', province.province_name)

    setWards([])
    setExactAddress(province.province_name)
    handleMoveMap(province.province_name, 'province')
  }

  const handleChangeDistrict = (district: District) => {
    dispatch(selectDistrict(district))

    dispatch(getAllWards(district.district_id)).then(response => {
      setWards(response.payload.results)
    })

    formik.setFieldValue('districtName', district.district_name)

    const address = `${formik.values.provinceName}, ${district.district_name}`
    setExactAddress(address)
    handleMoveMap(address, 'district')
  }

  const handleChangeWard = (ward: Ward) => {
    dispatch(selectWard(ward))

    formik.setFieldValue('wardName', ward.ward_name)

    const address = `${formik.values.provinceName}, ${formik.values.districtName}, ${ward.ward_name}`
    setExactAddress(address)
    handleMoveMap(address, 'wards')
  }

  const handleChangeFiles = (evt: any) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        const blobUrl = URL.createObjectURL(file)
        setImageUrls(prev => [...prev, blobUrl])

        const formData = new FormData()
        formData.append('file', file)

        authHttpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              setUploadedImages(prevImages => [
                ...prevImages,
                {
                  blob: blobUrl,
                  url: res.data.data.path,
                },
              ])
            }
          })
      }
    }
  }

  const handleDeleteFile = (index: number) => {
    const updatedImageUrls = [...imageUrls]
    // const imagesUpload = [...formik.values.images]

    setUploadedImages(() =>
      uploadedImages.filter(item => item.blob !== updatedImageUrls[index]),
    )

    updatedImageUrls.splice(index, 1)
    // imagesUpload.splice(index, 1)

    setImageUrls(updatedImageUrls)

    // formik.setFieldValue('images', [imagesUpload])
  }

  const initialValues: ArticleCreatedModel = {
    title: '',
    description: '',
    categoryId: '',
    price: 0,
    acreage: 0,
    streetAddress: '',
    latitude: 0,
    longitude: 0,
    provinceCode: 0,
    districtCode: 0,
    wardCode: 0,
    provinceName: '',
    districtName: '',
    wardName: '',
    images: [],
    quantity: 0,
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(
      t('generalManagement.createNewArticle.noEnteredTitle'),
    ),
    description: Yup.string().required(
      t('generalManagement.createNewArticle.noEnteredDescription'),
    ),
    categoryId: Yup.string().required(
      t('generalManagement.createNewArticle.noCategorySelected'),
    ),
    price: Yup.string().required(
      t('generalManagement.createNewArticle.noEnteredPrice'),
    ),
    acreage: Yup.string().required(
      t('generalManagement.createNewArticle.noEnteredAcreage'),
    ),
    streetAddress: Yup.string().required(
      t('generalManagement.createNewArticle.noEnteredStreetAndHouseNumber'),
    ),
    provinceCode: Yup.string().required(
      t('generalManagement.createNewArticle.noProvinceSelected'),
    ),
    districtCode: Yup.string().required(
      t('generalManagement.createNewArticle.noDistrictSelected'),
    ),
    wardCode: Yup.string().required(
      t('generalManagement.createNewArticle.noWardSelected'),
    ),
    quantity: Yup.string().required(
      t('generalManagement.createNewArticle.noEnteredQuantity'),
    ),
  })

  const onSubmit = () => {
    dispatch(createArticle(formik.values))
      .unwrap()
      .then(() => {
        toast.success(t('generalManagement.createNewArticle.createSuccess'))
        navigate('/')
      })
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  const getExactAddress = (): string => {
    if (
      formik.values.provinceName &&
      formik.values.districtName &&
      formik.values.wardName &&
      formik.values.streetAddress
    )
      return `${formik.values.streetAddress}, ${formik.values.wardName}, ${formik.values.districtName}, ${formik.values.provinceName}`
    if (
      formik.values.provinceName &&
      formik.values.districtName &&
      formik.values.wardName
    )
      return `${formik.values.streetAddress}, ${formik.values.wardName}, ${formik.values.districtName}`
    if (formik.values.provinceName && formik.values.districtName)
      return `${formik.values.districtName}, ${formik.values.provinceName}`
    if (formik.values.provinceName) return formik.values.provinceName
    return ''
  }

  if (provinceLoading) {
    return <Loading />
  }

  return (
    <>
      <Box borderBottom={1} mb={4}>
        <Typography variant={'h3'} mb={2}>
          {t('generalManagement.createNewArticle.postArticle')}
        </Typography>
      </Box>
      <form
        onSubmit={evt => {
          evt.preventDefault()

          const imagesArr = uploadedImages.map(i => i.url)
          const payload = { ...formik.values, images: imagesArr }

          formik.setValues(payload)
          formik.handleSubmit()
        }}
      >
        <Grid container spacing={2}>
          <Grid container item xs={8}>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('generalManagement.createNewArticle.addressForRent')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Stack>
                    <Typography noWrap>
                      {t('generalManagement.createNewArticle.province')}
                    </Typography>
                    <FormControl
                      error={
                        error !== '' ||
                        (formik.touched.provinceCode &&
                          Boolean(formik.errors.provinceCode))
                      }
                    >
                      <Select
                        id="provinceCode"
                        name="provinceCode"
                        value={formik.values.provinceCode}
                        onChange={formik.handleChange}
                        size="small"
                      >
                        {provinces.length > 0 &&
                          provinces.map(p => (
                            <MenuItem
                              key={p.province_id}
                              value={p.province_id}
                              onClick={() => {
                                handleChangeProvince(p)
                              }}
                            >
                              {p.province_name}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        {formik.touched.provinceCode &&
                          formik.errors.provinceCode}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={3}>
                  <Stack>
                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                      <Typography noWrap>
                        {t('generalManagement.createNewArticle.district')}
                      </Typography>
                      {districtLoading && <CircularProgress size={20} />}
                    </Stack>
                    <FormControl
                      error={
                        error !== '' ||
                        (formik.touched.districtCode &&
                          Boolean(formik.errors.districtCode))
                      }
                    >
                      <Select
                        id="districtCode"
                        name="districtCode"
                        value={formik.values.districtCode}
                        onChange={formik.handleChange}
                        size="small"
                      >
                        {districts.length > 0 &&
                          districts.map(d => (
                            <MenuItem
                              key={d.district_id}
                              value={d.district_id}
                              onClick={() => {
                                handleChangeDistrict(d)
                              }}
                            >
                              {d.district_name}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        {formik.touched.districtCode &&
                          formik.errors.districtCode}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={3}>
                  <Stack>
                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                      <Typography noWrap>
                        {t('generalManagement.createNewArticle.ward')}
                      </Typography>
                      {wardLoading && <CircularProgress size={20} />}
                    </Stack>
                    <Select
                      id="wardCode"
                      name="wardCode"
                      value={formik.values.wardCode}
                      onChange={formik.handleChange}
                      size="small"
                    >
                      {wards.length > 0 &&
                        wards.map(w => (
                          <MenuItem
                            key={w.ward_id}
                            value={w.ward_id}
                            onClick={() => {
                              handleChangeWard(w)
                            }}
                          >
                            {w.ward_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={3}>
                  <Stack>
                    <Typography noWrap>
                      {t(
                        'generalManagement.createNewArticle.streetAndHouseNumber',
                      )}
                    </Typography>
                    <TextField
                      id="streetAddress"
                      name="streetAddress"
                      value={formik.values.streetAddress}
                      onChange={formik.handleChange}
                      onBlur={() => {
                        const address = getExactAddress()
                        setExactAddress(address)
                        handleMoveMap(address, 'street')
                      }}
                      error={
                        error !== '' ||
                        (formik.touched.streetAddress &&
                          Boolean(formik.errors.streetAddress))
                      }
                      helperText={
                        formik.touched.streetAddress &&
                        formik.errors.streetAddress
                      }
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Typography>
                      {t('generalManagement.createNewArticle.address')}
                    </Typography>
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      value={exactAddress}
                      size="small"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('generalManagement.createNewArticle.description')}
              </Typography>
              <Grid container>
                <Grid item mb={2}>
                  <Stack>
                    <Typography>
                      {t('generalManagement.createNewArticle.category')}
                    </Typography>
                    <FormControl
                      error={
                        formik.touched.categoryId &&
                        Boolean(formik.errors.categoryId)
                      }
                    >
                      <Select
                        id="categoryId"
                        name="categoryId"
                        value={formik.values.categoryId}
                        onChange={formik.handleChange}
                        size="small"
                        sx={{ minWidth: 200 }}
                      >
                        {categories.length > 0 &&
                          categories.map(c => (
                            <MenuItem key={c.name} value={c._id}>
                              {c.name}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        {formik.touched.categoryId && formik.errors.categoryId}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography>
                      {t('generalManagement.createNewArticle.title')}
                    </Typography>
                    <TextField
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={
                        error !== '' ||
                        (formik.touched.title && Boolean(formik.errors.title))
                      }
                      helperText={formik.touched.title && formik.errors.title}
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography>
                      {t('generalManagement.createNewArticle.content')}
                    </Typography>
                    <Editor
                      editorState={description}
                      onEditorStateChange={editorState => {
                        setDescription(editorState)
                      }}
                      onBlur={() => {
                        formik.setFieldValue(
                          'description',
                          draftToHtml(
                            convertToRaw(description.getCurrentContent()),
                          ),
                        )
                      }}
                      editorStyle={{
                        height: '200px',
                        border: '0.2px solid #f3f3f3',
                        padding: '10px',
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography>
                      {t('generalManagement.createNewArticle.price')}
                    </Typography>
                    <FormControl
                      error={
                        formik.touched.price && Boolean(formik.errors.price)
                      }
                    >
                      <OutlinedInput
                        id="price"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            {t(
                              'generalManagement.createNewArticle.vndPerMonth',
                            )}
                          </InputAdornment>
                        }
                        type="number"
                        size="small"
                      />
                      <FormHelperText>
                        {formik.touched.price && formik.errors.price}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography>
                      {t('generalManagement.createNewArticle.acreage')}
                    </Typography>
                    <FormControl
                      error={
                        formik.touched.acreage && Boolean(formik.errors.acreage)
                      }
                    >
                      <OutlinedInput
                        id="acreage"
                        name="acreage"
                        value={formik.values.acreage}
                        onChange={formik.handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            m<sup>2</sup>
                          </InputAdornment>
                        }
                        type="number"
                        size="small"
                      />
                      <FormHelperText>
                        {formik.touched.acreage && formik.errors.acreage}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <Stack>
                    <Typography>
                      {t('generalManagement.createNewArticle.quantity')}
                    </Typography>
                    <FormControl
                      error={
                        formik.touched.quantity &&
                        Boolean(formik.errors.quantity)
                      }
                    >
                      <OutlinedInput
                        id="quantity"
                        name="quantity"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            {t('generalManagement.createNewArticle.person')}
                          </InputAdornment>
                        }
                        type="number"
                        size="small"
                      />
                      <FormHelperText>
                        {formik.touched.quantity && formik.errors.quantity}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant={'h4'} mb={2}>
                {t('generalManagement.createNewArticle.picture')}
              </Typography>
              <Box
                sx={{
                  backgroundColor: 'secondary',
                  border: '1px dashed #000',
                  height: '150px',
                }}
                mb={2}
              >
                <input
                  type="file"
                  name="files"
                  className="form-control"
                  id="post-images"
                  multiple
                  accept=".jpg, .jpeg, .png"
                  onChange={handleChangeFiles}
                  style={{ display: 'none' }}
                />
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    color: '#000',
                    textAlign: 'center',
                    padding: '18px 0',
                    margin: 'auto',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  htmlFor="post-images"
                  className="form-label"
                >
                  <Stack spacing={2} alignItems={'center'}>
                    <CloudUploadOutlinedIcon fontSize="large" color="primary" />
                    <Typography color="primary">
                      {t('generalManagement.createNewArticle.addPicture')}
                    </Typography>
                  </Stack>
                </label>
              </Box>
              <Grid container spacing={4} mb={2}>
                {imageUrls.map((item, index) => (
                  <Grid item xs={3} key={item} flexDirection={'column'}>
                    <Box height={'100px'} overflow={'hidden'} boxShadow={5}>
                      <Box
                        component={'img'}
                        srcSet={item}
                        src={item}
                        width={'100%'}
                        height={'100%'}
                      />
                    </Box>
                    <Button
                      startIcon={<DeleteIcon />}
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        handleDeleteFile(index)
                      }}
                    >
                      {t('generalManagement.createNewArticle.delete')}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              mb={2}
              display={'flex'}
              justifyContent={'flex-end'}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
              >
                {t('generalManagement.createNewArticle.create')}
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <GoongMap markers={[]} data={viewportData} layer={false} />
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default CreateArticle
