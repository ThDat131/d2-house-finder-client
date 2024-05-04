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
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ActionType } from '../../../../common/common-enum'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../../../app/store'
import { useEffect, useState } from 'react'
import { District } from '../../../../model/address/district'
import { Ward } from '../../../../model/address/ward'
import { Editor } from 'react-draft-wysiwyg'
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
} from 'draft-js'
import { ArticleCreatedModel } from '../../../../model/article/article-create'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  createArticle,
  updateArticle,
} from '../../../../app/slice/article.slice.'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import {
  getAllProvinces,
  selectProvince,
} from '../../../../app/slice/province.slice'
import {
  getAllDistricts,
  selectDistrict,
} from '../../../../app/slice/district.slice'
import { getAllWards, selectWard } from '../../../../app/slice/ward.slice'
import { useLocation, useNavigate } from 'react-router-dom'
import { Province } from '../../../../model/address/province'
import { HttpService } from '../../../../api/HttpService'
import { CommonResponse } from '../../../../model/common/common-response'
import { ApiPathEnum } from '../../../../api/ApiPathEnum'
import draftToHtml from 'draftjs-to-html'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import { getCategories } from '../../../../app/slice/category.slice'
import { Article } from '../../../../model/article/article'

interface ImageType {
  blob: string
  url: string
}

interface CreateArticleProps {
  type: ActionType
}

const CreateArticle: React.FC<CreateArticleProps> = ({ type }) => {
  const { authHttpService } = new HttpService()
  const { t } = useTranslation()
  const error = useAppSelector((state: RootState) => state.article.error)
  const provinceState = useAppSelector((state: RootState) => state.provinces)
  const districtState = useAppSelector((state: RootState) => state.districts)
  const categoryState = useAppSelector((state: RootState) => state.category)
  const articleState = useAppSelector((state: RootState) => state.article)
  const wardState = useAppSelector((state: RootState) => state.wards)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [exactAddress, setExactAddress] = useState<string>('')
  const [description, setDescription] = useState<any>(EditorState.createEmpty())
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<ImageType[]>([])
  const [article, setArticle] = useState<Article>()

  const initialValues: ArticleCreatedModel = {
    _id: type === ActionType.CREATE ? '' : article?._id ?? '',
    title: type === ActionType.CREATE ? '' : article?.title ?? '',
    description: type === ActionType.CREATE ? '' : article?.description ?? '',
    categoryId:
      type === ActionType.CREATE ? '' : article?.categoryId?._id ?? '',
    price: type === ActionType.CREATE ? 0 : article?.price ?? 0,
    acreage: type === ActionType.CREATE ? 0 : article?.acreage ?? 0,
    streetAddress:
      type === ActionType.CREATE ? '' : article?.address.streetAddress ?? '',
    latitude:
      type === ActionType.CREATE ? 0 : article?.location.coordinates[1] ?? 0,
    longitude:
      type === ActionType.CREATE ? 0 : article?.location.coordinates[0] ?? 0,
    provinceCode:
      type === ActionType.CREATE ? 0 : article?.address.provinceCode ?? 0,
    districtCode:
      type === ActionType.CREATE ? 0 : article?.address.districtCode ?? 0,
    wardCode: type === ActionType.CREATE ? 0 : article?.address.wardCode ?? 0,
    provinceName:
      type === ActionType.CREATE ? '' : article?.address.provinceName ?? '',
    districtName:
      type === ActionType.CREATE ? '' : article?.address.districtName ?? '',
    wardName: type === ActionType.CREATE ? '' : article?.address.wardName ?? '',
    images: type === ActionType.CREATE ? [] : article?.images ?? [],
    quantity: type === ActionType.CREATE ? 0 : article?.quantity ?? 0,
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('admin.article.noEnteredTitle')),
    description: Yup.string().required(t('admin.article.noEnteredDescription')),
    categoryId: Yup.string().required(t('admin.article.noCategorySelected')),
    price: Yup.string().required(t('admin.article.noEnteredPrice')),
    acreage: Yup.string().required(t('admin.article.noEnteredAcreage')),
    streetAddress: Yup.string().required(
      t('admin.article.noEnteredStreetAndHouseNumber'),
    ),
    provinceCode: Yup.string().required(t('admin.article.noProvinceSelected')),
    districtCode: Yup.string().required(t('admin.article.noDistrictSelected')),
    wardCode: Yup.string().required(t('admin.article.noWardSelected')),
    quantity: Yup.string().required(t('admin.article.noEnteredQuantity')),
  })

  const onSubmit = () => {
    if (type === ActionType.CREATE) {
      dispatch(createArticle(formik.values))
        .unwrap()
        .then(() => {
          toast.success(t('admin.article.createSuccess'))
          dispatch(selectProvince(null))
          dispatch(selectDistrict(null))
          dispatch(selectWard(null))
          navigate('admin/article')
        })
    } else {
      dispatch(updateArticle(formik.values))
        .unwrap()
        .then(() => {
          toast.success(t('admin.article.updateSuccess'))
          dispatch(selectProvince(null))
          dispatch(selectDistrict(null))
          dispatch(selectWard(null))
          navigate('/admin/article')
        })
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  })

  const handleChangeProvince = (province: Province) => {
    dispatch(selectProvince(province))

    dispatch(getAllDistricts(province.province_id)).then(response => {
      setDistricts(response.payload.results)
    })

    formik.setFieldValue('provinceName', province.province_name)

    setWards([])
    setExactAddress(province.province_name)
  }

  const handleChangeDistrict = (district: District) => {
    dispatch(selectDistrict(district))

    dispatch(getAllWards(district.district_id)).then(response => {
      setWards(response.payload.results)
    })

    formik.setFieldValue('districtName', district.district_name)

    const address = `${formik.values.provinceName}, ${district.district_name}`

    setExactAddress(address)
  }

  const handleChangeWard = (ward: Ward) => {
    dispatch(selectWard(ward))

    formik.setFieldValue('wardName', ward.ward_name)

    const address = `${formik.values.provinceName}, ${formik.values.districtName}, ${ward.ward_name}`

    setExactAddress(address)
  }

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

    setUploadedImages(() =>
      uploadedImages.filter(item => item.blob !== updatedImageUrls[index]),
    )

    updatedImageUrls.splice(index, 1)

    setImageUrls(updatedImageUrls)
  }

  useEffect(() => {
    if (type === ActionType.UPDATE) {
      const initial = location.state as Article
      setArticle(initial)

      const convertedDescription = convertFromHTML(initial.description)
      const contentState = ContentState.createFromBlockArray(
        convertedDescription.contentBlocks,
        convertedDescription.entityMap,
      )
      const newState = EditorState.push(
        description,
        contentState,
        'insert-characters',
      )

      setDescription(newState)

      dispatch(getAllDistricts(initial.address.provinceCode.toString()))
        .unwrap()
        .then(response => {
          setDistricts(response.results)
        })

      dispatch(getAllWards(initial.address.districtCode.toString()))
        .unwrap()
        .then(response => {
          setWards(response.results)
        })

      const addressObject = initial.address
      const address = `${addressObject.streetAddress}, ${addressObject.wardName}, ${addressObject.districtName}, ${addressObject.provinceName}`

      setExactAddress(address)
      setImageUrls(initial.images)
      const uploadImages = initial.images.map(x => ({
        blob: x,
        url: x,
      }))
      setUploadedImages(uploadImages)
    }

    if (provinceState.data?.length > 0) return
    const provincePromise = dispatch(getAllProvinces())
    const categoryPromise = dispatch(getCategories())
    return () => {
      provincePromise.abort()
      categoryPromise.abort()
    }
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        display={'flex'}
        justifyContent={'space-between'}
        mb={4}
      >
        <Typography variant={'h3'} mb={2}>
          {type === ActionType.CREATE
            ? t('admin.article.createArticle')
            : t('admin.article.updateArticle')}
        </Typography>
      </Grid>
      <form
        onSubmit={evt => {
          evt.preventDefault()

          const imagesArr = uploadedImages.map(i => i.url)
          const payload = { ...formik.values, images: imagesArr }

          formik.setValues(payload)
          formik.handleSubmit()
        }}
      >
        <Grid item container xs={12}>
          <Paper sx={{ width: 1 }}>
            <Grid container item xs={12} p={3}>
              <Grid item xs={12} mb={2}>
                <Typography variant={'h4'} mb={2}>
                  {t('admin.article.addressForRent')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Stack>
                      <Typography noWrap>
                        {t('admin.article.province')}
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
                          {provinceState.data.length > 0 &&
                            provinceState.data.map(p => (
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
                          {t('admin.article.district')}
                        </Typography>
                        {districtState.loading && (
                          <CircularProgress size={20} />
                        )}
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
                          {t('admin.article.ward')}
                        </Typography>
                        {wardState.loading && <CircularProgress size={20} />}
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
                        {t('admin.article.streetAndHouseNumber')}
                      </Typography>
                      <TextField
                        id="streetAddress"
                        name="streetAddress"
                        value={formik.values.streetAddress}
                        onChange={formik.handleChange}
                        onBlur={() => {
                          const address = getExactAddress()
                          setExactAddress(address)
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
                      <Typography>{t('admin.article.address')}</Typography>
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
                  {t('admin.article.description')}
                </Typography>
                <Grid container>
                  <Grid item mb={2}>
                    <Stack>
                      <Typography>{t('admin.article.category')}</Typography>
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
                          {categoryState.category.length > 0 &&
                            categoryState.category.map(c => (
                              <MenuItem key={c.name} value={c._id}>
                                {c.name}
                              </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                          {formik.touched.categoryId &&
                            formik.errors.categoryId}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} mb={2}>
                    <Stack>
                      <Typography>{t('admin.article.title')}</Typography>
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
                      <Typography>{t('admin.article.content')}</Typography>
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
                      <Typography>{t('admin.article.price')}</Typography>
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
                              {t('admin.article.vndPerMonth')}
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
                      <Typography>{t('admin.article.acreage')}</Typography>
                      <FormControl
                        error={
                          formik.touched.acreage &&
                          Boolean(formik.errors.acreage)
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
                      <Typography>{t('admin.article.quantity')}</Typography>
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
                              {t('admin.article.person')}
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
                  {t('admin.article.picture')}
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
                      <CloudUploadOutlinedIcon
                        fontSize="large"
                        color="primary"
                      />
                      <Typography color="primary">
                        {t('admin.article.addPicture')}
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
                          sx={{ objectFit: 'cover', objectPosition: 'center' }}
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
                        {t('admin.article.delete')}
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
                  loading={articleState.loading}
                >
                  {type === ActionType.CREATE
                    ? t('admin.article.create')
                    : t('admin.article.update')}
                </LoadingButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </form>
    </Grid>
  )
}

export default CreateArticle
