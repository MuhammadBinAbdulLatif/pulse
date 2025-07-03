'use client'
import React, { Suspense } from 'react'
import CreatePageSkeletion from './_components/CreatePageSkeletion'
import RenderPage from './_components/RenderPage'

const Page = () => {
  return (
    <main className='w-full h-full p-4'>
        <Suspense fallback={<CreatePageSkeletion/>}>
        <RenderPage />
        </Suspense>
    </main>
  )
}

export default Page
