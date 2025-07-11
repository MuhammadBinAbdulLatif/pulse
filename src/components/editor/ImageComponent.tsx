import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import UploadComponent from '../global/upload-component'

type Props = {
    src: string
    alt: string
    className?: string
    isPreview?: boolean
    contentId: string
    onContentChange: (contentId: string, newContent: string | string[] | string[][] ) => void
    isEditable?: boolean
}

const ImageComponent = ({alt,contentId,onContentChange,src,className,isEditable = true,isPreview}: Props) => {
  return (
    <div className='relative group w-full h-full rounded-lg'>
        <Image src={src} width={isPreview ? 48: 800} height={isPreview ? 48: 800} alt={alt} className={cn('object-cover w-full h-full rounded-lg', className)} />
        {!isPreview && isEditable && <div className='absolute top-0 left-0 hidden group-hover:block '>
            <UploadComponent contentId={contentId} onContentChange={onContentChange} />
        </div> }
    </div>
  )
}

export default ImageComponent