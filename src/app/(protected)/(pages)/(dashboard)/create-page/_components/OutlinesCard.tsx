'use client'
import { OutlineCard } from '@/lib/types'
import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
type Props = {
    card: OutlineCard
    isEditing: boolean
    isSelected: boolean
    editText: string
    onEditChange: (value: string )=> void
    onEditBlur: ()=> void
    onEditKeyDown: (e: React.KeyboardEvent) => void
    onCardClick: ()=> void
    onCardDoubleClick: ()=> void
    onDeleteClick: ()=> void
    dragHandlers: {
        onDragStart: (e: React.DragEvent)=> void
        onDragEnd: ()=> void
    }
    onDragOver: (e: React.DragEvent)=> void
    dragOverStyles: React.CSSProperties
}

const OutlinesCard = ({card,dragHandlers,dragOverStyles,editText,isEditing,isSelected,onCardClick,onCardDoubleClick,onDeleteClick,onDragOver,onEditBlur,onEditChange,onEditKeyDown}: Props) => {
    const inputRef = useRef<HTMLInputElement>(null)
    
    useEffect(() => {
        if (!isEditing) return;
        function handleClickOutside(event: MouseEvent) {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                onEditBlur();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing, onEditBlur]);

  return (
    <motion.div onClick={onCardClick} onDoubleClick={onCardDoubleClick} layout initial={{opacity: 0, y:20}} animate={{opacity:1, y:0}} exit={{opacity: 0, y:-20}} transition={{stiffness: 500, type: 'spring', damping: 30, mass: 1}}
    className='relative'>
        <div draggable style={dragOverStyles} {...dragHandlers} onDragOver={onDragOver}>
            <Card className={cn('p-4 cursor-grab active:cursor-grabbing bg-primary/10', isEditing || isSelected ? 'bg-secondary dark:text-black': '' )}>
            <div className='flex justify-between items-center'>
                {isEditing ? (
                    <Input ref={inputRef} className='text-white' value={editText} onChange={(e)=> onEditChange(e.target.value)} onKeyDown={onEditKeyDown} />
                ): (
                    <div className="flex items-center gap-2">
                <span className={cn('text-base sm:text-lg py-1 px-4 rounded-xl bg-primary', isEditing || isSelected ? 
                    'bg-secondary dark:text-black': ''
                )}>
                    {card.order}
                </span>
                <span className='text-base sm:text-lg'>
                    {card.title}
                </span>
            </div>
                )}
                <Button variant={'ghost'} size={'icon'} onClick={(e)=> {
                    e.stopPropagation()
                    onDeleteClick()
                }} aria-label={`Delete card ${card.order}`}>
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>
            </Card>
        </div>
    </motion.div>
  )
}

export default OutlinesCard