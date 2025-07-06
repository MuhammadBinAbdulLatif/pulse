import { generateLayouts } from '@/actions/ai'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Theme } from '@/lib/types'
import { useSlideStore } from '@/stores/useSlideStore'
import { Loader2, Wand } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
type Props = {
    selectedTheme: Theme
    themes: Theme[]
    onThemeSelect: (theme: Theme) => void
}

const ThemePicker = ({onThemeSelect,selectedTheme,themes}: Props) => {
   const {currentTheme,project,setSlides } = useSlideStore()
   const params= useParams()
  const handleGenerateLayouts = async ()=> {
    setLoading(true)
    if(!selectedTheme) {
      toast.error("Error", {
        description: 'A theme must be selected'
      })
      setLoading(false)
      return 
    }
    if(project?.id === '' || !project?.id){
      toast.error('Eror', {
        description: 'No project exists'
      })
      setLoading(false)
      return
    }
    try {
      const res = await generateLayouts(params.presentationId as string, currentTheme.name )
      if (
        res.status !== 200 &&
        res.data === undefined
      ) {
        toast.error('Error',  {
          description: res.error || 'An error occurred'
        })
        throw new Error('Failed to generate layouts')
        
      }
      toast.success('Success', {
        description: 'Layouts generated successfully'
      })

      router.push(`/presentation/${project.id}`)
      
        setSlides(res.data)
    } catch (error) {
      console.error('An errro occured while trying to generate layout', error)
    } finally {
      setLoading(false)
    }

  }
  const router = useRouter()
 
  const [loading, setLoading] = useState(false)
  return (
    <div className='w-[400px] sticky top-0 flex flex-col' style={{
      backgroundColor: selectedTheme.sidebarColor || selectedTheme.backgroundColor,
      borderLeft: `1px solid ${selectedTheme.accentColor}20`
    }}>
<div className="p-8  space-y-6 flex-shrink-0">
<div className="space-y-2">
  <h2 className='text-3xl font-bold tracking-right' style={{color: selectedTheme.accentColor}}>
    Pick a theme
  </h2>
  <p className='text-sm' style={{color: `${selectedTheme.accentColor}80`}}>
    Choose from our curated collection or generate a custom theme
  </p>
</div>
<Button className='w-full h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300' onClick={ handleGenerateLayouts} style={{backgroundColor: selectedTheme.accentColor, color: selectedTheme.backgroundColor}}>
  {loading ? <Loader2 className='mr-2 h-5 w-5 animate-spin' />:  <Wand className='mr-2 h-5 w-5' />}
  {loading ? (
    <p className='animate-pulse'>
      Generating
    </p>
  ): (
    'Generate Theme'
  )}
</Button>
</div>
<ScrollArea className='flex-1 h-[600px] px-8 pb-8'>
  <div className='grid grid-cols-1 gap-4'>
    {
      themes.map((theme)=> (
        <motion.div key={theme.name} whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
          <Button className='flex flex-col itmes-center justify-start p-6 w-full h-auto
          ' onClick={()=> onThemeSelect(theme)}
          style={{
            fontFamily: theme.fontFamily,
            color: theme.fontColor,
            background: theme.gradientBackground || theme.backgroundColor
          }}>
            <div className='w-full flex items-center justify-between'>
              <span className='text-xl font-bold'>
                {theme.name}
              </span>
            </div>
            
          </Button>
        </motion.div>
      ))
    }
  </div>
</ScrollArea>
    </div>
  )
}

export default ThemePicker