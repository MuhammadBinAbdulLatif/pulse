'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { User } from '@prisma/client'

const NewProjectButton = ({user}: {user: User}) => {
    const router = useRouter()
    //WIP: Handle Click needs completion

  return (
    <Button size={'lg'} disabled={!user.subscription} className='rounded-lg font-semibold' onClick={()=> router.push('/create-page')}>
        <Plus  />
        New Project
    </Button>
  )
}

export default NewProjectButton
