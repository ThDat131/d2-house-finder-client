import {
  Box,
  Typography,
  List,
  styled,
  ListItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Stack,
  Switch,
} from '@mui/material'
import { t } from 'i18next'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { RootState } from '../app/store'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import { selectSubCategory } from '../app/slice/sub-category.slice'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
  border: 'none',
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  //   flexDirection: 'row-reverse',
  alignItems: 'center',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  border: 'none',
  padding: '0 30px 0 0 ',
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
  backgroundColor: '#f0f0f0',
  border: 'none',
}))

const ConditionFilter = () => {
  const dispatch = useAppDispatch()

  const [types, setTypes] = useState<any>()
  const [selectedType, setSelectedType] = useState<string | false>(false)

  const subCategoriesState = useAppSelector(
    (state: RootState) => state.subCategory,
  )
  const categoriesState = useAppSelector((state: RootState) => state.category)

  const ListItemStyle: React.CSSProperties = {
    width: '50%',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  }

  const CustomListItem = styled(ListItem)({
    paddingLeft: 0,
  })

  const handleChangeType =
    (type: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setSelectedType(newExpanded ? type : false)
    }

  const ConditionList = (types: any, key: string) => {
    if (!types) return

    const array = types[key]

    return (
      <Grid container spacing={1}>
        {array.map((x: any) => (
          <Grid item key={x} xs={12}>
            <CustomListItem key={x._id} style={ListItemStyle}>
              <FormControlLabel
                control={<Checkbox />}
                label={x.name}
                checked={subCategoriesState.selected.includes(x._id)}
                onClick={() => {
                  dispatch(selectSubCategory(x._id))
                }}
              />
            </CustomListItem>
          </Grid>
        ))}
      </Grid>
    )
  }

  useEffect(() => {
    const types = _.groupBy(categoriesState.selected.subCategories, 'type')
    setTypes(types)
  }, [subCategoriesState.subCategory, categoriesState.selected])

  return (
    <Box padding={2} sx={{ background: '#f0f0f0', borderRadius: '5px' }}>
      <Typography component={'h4'} fontSize={18} fontWeight={'bold'}>
        {t('conditionFilter.conditionFilter')}
      </Typography>
      <List style={{ display: 'flex', flexWrap: 'wrap' }}>
        {types &&
          Object.keys(types).map(x => (
            <Grid item key={x} xs={12}>
              <Accordion
                id={x}
                aria-controls={x}
                expanded={x === selectedType}
                onChange={handleChangeType(x)}
              >
                <AccordionSummary>
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    width={1}
                  >
                    <Typography>{x}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>{ConditionList(types, x)}</AccordionDetails>
              </Accordion>
            </Grid>
          ))}
      </List>
    </Box>
  )
}

export default ConditionFilter
