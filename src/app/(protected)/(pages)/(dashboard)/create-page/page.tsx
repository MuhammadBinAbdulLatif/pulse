import React, { Suspense } from 'react'
import CreatePageSkeletion from './_components/CreatePageSkeletion'

const Page = () => {
  return (
    <main className='w-full h-full p-4'>
        <Suspense fallback={<CreatePageSkeletion/>}>
        
        </Suspense>
    </main>
  )
}

export default Page
