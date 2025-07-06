'use client'

import { cn } from "@/lib/utils"
import React, { useEffect, useRef } from "react"

interface TextProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{
    className?: string
    styles?: React.CSSProperties
    isPreview?: boolean
}

// Generic Text Area for multiline text input, similar to Headings
const createTextComponent = (displayName: string, defaultClassName: string) => {
    const Text = React.forwardRef<HTMLTextAreaElement, TextProps>(({className, styles, isPreview = false, ...props}, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null)

        useEffect(() => {
            const textarea = textareaRef.current
            if (textarea && !isPreview) {
                const adjustHeight = () => {
                    textarea.style.height = 'auto' // Reset height to auto to correctly calculate scrollHeight
                    textarea.style.height = `${textarea.scrollHeight}px`
                }
                textarea.addEventListener('input', adjustHeight)
                adjustHeight() // Initial adjustment

                // Adjust height on window resize
                window.addEventListener('resize', adjustHeight)

                return () => {
                    textarea.removeEventListener('input', adjustHeight)
                    window.removeEventListener('resize', adjustHeight)
                }
            }
        }, [isPreview])

        const previewSpecificClassName = isPreview ? 'text-xs' : '' // Example preview style, can be adjusted

        return <textarea
            className={cn(
                `w-full bg-transparent ${defaultClassName} ${previewSpecificClassName} font-normal placeholder:text-gray-300 focus:outline-none resize-none overflow-hidden leading-relaxed`,
                className
            )}
            style={{
                padding: 0,
                margin: 0,
                color: 'inherit', // Inherit color from parent (theme)
                boxSizing: 'content-box',
                lineHeight: '1.6em', // Slightly more leading for paragraphs
                minHeight: '1.6em',
                ...styles
            }}
            ref={(el) => {
                (textareaRef.current as HTMLTextAreaElement | null) = el;
                if (typeof ref === 'function') ref(el)
                else if (ref) ref.current = el
            }}
            readOnly={isPreview}
            {...props}
        />
    })
    Text.displayName = displayName
    return Text
}

export const Paragraph = createTextComponent('Paragraph', 'text-base')
export const TextBlock = createTextComponent('TextBlock', 'text-base') // Could have different default styles if needed
// Add other text components here if necessary, e.g., Blockquote
export const Blockquote = createTextComponent('Blockquote', 'text-base italic border-l-4 border-gray-300 pl-4 py-2')
