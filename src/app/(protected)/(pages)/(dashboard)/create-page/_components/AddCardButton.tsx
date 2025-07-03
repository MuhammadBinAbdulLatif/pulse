'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

type Props = {
  onAddCard: () => void
}

const AddCardButton = ({ onAddCard }: Props) => {
  const [showGap, setShowGap] = useState(false)

  return (
    <motion.div
      className="w-full relative overflow-hidden"
      initial={{ height: '0.5rem' }}
      animate={{
        height: showGap ? '2rem' : '0.5rem',
        transition: { duration: 0.3, ease: 'easeInOut' },
      }}
      onHoverStart={() => setShowGap(true)}
      onHoverEnd={() => setShowGap(false)}
    >
      <AnimatePresence>
        {showGap && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-[40%] h-[1px] bg-primary">
              <Button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary"
                aria-label="Add new card"
                size={'sm'}
                variant={'outline'}
                onClick={onAddCard}
              >
                <Plus className="h-4 w-4 text-white" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AddCardButton
