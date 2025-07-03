'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import usePromptStore from '@/stores/usePromptStore'
import CreatePage from './CreatePage'
import CreativeAiPage from './CreativeAiPage'
import ScratchPage from './ScratchPage'
const RenderPage = () => {
    const router = useRouter()
    const {page,setPage} = usePromptStore()
    const handleBack = ()=> {
        setPage('create')
    }
    const OnSelectOption = (option: string)=> {
        if(option === 'template'){
            router.push('/templates')
        }
        if(option === 'create-scratch'){
            setPage('create-scratch')
        }
        if(option === 'creative-ai'){
            setPage('creative-ai')
        }
    }
    const renderStep = ()=> {
        switch(page){
            case 'create':
                return <CreatePage OnSelectOption={OnSelectOption} />
            case 'create-scratch':
                return <ScratchPage onBack={handleBack} />
            case 'creative-ai':
                return <CreativeAiPage onBack={handleBack} />
            default: 
                return null
        }
    }
  return <AnimatePresence mode='wait'>
    <motion.div key={page} initial={{opacity: 0, x:20}} animate={{opacity: 1, x:0}} exit={{opacity: 0, x:-20}} transition={{duration: 0.3}}>
        {renderStep()}
    </motion.div>

  </AnimatePresence>
}

export default RenderPage
