import React, { useRef, useEffect, type PropsWithChildren } from 'react'

import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

import type { OptionsType } from '@fancyapps/ui/types/Fancybox/options'
import { Box } from '@mui/material'

interface Props {
  delegate?: string
  options?: Partial<OptionsType>
}

function Fancybox(props: PropsWithChildren<Props>) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    const delegate = props.delegate ?? '[data-fancybox]'
    const options = props.options ?? {}

    NativeFancybox.bind(container, delegate, options)

    return () => {
      NativeFancybox.unbind(container)
      NativeFancybox.close()
    }
  })

  return (
    <Box style={{ zIndex: 3000 }} ref={containerRef}>
      {props.children}
    </Box>
  )
}

export default Fancybox
