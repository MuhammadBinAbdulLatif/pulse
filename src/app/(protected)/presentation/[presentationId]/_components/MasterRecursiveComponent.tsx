'use client'
import { ContentItem } from '@/lib/types'
import React, { useCallback } from 'react'
import { animate, motion } from 'framer-motion'
import { Heading1 } from '@/components/editor/headings'
import { cn } from '@/lib/utils'
import DropZone from './DropZone'
type Props = {
    content: ContentItem
    onContentChange: (
        contentId: string,
        newContent: string | string [] | string[][]
    )=> void
    isPreview?: boolean,
    isEditable?: boolean,
    slideId: string
    index?: number
}

const ContentRenderer:React.FC<Props> = React.memo(({content,onContentChange,slideId,index,isEditable,isPreview}) => {
    const handleChange = useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        onContentChange(content.id, e.target.value)
    }, [content.id, onContentChange] )
    const animationProps = {
        initial: {opacity:0, y:20},
        animate: {opacity: 1, y:0},
        transition: {duration: 0.5}
    }
    const commonProps = {
        placeholder: content.placeholder,
        value: content.content as string,
        onchange: handleChange,
        isPreview: isPreview,
        className: content.className
    }
    // WIP: Complete types
    switch (content.type) {
        case 'heading1':
            return <motion.div  className='w-full h-full'>
                <Heading1 {...commonProps} />
            </motion.div>
        case 'column':
            if(Array.isArray(content.content)){
                return <motion.div {...animationProps} className={cn('w-full h-full flex-col flex ', content.className)}
                >
                    {content.content.length >0  ? (
                        content.content as ContentItem[]).map((subItem: ContentItem, subIndex: number)=> (
                            <React.Fragment key={subIndex}>
                                {!isPreview && !subItem.restrictToDrop && subIndex === 0 && isEditable && (
                                <DropZone index={0} parentId={content.id} slideId={slideId} />
)}
<MasterRecursiveComponent content={subItem} onContentChange={onContentChange} isPreview={isPreview} slideId={slideId} index={subIndex} isEditable={isEditable} />
                            </React.Fragment>
)) : '' }

                </motion.div>
            }
        default:
            return <h1>Nothing</h1>
    }
})
ContentRenderer.displayName= 'ContentRenderer'



export const  MasterRecursiveComponent: React.FC<Props> = React.memo(
    ({content,onContentChange,slideId,index,isEditable=true,isPreview=false})=> {
        if(isPreview){
            return <ContentRenderer content={content} onContentChange={onContentChange} isPreview={isPreview} isEditable={isEditable} slideId={slideId} index={index} />
        }
        return <React.Fragment>
            <ContentRenderer content={content} onContentChange={onContentChange} isPreview={isPreview} isEditable={isEditable} slideId={slideId} index={index} />
        </React.Fragment>
    }
)
MasterRecursiveComponent.displayName = 'MasterRecursiveComponent'
