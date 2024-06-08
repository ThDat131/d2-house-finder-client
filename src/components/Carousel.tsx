import React, { useRef, useEffect, PropsWithChildren } from 'react'

import { Carousel as NativeCarousel } from '@fancyapps/ui'
import '@fancyapps/ui/dist/carousel/carousel.css'
import '@fancyapps/ui/dist/carousel/carousel.thumbs.css'
import type { OptionsType } from '@fancyapps/ui/types/Carousel/options'
import { Autoplay } from '@fancyapps/ui/dist/carousel/carousel.autoplay.esm.js'
import '@fancyapps/ui/dist/carousel/carousel.autoplay.css'

interface Props {
  options?: Partial<OptionsType>
}

const defaults: Partial<OptionsType> = {
  Thumbs: {
    type: 'modern',
  },
  Autoplay: {
    timeout: 2000,
    pauseOnHover: true,
    showProgress: false,
  },
}

function Carousel(props: PropsWithChildren<Props>) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const options = {
      ...defaults,
      ...(props.options ?? {}),
    }

    const instance = new NativeCarousel(container, options, { Autoplay })

    return () => {
      instance.destroy()
    }
  })

  return (
    <div className="f-carousel" ref={containerRef}>
      {props.children}
    </div>
  )
}

export default Carousel
