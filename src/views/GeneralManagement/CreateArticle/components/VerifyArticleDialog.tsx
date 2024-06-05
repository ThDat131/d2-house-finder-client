import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { useTranslation } from 'react-i18next'
import { HttpService } from '../../../../api/HttpService'
import { CommonResponse } from '../../../../model/common/common-response'
import { ApiPathEnum } from '../../../../api/ApiPathEnum'
import { useEffect, useState } from 'react'
import { Article } from '../../../../model/article/article'
import { LoadingButton } from '@mui/lab'
import DeleteIcon from '@mui/icons-material/Delete'
import { VerificationStatusEnum } from '../../../../common/common-enum'
import { toast } from 'react-toastify'

interface ImageType {
  name: string
  url: string
}

const VerifyArticleDialog = ({
  open,
  setOpen,
  article,
}: {
  open: boolean
  setOpen: any
  article: Article
}) => {
  const { t } = useTranslation()
  const { httpService } = new HttpService()
  const [relatedImages, setRelatedImages] = useState<ImageType[]>([])
  const [contractImages, setContractImages] = useState<ImageType[]>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [video, setVideo] = useState<ImageType>({
    name: '',
    url: '',
  })
  const [latedLoading, setLatedLoading] = useState<boolean>(false)
  const [contractLoading, setContractLoading] = useState<boolean>(false)
  const [videoLoading, setVideoLoading] = useState<boolean>(false)

  useEffect(() => {
    setRelatedImages([])
    setContractImages([])
    setVideo({
      name: '',
      url: '',
    })
  }, [article])

  const handleChangeLatedImagesFiles = (evt: any) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        const formData = new FormData()
        formData.append('file', file)

        setLatedLoading(true)
        httpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              setRelatedImages(prev => [
                ...prev,
                { url: res.data.data.path, name: file.name },
              ])
            }
          })
          .finally(() => {
            setLatedLoading(false)
          })
      }
    }
  }

  const handleChangeContractImagesFiles = (evt: any) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        const formData = new FormData()
        formData.append('file', file)

        setContractLoading(true)
        httpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              setContractImages(prev => [
                ...prev,
                { url: res.data.data.path, name: file.name },
              ])
            }
          })
          .finally(() => {
            setContractLoading(false)
          })
      }
    }
  }

  const handleChangeVideoFile = (evt: any) => {
    if (evt.target.files) {
      for (const file of evt.target.files) {
        setVideo({ url: '', name: file.name })

        const formData = new FormData()
        formData.append('file', file)

        setVideoLoading(true)

        httpService
          .post<CommonResponse<any>>(ApiPathEnum.UploadSingleFile, formData)
          .then(res => {
            if (res.status === 201) {
              setVideo(prev => ({ ...prev, url: res.data.data.path }))
            }
          })
          .finally(() => {
            setVideoLoading(false)
          })
      }
    }
  }

  const handleDeleteLatedImagesFile = (name: string) => {
    const relatedImageTemp = [...relatedImages]

    setRelatedImages(() => relatedImageTemp.filter(item => item.name !== name))
  }

  const handleDeleteContractImagesFile = (name: string) => {
    const relatedImageTemp = [...contractImages]

    setContractImages(() => relatedImageTemp.filter(item => item.name !== name))
  }

  const handleDeleteVideo = () => {
    setVideo({
      name: '',
      url: '',
    })
  }

  const handleSubmit = () => {
    setSubmitLoading(true)

    const data = {
      latedImage: relatedImages.map(x => x.url),
      contract: contractImages.map(x => x.url),
      articleId: article._id,
      status: VerificationStatusEnum.PENDING,
      video: video.url,
    }

    httpService
      .post(ApiPathEnum.VerifyArticle, data)
      .then(res => {
        if (res.status === 201) {
          toast.success(
            t('generalManagement.verifyArticle.sendRequestSuccessfully'),
          )

          setOpen(false)
        } else {
          toast.error(t('admin.permission.errorHaveOccurPleaseTryAgain'))
        }
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      maxWidth={'sm'}
      fullWidth
    >
      <DialogTitle>
        {t('generalManagement.verifyArticle.requestVerify')}
      </DialogTitle>
      <DialogContent>
        <Stack>
          <Grid container spacing={2}>
            <Grid item container xs={12}>
              <Grid item xs={8} container alignItems={'center'}>
                <Typography>
                  {t('generalManagement.verifyArticle.latedImage')}
                </Typography>
              </Grid>
              <LoadingButton
                variant="contained"
                startIcon={<FileUploadIcon />}
                component={'label'}
                loading={latedLoading}
              >
                {t('generalManagement.verifyArticle.upload')}
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={evt => {
                    setRelatedImages([])
                    handleChangeLatedImagesFiles(evt)
                  }}
                />
              </LoadingButton>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={8} container alignItems={'center'}>
                <Typography>
                  {t('generalManagement.verifyArticle.contract')}
                </Typography>
              </Grid>
              <LoadingButton
                variant="contained"
                startIcon={<FileUploadIcon />}
                component={'label'}
                loading={contractLoading}
              >
                {t('generalManagement.verifyArticle.upload')}
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={evt => {
                    setContractImages([])
                    handleChangeContractImagesFiles(evt)
                  }}
                />
              </LoadingButton>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={8} container alignItems={'center'}>
                <Typography>
                  {t('generalManagement.verifyArticle.video')}
                </Typography>
              </Grid>
              <LoadingButton
                variant="contained"
                startIcon={<FileUploadIcon />}
                component={'label'}
                loading={videoLoading}
              >
                {t('generalManagement.verifyArticle.upload')}
                <input
                  type="file"
                  hidden
                  onChange={evt => {
                    handleChangeVideoFile(evt)
                  }}
                />
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography fontSize={20} fontWeight={500} my={2}>
                {t('generalManagement.verifyArticle.listOfFile')}
              </Typography>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <Typography>
                  {t('generalManagement.verifyArticle.latedImage')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <List>
                  {relatedImages.map(x => (
                    <ListItem
                      sx={{ width: 1 }}
                      key={x.name}
                      secondaryAction={
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteLatedImagesFile(x.name)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        sx={{
                          overflow: 'hidden',
                        }}
                      >
                        <ListItemText
                          primary={x.name}
                          sx={{
                            maxWidth: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textWrap: 'nowrap',
                            opacity: 0.6,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <Typography>
                  {t('generalManagement.verifyArticle.contract')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <List>
                  {contractImages.map(x => (
                    <ListItem
                      sx={{ width: 1 }}
                      key={x.name}
                      secondaryAction={
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteContractImagesFile(x.name)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        sx={{
                          overflow: 'hidden',
                        }}
                      >
                        <ListItemText
                          primary={x.name}
                          sx={{
                            maxWidth: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textWrap: 'nowrap',
                            opacity: 0.6,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <Typography>
                  {t('generalManagement.verifyArticle.video')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {video.name && (
                  <List>
                    <ListItem
                      sx={{ width: 1 }}
                      secondaryAction={
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteVideo()
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        sx={{
                          overflow: 'hidden',
                        }}
                      >
                        <ListItemText
                          primary={video.name}
                          sx={{
                            maxWidth: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textWrap: 'nowrap',
                            opacity: 0.6,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton loading={submitLoading} onClick={handleSubmit}>
          {t('generalManagement.verifyArticle.submit')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default VerifyArticleDialog
