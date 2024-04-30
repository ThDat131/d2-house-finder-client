import { Box, Grid, Stack, Switch, Typography, styled } from '@mui/material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import { useAppSelector } from '../app/hooks'
import { RootState } from '../app/store'
import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { Permission } from '../model/permission/permission'

const CustomAccordion = () => {
  const permissionState = useAppSelector((state: RootState) => state.permission)

  const [selectedModule, setSelectedModule] = useState<string | false>(false)
  const [modules, setModules] = useState<any>()

  const handleChangeModule =
    (module: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setSelectedModule(newExpanded ? module : false)
    }

  const PermissionList = (modules: any, key: string) => {
    if (!modules) return

    const array = modules[key]

    const getColor = (method: string) => {
      if (method === 'GET') return '#61affe'
      if (method === 'POST') return '#49cc90'
      if (method === 'PATCH') return '#50e3c2'
      if (method === 'PUT') return '#fca130'
      if (method === 'DELETE') return '#f93e3e'
    }

    return (
      <Grid container spacing={2}>
        {array.map((p: Permission) => (
          <Grid key={p._id} item xs={6}>
            <Stack direction={'row'}>
              <Box>
                <Switch />
              </Box>
              <Stack>
                <Typography>{p.name}</Typography>
                <Stack direction={'row'}>
                  <Typography fontWeight={'bold'} color={getColor(p.method)}>
                    {p.method}
                  </Typography>
                  <Typography color={'rgb(102, 102, 102)'} pl={1}>
                    {p.apiPath}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>
    )
  }

  useEffect(() => {
    const modules = _.groupBy(permissionState.permissions, 'module')

    setModules(modules)
  }, [permissionState])

  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }))

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }))

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }))

  if (!modules) return

  return (
    <Grid container>
      {Object.keys(modules).map(x => (
        <Grid item key={x}>
          <Accordion
            id={x}
            aria-controls={x}
            expanded={x === selectedModule}
            onChange={handleChangeModule(x)}
          >
            <AccordionSummary>
              <Typography>{x}</Typography>
            </AccordionSummary>
            <AccordionDetails>{PermissionList(modules, x)}</AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  )
}

export default CustomAccordion
