import { User } from '@prisma/client'
import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import SearchBar from './searchbar'
import ThemeSwitcher from './theme-switcher'
import { Button } from '../ui/button'
import NewProjectButton from './new-project-button'

type Props = {
    user: User
}

const UpperInfoBar = ({user}: Props) => {
  return (
   <header className="sticky top-0 z-[10] flex flex-wrap items-center gap-2 border-b bg-background p-4 justify-between md:flex-nowrap">
  <SidebarTrigger className='-ml-1' />
  <Separator orientation='vertical' className='mr-2 h-4 hidden sm:block' /> {/* Hidden on small screens */}
  <SearchBar />
  <ThemeSwitcher />

  {/* Button Group for Import and Create */}
  <div className='flex gap-2 ml-auto'> {/* Pushes to the right, maintains spacing */}
    <Button className='bg-primary/80 rounded-lg dark:hover:bg-background light:hover:bg-gray-200 text-white font-semibold cursor-not-allowed text-sm px-3 py-2'>
      Import
    </Button>
    <NewProjectButton user={user} />
  </div>
</header>
  )
} 

export default UpperInfoBar