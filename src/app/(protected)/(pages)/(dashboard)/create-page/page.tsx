
import React, { Suspense } from 'react'
import CreatePageSkeletion from './_components/CreatePageSkeletion'
import RenderPage from './_components/RenderPage'
import { onAuthenticateUser } from '@/actions/User'
import { redirect } from 'next/navigation'

const Page = async() => {
   const checkUser = await onAuthenticateUser()
   if(!checkUser?.user){
    redirect('/sign-in')
   }
   if(!checkUser.user.subscription){
     redirect('/dashboard')
   }
  return (
    <main className='w-full h-full p-4'>
        <Suspense fallback={<CreatePageSkeletion/>}>
        <RenderPage />
        </Suspense>
    </main>
  )
}

export default Page
