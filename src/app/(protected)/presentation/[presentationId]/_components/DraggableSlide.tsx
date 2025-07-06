'use client'
import { Slide } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useSlideStore } from '@/stores/useSlideStore'
import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'
import { MasterRecursiveComponent } from './MasterRecursiveComponent'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, Trash } from 'lucide-react'

type Props = {
    slide: Slide
    index: number
    moveSlide: (dragIndex: number, hoverIndex: number) => void
    handleDelete: (id: string) => void
    isEditable: boolean
}

const DraggableSlide = ({handleDelete,
    index,isEditable,slide
}: Props) => {
  const [{isDragging} ] = useDrag({
    type: 'SLIDE',
    item: {
      index,
      type:"SLIDE"
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: isEditable
  })
  const {currentSlide,setCurrentSlide, currentTheme, updateContentItem} = useSlideStore()
    const ref = useRef(null)
  const handleContentCahge = (contentId: string, newContent: string | string[] | string[][] )=> {
    updateContentItem(slide.id,contentId, newContent )
  }
  return (
    <div ref={ref} className={cn('w-full rounded-lg shadow-lg relative p-0 min-h-[400px] max-h-[800px]', 'shadow-xl transition-shadow duration-300', 'flex flex-col', index === currentSlide ? 'ring-2 ring-blue-500 ring-offset-2': '', slide.className, isDragging ? 'opacity-50':'opacity-100')} style={{backgroundImage: currentTheme.gradientBackground}}  onClick={()=> setCurrentSlide(index)}>
      <div className='h-full w-full flex-grow overflow-hidden'>
        <MasterRecursiveComponent content={slide.content} isPreview={false} slideId={slide.id} isEditable={isEditable} onContentChange={handleContentCahge}   />
      </div>
      {isEditable && <Popover>
        <PopoverTrigger asChild className='absolute top-2 left-2'>
          <Button size={'sm'} variant={'outline'}>
            <EllipsisVertical className='w-5 h-5' />
            <span className='sr-only'>
              Slide options
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit p-0'>
          <div className='flex space-x-2'>
            <Button variant={'ghost'} onClick={()=> handleDelete(slide.id)}>
              <Trash className='w-5 h-5 text-red-500' />
              <span className='sr-only'>
                Delete side
              </span>
            </Button>
          </div>
        </PopoverContent>
          </Popover>}
    </div>
  )
}

export default DraggableSlide