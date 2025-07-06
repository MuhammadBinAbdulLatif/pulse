'use client'
import { ContentItem } from '@/lib/types'
import React, { useCallback } from 'react'
import { animate, motion } from 'framer-motion'
import { Heading1, Heading2, Heading3, Heading4, Title } from '@/components/editor/headings'
import { Paragraph, TextBlock } from '@/components/editor/text' // Assuming text.tsx is created
import { ImageComponent } from '@/components/editor/image' // Assuming image.tsx is created
import { cn } from '@/lib/utils'
import DropZone from './DropZone' // This component was not fully defined in the prompt, assuming it exists and works.
                                     // If DropZone is from './DropZone.tsx' as in original, it should be fine.
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
        onChange: handleChange, // <<<< FIXED TYPO HERE
        isPreview: isPreview,
        className: content.className,
        style: { color: 'inherit' } // Ensure color inheritance for text components
    }

    // WIP: Complete types
    switch (content.type) {
        case 'heading1':
            return <motion.div className='w-full h-full'><Heading1 {...commonProps} /></motion.div>;
        case 'heading2':
            return <motion.div className='w-full h-full'><Heading2 {...commonProps} /></motion.div>;
        case 'heading3':
            return <motion.div className='w-full h-full'><Heading3 {...commonProps} /></motion.div>;
        case 'heading4':
            return <motion.div className='w-full h-full'><Heading4 {...commonProps} /></motion.div>;
        case 'title':
            return <motion.div className='w-full h-full'><Title {...commonProps} /></motion.div>;
        case 'paragraph':
            return <motion.div className='w-full h-full'><Paragraph {...commonProps} /></motion.div>;
        case 'image':
            return <motion.div {...animationProps} className={cn('w-full h-full', content.className)}>
                <ImageComponent
                    src={content.content as string}
                    alt={content.alt || 'Slide image'}
                    className={content.className}
                    isPreview={isPreview}
                />
            </motion.div>;
        case 'column':
        case 'resizable-column':
        case 'container':
        case 'multiColumn':
        case 'imageAndText':
            if (Array.isArray(content.content)) {
                return <motion.div {...animationProps} className={cn('w-full h-full flex flex-col', content.className)}
                >
                    {content.content.length > 0 ? (
                        content.content as ContentItem[]).map((subItem: ContentItem, subIndex: number) => (
                            <React.Fragment key={subItem.id || subIndex}>
                                {!isPreview && !subItem.restrictToDrop && subIndex === 0 && isEditable && (
                                    <DropZone index={0} parentId={content.id} slideId={slideId} onDrop={() => {}} isEditable={isEditable}/> // Added dummy onDrop for now
                                )}
                                <MasterRecursiveComponent content={subItem} onContentChange={onContentChange} isPreview={isPreview} slideId={slideId} index={subIndex} isEditable={isEditable} />
                            </React.Fragment>
                        )) : (isPreview ? null : <div className="p-2 text-xs text-gray-400">Empty column. Drag components here.</div>) // Placeholder for empty columns in editor
                    }
                </motion.div>
            }
            return <div className="text-red-500">Error: Content for {content.type} should be an array.</div>;
        case 'text':
            return <motion.div className='w-full h-full'><TextBlock {...commonProps} /></motion.div>;
        default:
            return <div className="p-4 my-2 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md">
                Unhandled content type: <strong>{content.type}</strong>
                <pre className="mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(content.content, null, 2)}</pre>
            </div>;
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
