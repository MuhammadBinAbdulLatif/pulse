'use client'
import React from 'react'
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Clock, LucideProps } from 'lucide-react'

type Props = {
    items: {
        title: string
        url: string
        icon: React.ForwardRefExoticComponent<Omit<LucideProps , "ref"> & React.RefAttributes<SVGSVGElement>>;
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}

const NavMain = ({items}: Props) => {
    const pathname = usePathname()
  return (
    <SidebarGroup>
        <SidebarMenu>
  {items.map((item) => (
    <SidebarMenuItem className='mb-4' key={item.title}> {/* Changed gap-y-4 to mb-4 for margin-bottom */}
      <SidebarMenuButton asChild tooltip={item.title} className={`${pathname.includes(item.url) && 'bg-primary'}`}>
        <Link href={item.url} className={cn('text-xl py-3', pathname.includes(item.title) && 'font-bold')}> {/* Increased vertical padding to py-3 */}
          <item.icon className='w-8 h-8 mr-3' />
          <span className=''>
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain