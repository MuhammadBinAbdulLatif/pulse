'use client'
import { OutlineCard } from '@/lib/types'
import React, { useRef, useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { containerVariants } from '@/constant/projects'
import OutlinesCard from './OutlinesCard'
import AddCardButton from './AddCardButton'
import {v4 as uuidv4} from 'uuid'
import useScratchStore from '@/stores/useScratchStore'
type Props = {
    outlines: OutlineCard[]
    editingCard: string | null
    selectedCard: string | null
    editText: string 
    addOutline?: (card: OutlineCard) => void
    onEditChange: (value: string)=> void
    onCardSelect: (value: string)=> void
    setEditText: (value: string) => void
    setEditingCard: (id: string | null)=> void
    setSelectedCard: (id: string | null)=> void
    addMultipleOutlines: (cards: OutlineCard[])=> void
    onCardDoubleClick: (id: string, title: string)=> void
}

const CardList = ({addMultipleOutlines,editText,editingCard,onCardSelect,onEditChange,outlines,selectedCard,setEditText,setEditingCard,setSelectedCard,}: Props) => {
    const [draggedItem, setDraggedItem] = useState<OutlineCard | null>
    (null)
    const [dragOverIndex, setDragOverIndex] = useState<number|null>(null)
    const dragOffsetY = useRef<number>(0)
    const {addOutline} = useScratchStore()

    const onDragOver = (e:React.DragEvent,index:number)=> {
        e.preventDefault()
        if(!draggedItem) return 
        const rect = e.currentTarget.getBoundingClientRect()
        const y = e.clientY - rect.top
        const threshold = rect.height / 2
        if(y<threshold){
            setDragOverIndex(index)
        } else {
            setDragOverIndex(index + 1)
        }
    }
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if(!draggedItem || dragOverIndex === null  ) return 
        const updatedCards=  [...outlines]
        const draggedIndex = updatedCards.findIndex((card)=> card.id === draggedItem.id)
        if(draggedIndex === -1 || draggedIndex  === dragOverIndex) return
        const [removeCard] = updatedCards.splice(draggedIndex,1)
        updatedCards.splice(dragOverIndex > draggedIndex ? dragOverIndex -1:dragOverIndex, 0, removeCard  )
        addMultipleOutlines(updatedCards.map((card,idx)=> ({
            ...card, order:idx+1
        })))
        setDraggedItem(null)
        setDragOverIndex(null)

    }
    const onCardUpdate = (id: string, newTitle: string)=> {
        addMultipleOutlines(outlines.map((card)=> (card.id === id ? {...card, title: newTitle}: card )))
        setEditText('')
        setEditingCard(null)
        setSelectedCard(null )
    }
    const onCardDelete = (id: string) => {
        addMultipleOutlines(outlines.filter((card)=> card.id !== id).map((card,ix)=> ({
            ...card,
            order: ix +1
        })))

    }

    const onDragStart= (e:React.DragEvent, card: OutlineCard)=> {
        setDraggedItem(card)
        e.dataTransfer.effectAllowed = 'move'
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        dragOffsetY.current = e.clientY - rect.top
        const draggedEl = e.currentTarget.cloneNode(true) as HTMLElement
        draggedEl.style.position = 'absolute'
        draggedEl.style.top = '-1000px'
        draggedEl.style.opacity  = '0.8'
        draggedEl.style.width = `${(e.currentTarget as HTMLElement).offsetWidth}px`
        document.body.appendChild(draggedEl)
        e.dataTransfer.setDragImage(draggedEl, 0, dragOffsetY.current)
        setTimeout(()=> {
            setDragOverIndex(outlines.findIndex((c)=> c.id === card.id))
            document.body.removeChild(draggedEl)
        }, 0)


    }

    const onDragEnd = ()=> {
        setDraggedItem(null)
        setDragOverIndex(null)
    }
    const getDragOverStyes = (cardIndex:number) => {
        if(dragOverIndex === null || draggedItem === null) return {

        }
        if(cardIndex === dragOverIndex) {
            return {
                borderTop: '2px solid #000',
                marginTop: '0.5rem',
                transition: 'margin 0.2s cubicbezier(0.25,0.1,0.25,1)'
            }
        } else if(cardIndex === dragOverIndex - 1){
            return {
                borderTop: '2px solid #000',
                marginTop: '0.5rem',
                transition: 'margin 0.2s cubicbezier(0.25,0.1,0.25,1)'
            }
        }
        return {

        }
         
    }
    const onAddCard = (cardIndex?: number) => {
        const newCard: OutlineCard = {
            id: uuidv4(),
            title: 'New Section',
            order: 0 // will be set below
        };
        let updatedCards;
        if (typeof cardIndex === 'number') {
            updatedCards = [
                ...outlines.slice(0, cardIndex + 1),
                newCard,
                ...outlines.slice(cardIndex + 1)
            ];
        } else {
            updatedCards = [...outlines, newCard];
        }
        updatedCards = updatedCards.map((card, idx) => ({ ...card, order: idx + 1 }));
        addMultipleOutlines(updatedCards);
    };
      return (
   <motion.div layout onDragOver={(e)=> {
    e.preventDefault()
    if(outlines.length === 0 || e.clientY > e.currentTarget.getBoundingClientRect().bottom - 20
    ) {
        onDragOver(e, outlines.length )
    }
   }} onDrop={(e)=> {
    e.preventDefault()
    onDrop(e)

   }}  variants={containerVariants} className='space-y-2 -my-2'>
    <AnimatePresence>
        {outlines.map((card, idx)=> (
            <React.Fragment key={idx}>
                <OutlinesCard onDragOver={(e)=> onDragOver(e, idx)}  card={card} 
                isEditing={editingCard === card.id}
                isSelected={selectedCard === card.id}
                editText={editText}
                onEditChange={onEditChange}
                onEditBlur={()=> onCardUpdate(card.id, editText)}
                onEditKeyDown={(e)=> {
                    if(e.key === 'enter') {
                        onCardUpdate(card.id, editText)
                    }
                }}
                onCardClick={()=> onCardSelect(card.id) }
                onCardDoubleClick={() => { // Corrected line
    setEditingCard(card.id);
    setEditText(card.title);
  }}
                onDeleteClick={()=> onCardDelete(card.id)}
                dragHandlers={{
                    onDragEnd: onDragEnd,
                    onDragStart: (e)=> onDragStart(e, card)
                }}
                dragOverStyles={getDragOverStyes(idx)} 
                />
                <AddCardButton onAddCard={() => onAddCard(idx)} />
            </React.Fragment>
        ))}
    </AnimatePresence>

   </motion.div>
  )
}

export default CardList