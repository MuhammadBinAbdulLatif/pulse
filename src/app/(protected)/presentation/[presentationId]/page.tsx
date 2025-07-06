'use client'
import { getProjectById } from '@/actions/project'
import { themes } from '@/constant/theme'
import { useSlideStore } from '@/stores/useSlideStore'
import { Loader2 } from 'lucide-react'
import {DndProvider} from 'react-dnd'
import { useTheme } from 'next-themes'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {HTML5Backend} from 'react-dnd-html5-backend'
import Navbar from './_components/Navbar'
import LayoutPreview from './_components/LayoutPreview'
import Editor from './_components/Editor'
type Props = {
    params: Promise<{
        presentationId: string
    }>
}

const Page = ({params}: Props) => {
    const {slides, setSlides, setProject, currentTheme, setCurrentTheme} = useSlideStore()
    const {presentationId} = React.use(params)
    const {setTheme} = useTheme()
    const [isLoading, setIsLoading] = useState(true)
    const [isEditable, setIsEditable] = useState(true)
    useEffect(()=> {
        (async ()=> {
            try {
                const res = await getProjectById(presentationId)
                if(res.status !== 200){
                    toast.error('Error', {
                        description: res.message || 'An error occurred'
                    })
                    redirect('/dashboard')
                }
                const findTheme = themes.find((theme)=> theme.name === res.data?.themeName)
                setCurrentTheme(findTheme || themes[0])
                
            } catch (error) {
                console.error('An error occured in presentation/[presentationId]', error)
                toast.error('Error',{
                    description: 'An unexpected error occurred'
                })
            } finally {
                setIsLoading(false)
            }
        })()
    }, [presentationId, setCurrentTheme]) 
    if(isLoading) {
        return <div className='flex items-center justify-center h-screen'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
    }
  return (
    <DndProvider backend={HTML5Backend}>
        <div className='min-h-screen flex flex-col'>
            <Navbar presentationId={presentationId} />
            <div className='flex-1 flex overflow-hidden pt-16' style={{color: currentTheme.accentColor, fontFamily: currentTheme.fontFamily, backgroundColor: currentTheme.backgroundColor}}>
                <LayoutPreview />
                <div className='flex-1 ml-64 pr-16'>
                <Editor isEditable={isEditable} />
            </div>
            </div>
            
        </div>

    </DndProvider>
  )
}

export default Page