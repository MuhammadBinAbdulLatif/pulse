'use client'
import { Project, User } from '@prisma/client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Image from 'next/image';
import NavMain from './nav-main';
import { data } from '@/constant/nav-link';
import RecentlyOpened from './recently-opened';
import NavFooter from './nav-footer';
type Props = {
    recentProjects: Project[] | [];
    user: User

} & React.ComponentProps<typeof Sidebar>
function AppSidebar({recentProjects, user,...props}:Props ) {
  return (
   <Sidebar collapsible='icon' {...props} className='max-w-[212px] bg-background-90'>
    <SidebarHeader className='pt-6 px-1 pb-0'>
        <SidebarMenuButton size={'lg'} className='data-[state=open]:text-accent-foreground'>
  <div className="flex flex-row items-center gap-x-4 text-sidebar-primary-foreground">
    <Image
      src="/pulse.svg"
      alt="Pulse logo"
      width={40}
      height={40}
      className="h-10 w-10 text-primary"
    />
    <h1 className='text-primary text-3xl font-bold'>
      Pulse
    </h1>
  </div>
  <span className='truncate text-primary text-3xl font-semibold'></span>
</SidebarMenuButton>
    </SidebarHeader>
      <SidebarContent className='px-3 mt-10 gap-y-6'>
        <NavMain items={data.navMain} />
        <RecentlyOpened recentProjects={recentProjects} />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter prismaUser={user} />
      </SidebarFooter>
   </Sidebar>
  )
}

export default AppSidebar
