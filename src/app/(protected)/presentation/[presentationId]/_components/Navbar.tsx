'use client'
import { Button } from '@/components/ui/button'
import { useSlideStore } from '@/stores/useSlideStore'
import { Home, PlayIcon, ShareIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
    presentationId: string
}

const Navbar = ({presentationId}: Props) => {
    const {currentTheme} = useSlideStore()
    const handleCopy = ()=> {
        navigator.clipboard.writeText(`${window.location.origin}/share/${presentationId}`)
        toast.success('Link Copied!', {
            description:'The link has been copied'
        })
    }
    
    const [isPresentationMode, setIsPresentationMode] = useState(false)
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between items-center py-4 px-7 border-b ' style={{backgroundColor: currentTheme.navbarColor, color: currentTheme.accentColor}}>
        <Link href={'/dashboard'} passHref>
         <Button variant={'outline'} className='flex items-center-safe' >
            <Home className='w-4 h-4' />
            <span className='hidden sm:inline'>
                Return home
            </span>
         </Button>
        </Link>
        <Link href={`/presentation/template-market`} className='text-lg font-semibold hidden sm:block'>
        Presentation Editor
        </Link>
         <div className='flex items-center gap-4'>
            <Button style={{
                backgroundColor: currentTheme.backgroundColor
            }} variant={'outline'} onClick={handleCopy}>
                <ShareIcon className='w-4 h-4'  />
            </Button>
            {/* WIP: add lemon squeezy sell templates */}
            <Button value={'default'} className='flex items-center gap-2' onClick={()=> setIsPresentationMode(true)}>
                <PlayIcon className='w-4 h-4' />
                <span className='hidden sm:inline'>Present</span>
            </Button>
        </div>
        {/* WIP add presentation mode */}
        {/* {isPresentationMode && <PresentationMode />} */}
    </nav>
  )
}

export default Navbar