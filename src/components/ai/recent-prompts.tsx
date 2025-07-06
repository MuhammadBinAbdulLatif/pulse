'use client'
import usePromptStore from '@/stores/usePromptStore'
import React from 'react'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '@/constant/projects'
import { Card } from '../ui/card'
import { timeAgo } from '@/lib/utils'
import { Button } from '../ui/button'
import useCreativeAiStore from '@/stores/useCreativeAiStore'
import { toast } from 'sonner'

const RecentPrompts = () => {
    const {setCurrentAiPrompt,addMultipleOutlines} = useCreativeAiStore()
    const handleEdit = (id: string)=> {
        if(!id){
            throw new Error('id not given')
        }
        const prompt = prompts.find((prompt)=> prompt.id === id )
        if(prompt){
            setPage('creative-ai')
            addMultipleOutlines(prompt.outlines)
            setCurrentAiPrompt(prompt.title)
        } else{
            toast.error('Error', {
                description: 'Prompt Not Found'
            })
        }
    }
    const {prompts, setPage} = usePromptStore()
  return <motion.div variants={containerVariants} className='space-y-4 mt-20'>
    <motion.h2 variants={itemVariants} className='text-2xl font-semibold text-center'>
        Your Recent Prompts
    </motion.h2>
    <motion.div variants={containerVariants} className='space-y-2 w-full lg:max-w-[80%] mx-auto'>
        {prompts.map((prompt, idx)=> (
            <motion.div key={idx} variants={itemVariants}>
            <Card className='p-3 flex items-center md:items-start mx-3 justify-between hover:bg-accent/50 transition-colors duration-300'>
            <div className='max-w-[70%]'>
                <h3 className='font-semibold text-xl line-clamp-1'>
                    {prompt.title}
                </h3>
                <p className='font-semibold text-sm text-muted-foreground'>
                    {timeAgo(prompt.createdAt.toString())}
                </p>
            </div>
            <div className='flex items-center gap-4'>
                <span className='text-sm text-pulse'>
                    Creative AI
                </span>
                <Button className='rounded-xl bg-primary dark:hover:bg-gray-700 hover:bg-gray-200 text-secondary' variant={'default'} size={'sm'} onClick={()=> handleEdit(prompt?.id)}>
                    Edit
                </Button>
            </div>
            </Card>
            </motion.div>
        ))}
    </motion.div>
  </motion.div>
}

export default RecentPrompts