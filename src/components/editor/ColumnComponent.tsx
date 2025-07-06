import { ContentItem } from '@/lib/types';
import React, { useEffect, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { cn } from '@/lib/utils';
import { MasterRecursiveComponent } from '@/app/(protected)/presentation/[presentationId]/_components/MasterRecursiveComponent';
import { v4 } from 'uuid';

type Props = {
  content: ContentItem[];
  className?: string;
  isPreview?: boolean;
  slideId: string;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
  isEditable?: boolean;
}

const ColumnComponent = ({content,
    onContentChange,slideId,
    className,isEditable,isPreview
}: Props) => {
    const [columns, setColumns] = useState<ContentItem[]>([])
    const createDefaultColumns = (count: number) => {
        return Array(count).fill(null).map(()=> ({
            id: v4(),
            type: 'paragraph' as const,
            name: 'Paragraph',
            content: '',
            placeholder: 'Start typing ...'
        }))
    }
    useEffect(()=> {
        if(content.length === 0 ){
            setColumns(createDefaultColumns(2))
        }
    }, [setColumns, content.length])
  return (
    <div className='relative w-full h-full '>
        <ResizablePanelGroup direction='horizontal' className={cn('h-full w-full flex ', !isEditable && '!border-0', className)}>
            {columns.map((item, idx)=> (
                <React.Fragment key={item.id} >
                    <ResizablePanel minSize={20} defaultSize={100  / columns.length}>
                    <div className={cn('h-full w-full', item.className)}>
                        <MasterRecursiveComponent content={item} isPreview={isPreview} onContentChange={onContentChange} slideId={slideId} isEditable={isEditable} />
                    </div>
                    </ResizablePanel>
                    {idx < columns.length  - 1 && isEditable && (
                        <ResizableHandle withHandle={!isPreview} />
                    )}
                </React.Fragment>
            ))}

        </ResizablePanelGroup>
    </div>
  )
}

export default ColumnComponent