import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material'
import { type Comment as CommentInterface } from '../../../model/comment/comment'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { useAppSelector } from '../../../app/hooks'
import CommentInput from './CommentInput'
import ReplyComment from './ReplyComment'
import { RootState } from '../../../app/store'

interface CommentProps {
  comment: CommentInterface
  showAction: boolean | null
}

export const Comment: React.FC<CommentProps> = ({ comment, showAction }) => {
  const { t } = useTranslation()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isReply, setIsReply] = useState<boolean>(false)

  const currentUser = useAppSelector((state: RootState) => state.auth.user)

  const handleOpenEdit = () => {
    setIsEdit(!isEdit)
  }

  const handleOpenReply = () => {
    setIsReply(!isReply)
  }

  return (
    <Stack>
      <Grid container mt={2}>
        {isEdit ? (
          <CommentInput
            type={1}
            previousComment={comment}
            setIsEdit={setIsEdit}
          />
        ) : (
          <Grid container spacing={2}>
            <Grid item>
              <Box width={50} height={50}>
                <Box
                  boxShadow={2}
                  component={'img'}
                  src={comment.createdBy.avatar}
                  width={1}
                  height={1}
                  borderRadius={'50%'}
                />
              </Box>
            </Grid>
            <Grid item display={'flex'} flexDirection={'column'} flex={1}>
              <Box
                borderRadius={5}
                bgcolor={'#f2f3f5'}
                p={1}
                px={2}
                display={'inline'}
              >
                <Typography fontWeight={500}>
                  {comment.createdBy.fullName}
                </Typography>
                <Typography>{comment.content}</Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Box>
        <Stack
          mt={1}
          ml={10}
          flexDirection={'row'}
          alignItems={'center'}
          gap={1}
        >
          {showAction ? (
            <>
              <ButtonBase onClick={handleOpenEdit}>
                {t('articleDetails.edit')}
              </ButtonBase>
              <ButtonBase onClick={handleOpenReply}>
                {t('articleDetails.reply')}
              </ButtonBase>
              {/* <ButtonBase onClick={handleOpenReply} sx={{ color: '#ff0000' }}>
                {t('articleDetails.delete')}
              </ButtonBase> */}
            </>
          ) : (
            <ButtonBase onClick={handleOpenReply}>
              {t('articleDetails.reply')}
            </ButtonBase>
          )}
        </Stack>
      </Box>
      <Box>
        <Box ml={10} mt={1}>
          {isReply ? (
            <CommentInput
              type={2}
              previousComment={comment}
              setIsReply={setIsReply}
            />
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box>
        <Box ml={10} mt={1}>
          {comment.replies.length > 0 ? (
            comment.replies.map(x => (
              <React.Fragment key={comment._id}>
                <ReplyComment
                  parentId={comment._id as string}
                  comment={x}
                  showAction={currentUser?._id === x.updatedBy?._id}
                />
              </React.Fragment>
            ))
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Stack>
  )
}

export default Comment
