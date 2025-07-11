import { cn } from '@/lib/utils'
import { useSlideStore } from '@/stores/useSlideStore'
import React from 'react'

type Props = {
    className:string
}

const Divider = ({className}: Props) => {
    const {currentTheme} = useSlideStore()
  return (
    <hr className={cn('my-4', className)} style={{backgroundColor: currentTheme.accentColor}} />
  )
}

export default Divider