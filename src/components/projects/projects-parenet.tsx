import { Project } from '@prisma/client'
import React from 'react'
import ProjectCard from './project-card'
type Props = {
    projects: Project[]
}

const ProjectsParent = ({projects}: Props) => {
  return <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
       {projects.map((project)=> (
        <ProjectCard project={project} key={project.id} />
       ))}
    </div>

}

export default ProjectsParent