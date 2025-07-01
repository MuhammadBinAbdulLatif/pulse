import { Project } from '@prisma/client'
import React from 'react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Button } from '../ui/button'
import { JsonValue } from '@prisma/client/runtime/library'
import { toast } from 'sonner'
import { useRouter } from 'next/router'

type Props = {
    recentProjects: Project[]
}

const RecentlyOpened = ({recentProjects}: Props) => {
    const router = useRouter()
    const handleClick = (projectId:string, slides:JsonValue) => {
        if(!projectId || !slides){
            toast.error('Project not found')
            return
        }
        setSlides(JSON.parse(JSON.stringify(slides)))
        router.push(`/presentation/${projectId}`)
    }
  return recentProjects.length > 0? (
     <SidebarGroup>
        <SidebarGroupLabel>
            Recently Opened
        </SidebarGroupLabel>
        <SidebarMenu>
             {recentProjects.map((project)=> (
                <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild tooltip={project.title} className='hover:bg-primary-80'>
                    <Button variant={'link'} className='text-xs items-center justify-start' onClick={()=> handleClick(project.id, project.slides) }>
                        <span>{project.title}</span>     
                    </Button>
                </SidebarMenuButton>
            </SidebarMenuItem>
             ))}
        </SidebarMenu>
    </SidebarGroup>
  ): (
    <>
    
    </>
  )
   
}

export default RecentlyOpened