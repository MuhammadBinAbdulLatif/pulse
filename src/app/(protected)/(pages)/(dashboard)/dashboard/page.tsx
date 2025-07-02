import { getAllProjects } from '@/actions/project'
import NotFound from '@/components/global/nof-found'
import ProjectsParent from '@/components/projects/projects-parenet'
import React from 'react'

async function Page() {
    // Get all the pages of the user so that you may show it
    const allProjects = await getAllProjects()
    console.log(allProjects)
    
  return (
    <div className='w-full flex flex-col gap-6 relative p-4'>
      <div className="flex flex-col-reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center">

        <div className="flex flex-col item-start">
            <h1 className='text-2xl font-semibold dark:text-primary backdrop-blur-lg'>
                Projects
            </h1>
            <p className='text-base font-normal text-primary dark:text-secondary'>
                All of your work in one place
            </p>
        </div>
      </div>
      {/* Projects */}
     {allProjects?.data && allProjects.data.length > 0? <ProjectsParent projects={allProjects.data} />: <NotFound /> }
    </div>
  )
}

export default Page
