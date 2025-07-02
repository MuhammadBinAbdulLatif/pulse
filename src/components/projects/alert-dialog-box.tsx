import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
type Props = {
    children: React.ReactNode
    className: string
    description: string
    loading: boolean
    onClick: ()=> void
    open: boolean
    handleOpen: ()=> void
}
const AlertDialogBox = ({children,className,description,handleOpen,loading,onClick,open}:Props) => {
  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogTrigger asChild>
       {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction><Button variant={'default'} className={className} onClick={onClick}>
            {loading ? (<><Loader2 className='animate-spin'/> Loading</>): ('Continue')}
            </Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogBox
