import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useSlideStore } from '@/stores/useSlideStore'
import React, { useState } from 'react'

const LayoutPreview = () => {
    const {getOrderedSlides, reorderSlides} = useSlideStore()
   
    const slides = getOrderedSlides()
    const [loading, setLoading] = useState(false)
  return (
    <ScrollArea className='w-64 h-screen fixed left-0 top-5 border-r overflow-y-auto' suppressHydrationWarning>
        {loading ? (
            <div className='w-full px-4 flex flex-col space-y-6'>
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-20 wfull' />
            </div>
        ): (
            <div className='p-4 pb-32 space-y-6'>
                <div className='flex items-center justify-between mb-6'>
                     
                     <h2 className='text-sm font-medium dark:text-gray-100 text-gray-500'>
                        SLIDES
                     </h2>
                     <span className='text-xs dark:text-gray-200 text-gray-400' suppressHydrationWarning>
                        {slides.length} slides
                     </span>
                </div>
                {/* {slides.map((slide, idx)=> { */}
                     {/* Add the draggable slide preview after creating the editor
                    <DraggableSlidePreview key={idx} slide={slide} index{idx} moveSlide={movieSlide} /> */}
                {/* })} */}
            </div>
        )}
    </ScrollArea>
  )
}

export default LayoutPreview