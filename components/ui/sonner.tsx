"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#121212] group-[.toaster]:text-[#e5e2e1] group-[.toaster]:border-[rgba(255,255,255,0.08)] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[#71717a]",
          actionButton:
            "group-[.toast]:bg-[#d946ef] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[rgba(255,255,255,0.05)] group-[.toast]:text-[#e5e2e1]",
          error: "group-[.toast]:border-[rgba(239,68,68,0.3)]",
          success: "group-[.toast]:border-[rgba(34,197,94,0.3)]",
        },
        style: {
          fontFamily: "'Inter', sans-serif",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
