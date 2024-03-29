import React from 'react'
import HeaderDefault from './HeaderSearch'
import { Box } from '@mui/material'

interface Props {
  children: React.ReactNode
}
const MainWithDefaultHeader: React.FC<Props> = ({ children }) => {
  return (
    <>
      <HeaderDefault />;<Box>{children}</Box>
    </>
  )
}
export default MainWithDefaultHeader
