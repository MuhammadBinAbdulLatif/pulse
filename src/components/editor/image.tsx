'use client'

import { cn } from "@/lib/utils"
import React from "react"

interface ImageComponentProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string
    styles?: React.CSSProperties
    isPreview?: boolean // Might be used to change behavior or styling in preview mode
    src?: string
    alt?: string
}

export const ImageComponent = React.forwardRef<HTMLImageElement, ImageComponentProps>(
    ({ className, styles, isPreview, src, alt, ...props }, ref) => {
        if (!src) {
            if (isPreview) return null // Don't show anything in preview if no src
            return (
                <div className={cn("w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md", className)}>
                    No image source provided.
                </div>
            )
        }

        return (
            <img
                ref={ref}
                src={src}
                alt={alt || "presentation image"}
                className={cn(
                    "w-full h-auto object-contain max-w-full", // Default sensible styling
                    "rounded-md", // Add rounded corners by default
                    className // Allow overriding via props
                )}
                style={{
                    display: 'block', // Ensure it behaves as a block element
                    ...styles
                }}
                {...props}
            />
        )
    }
)

ImageComponent.displayName = 'ImageComponent'
