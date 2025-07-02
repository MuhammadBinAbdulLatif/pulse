import { FileX } from 'lucide-react'
import React from 'react'
import NewProjectButton from './new-project-button'
import { onAuthenticateUser } from '@/actions/User'
import { redirect } from 'next/navigation'

const NotFound = async () => {
  const checkUser = await onAuthenticateUser()
      if(!checkUser?.user) {
          redirect('/sign-in')
      }
  return (
    <div className='flex flex-col min-h-[70vh] w-full justify-center items-center gap-12'>
        <FileX size={70} />
        <div className="flex flex-col items-center justify-center text-center gap-3">
  <p className="text-3xl font-semibold text-primary">
    Nothing to see here
  </p>
  <p className="text-3xl font-semibold text-primary">
    Create some projects to get started
  </p>
  <NewProjectButton user={checkUser.user} />
</div>

    </div>
  )
}

export default NotFound
