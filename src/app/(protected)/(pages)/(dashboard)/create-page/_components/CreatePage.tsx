'use client'
import usePromptStore from '@/stores/usePromptStore'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { containerVariants, CreatePageCard, itemVariants } from '@/constant/projects'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import RecentPrompts from '@/components/ai/recent-prompts'
type Props = {
    OnSelectOption: (option: string) => void

}

const CreatePage = ({OnSelectOption}: Props) => {
    const {setPage} = usePromptStore()
    useEffect(()=> {
        setPage('create')
    }, [])
    const {prompts} = usePromptStore()
  return <motion.div initial='hidden' animate="visible" className='space-y-8' variants={containerVariants}>
    <motion.div variants={itemVariants} className='text-center space-y-2'>
        <h1 className='text-4xl font-bold text-primary'>
            How would you like to get started
        </h1>
        <p className='text-secondary'>
            Choose your preferred method to begin
        </p>
    </motion.div>
    <motion.div variants={containerVariants} className='grid gap-6 md:grid-cols-3'>
        {CreatePageCard.map((option)=> (
           <motion.div
  variants={itemVariants}
  whileHover={{
    scale: 1.3,
    rotate: 1,
    transition: { duration: 0.1 },
  }}
  key={option.title}
  className={cn(
    'gradient-border-container', // Always apply the gradient container
    option.highlight ? '' : 'hover:bg-pulse', // Only apply hover effect if not highlighted
    'rounded-xl p-[1px] transition-all duration-300 ease-in-out'
  )}
>
                <motion.div className='w-full p-4 flex flex-col gap-y-6 items-start bg-white dark:bg-black rounded-xl' whileHover={{transition: {duration: 0.1}}}>
                    <div className="flex flex-col items-start w-full gap-y-3">
                        <div>
                            <p className='text-primary text-lg font-semibold'>
                                {option.title}
                            </p>
                            <p className={cn(option.highlight? 'text-pulse': 'text-primary', 'text-4xl font-bold')}>{option.highlightedText}</p>

                        </div>
                        <p className='text-secondary text-sm font-normal'>
                            {option.description}
                        </p>
                    </div>
                    <motion.div className='self-end' whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        
                        <Button variant={option.highlight ? 'default': 'outline'} className='w-fit rounded-xl font-bold' size={'sm'} onClick={()=> OnSelectOption(option.type)}>
                            {option.highlight?'Generate': 'Continue'}
                        </Button>
                        </motion.div>
            </motion.div>
                </motion.div>
        ))}
    </motion.div>
    {prompts.length > 0 && (
        <RecentPrompts />
    )}
  </motion.div>
}

export default CreatePage