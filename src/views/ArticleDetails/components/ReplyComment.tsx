import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material'
import { Comment } from '../../../model/comment/comment'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import CommentInput from './CommentInput'

interface ReplyCommentProps {
  parentId: string
  comment: Comment
  showAction: boolean | null
}
export const ReplyComment: React.FC<ReplyCommentProps> = ({
  parentId,
  comment,
  showAction,
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpenEdit = () => {
    setIsOpen(!isOpen)
  }
  return (
    <Stack>
      <Box mt={2}>
        {isOpen ? (
          <CommentInput
            type={3}
            parentId={parentId}
            previousComment={comment}
            setIsEdit={setIsOpen}
          />
        ) : (
          <Grid container spacing={2}>
            <Grid item>
              <Box width={50} height={50}>
                <Box
                  boxShadow={2}
                  component={'img'}
                  src={comment.updatedBy?.avatar}
                  width={1}
                  height={1}
                  borderRadius={'50%'}
                />
              </Box>
            </Grid>
            <Grid item flex={1}>
              <Box borderRadius={5} bgcolor={'#f2f3f5'} p={1} px={2}>
                <Typography fontWeight={500}>
                  {comment.updatedBy?.fullName}
                </Typography>
                <Typography>{comment.content}</Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Stack mt={1} ml={10} flexDirection={'row'} alignItems={'center'} gap={1}>
        {showAction ? (
          <ButtonBase onClick={handleOpenEdit}>
            {t('articleDetails.edit')}
          </ButtonBase>
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  )
}

export default ReplyComment
