'use client'

import { cn } from "@/lib/utils"
import React, { useEffect, useRef } from "react"
interface HeadingProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{
    className?: string
    styles?: React.CSSProperties
    isPreview?: boolean
}
const createHeading = (displayName: string,defaultClassName: string ) => {
    const Heading = React.forwardRef<HTMLTextAreaElement, HeadingProps>(({className,styles,isPreview=false,...prop}, ref)=> {
        const textareaRef = useRef<HTMLTextAreaElement>(null)
        useEffect(()=> {
            const textarea = textareaRef.current
            if(textarea && !isPreview) {
               const adjustHeight = ()=> {
                 textarea.style.height = '0'
                textarea.style.height = `${textarea.scrollHeight}px`
               }
                textarea.addEventListener('input', adjustHeight)
                adjustHeight()
                return()=> textarea.removeEventListener('input', adjustHeight)
            }
        }, [isPreview])
        const previewClassName= isPreview ? 'text-xs': ''
        return <textarea className={cn(`w-full bg-transparent ${defaultClassName} ${previewClassName} font-normal text-gray-900 placeholder:text-gray-300 focus:outline-none resize-none overflow-hidden leading-tight`, className )} style={{
            padding:0,
            margin: 0,
            color: 'inherit',
            boxSizing: 'content-box',
            lineHeight: '1.2em',
            minHeight: '1.2em',
            ...styles
        }} ref={(el)=>{
            (textareaRef.current as HTMLTextAreaElement | null) = el;
            if (typeof ref === 'function') ref(el)
            else if (ref) ref.current = el
        }} readOnly={isPreview} {...prop}>

        </textarea>
    })
    Heading.displayName = displayName
    return Heading
}
export const Heading1 = createHeading('Heading1', 'text-4xl') 
export const Heading2 = createHeading('Heading2', 'text-3xl') 
export const Heading3 = createHeading('Heading3', 'text-2xl') 
export const Heading4 = createHeading('Heading4', 'text-xl') 
export const Title = createHeading('Title', 'text-5xl')