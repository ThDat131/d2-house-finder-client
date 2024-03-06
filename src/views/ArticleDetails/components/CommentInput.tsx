import { Box, Grid, IconButton, TextField } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { type RootState } from '../../../app/store'
import SendIcon from '@mui/icons-material/Send'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  addTempComment,
  addTempReplyComment,
  createComment,
  createReplyComment,
  editComment,
  editReplyComment,
  editTempComment,
  editTempReplyComment,
} from '../../../app/slice/article.slice.'
import { Comment } from '../../../model/comment/comment'

enum TypeInput {
  comment = 0,
  edit = 1,
  reply = 2,
  editReply = 3,
}

interface CommentInputProps {
  type: TypeInput
  parentId?: string
  previousComment?: Comment
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>
  setIsReply?: React.Dispatch<React.SetStateAction<boolean>>
}

const CommentInput: React.FC<CommentInputProps> = ({
  type,
  parentId,
  previousComment,
  setIsEdit,
  setIsReply,
}): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector((state: RootState) => state.auth.user)
  const currentArticle = useAppSelector(
    (state: RootState) => state.article.currentArticle,
  )
  const [comment, setComment] = useState<string>('')

  const handleCreateComment = () => {
    setComment('')
    let tempComment: any

    switch (type) {
      case 0:
        dispatch(
          addTempComment({
            articleId: currentArticle?._id as string,
            content: comment,
            createdBy: {
              _id: currentUser._id,
              avatar: currentUser.avatar,
              fullName: currentUser.fullName,
            },
            replies: [],
          }),
        )

        dispatch(
          createComment({
            content: comment,
            articleId: currentArticle?._id as string,
          }),
        )
        break
      case 1:
        tempComment = { ...previousComment }
        tempComment.content = comment
        tempComment.createdBy = {
          _id: currentUser._id,
          avatar: currentUser.avatar,
          fullName: currentUser.fullName,
        }

        dispatch(editTempComment(tempComment))
        dispatch(
          editComment({
            data: {
              content: comment,
              articleId: previousComment?.articleId as string,
            },
            id: tempComment._id as string,
          }),
        )
        setIsEdit?.(false)
        break
      case 2:
        tempComment = { ...previousComment }
        tempComment.content = comment
        tempComment.updatedBy = {
          _id: currentUser._id,
          avatar: currentUser.avatar,
          fullName: currentUser.fullName,
        }

        dispatch(
          addTempReplyComment({
            commentId: tempComment._id,
            reply: tempComment,
          }),
        )
        dispatch(
          createReplyComment({
            data: {
              content: comment,
            },
            id: tempComment._id as string,
          }),
        )
        setIsReply?.(false)
        break
      case 3:
        tempComment = { ...previousComment }
        tempComment.content = comment
        tempComment.updatedBy = {
          _id: currentUser._id,
          avatar: currentUser.avatar,
          fullName: currentUser.fullName,
        }

        dispatch(
          editTempReplyComment({
            commentId: parentId as string,
            reply: tempComment,
          }),
        )
        dispatch(
          editReplyComment({
            data: {
              reply_id: tempComment._id,
              content: comment,
            },
            id: parentId as string,
          }),
        )
        setIsEdit?.(false)
        break
    }
  }

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item>
        <Box
          width={50}
          height={50}
          borderRadius={'50%'}
          overflow={'hidden'}
          boxShadow={2}
        >
          <Box
            component={'img'}
            src={currentUser.avatar}
            width={1}
            height={1}
          />
        </Box>
      </Grid>
      <Grid item flex={1}>
        <TextField
          fullWidth
          placeholder={t('articleDetails.submitYourComment')}
          value={comment}
          onChange={evt => {
            setComment(evt.target.value)
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleCreateComment}>
                <SendIcon color={comment ? 'primary' : 'disabled'} />
              </IconButton>
            ),
          }}
        />
      </Grid>
    </Grid>
  )
}

export default CommentInput
