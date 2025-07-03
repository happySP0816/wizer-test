import React from "react"
import { cn } from "@/components/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Loading: React.FC<LoadingProps> = ({ className, style, children, ...props }) => {
    return (
        <div className="flex justify-center items-center py-20 gap-0.5" style={style} {...props}>
            <div className={cn("animate-spin rounded-full h-12 w-12 border-b-2 border-primary", className)}></div>
            {children}
        </div>
    )
}

export default Loading