import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { type RootState } from '../../app/store'
import React from 'react'
import { useAppDispatch } from '../../app/hooks'
import { selectCategory } from '../../app/slice/category.slice'
import { useTranslation } from 'react-i18next'

interface ChooseCategoryModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChooseCategoryModal: React.FC<ChooseCategoryModalProps> = ({
  open,
  setOpen,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const categories = useSelector((state: RootState) => state.category.category)

  return (
    <Dialog
      PaperProps={{ sx: { minHeight: 400 } }}
      fullWidth
      open={open}
      maxWidth={'md'}
      onClose={() => {
        setOpen(false)
      }}
    >
      <DialogTitle
        textAlign={'center'}
        pb={2}
        borderBottom={1}
        borderColor={'grey.500'}
      >
        {t('chooseCategoryModal.chooseCategory')}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <RadioGroup
            defaultValue={
              categories?.[0] !== undefined ? categories[0].name : ''
            }
          >
            {categories.map(c => (
              <Box
                key={c._id}
                sx={{ borderBottom: 1, borderColor: 'grey.500', py: 1 }}
              >
                <FormControlLabel
                  onClick={() => {
                    setOpen(false)
                    dispatch(selectCategory(c))
                  }}
                  value={c.name}
                  control={<Radio />}
                  label={c.name}
                  sx={{ width: 1 }}
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}

export default ChooseCategoryModal
