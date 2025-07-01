import { getRecentProjects } from '@/actions/project'
import { onAuthenticateUser } from '@/actions/User'
import AppSidebar from '@/components/global/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = async({children}: Props) => {
    const recentProjects = await getRecentProjects()
    const checkUser = await onAuthenticateUser()
    if(!checkUser?.user) {
        redirect('/sign-in')
    }
  return (
   <SidebarProvider>
    <AppSidebar recentProjects={recentProjects?.data || []} user={checkUser.user} >

    </AppSidebar>
    {children}
   </SidebarProvider>
  )
}

export default Layout