import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const themeContext = useTheme()
  const theme = themeContext?.theme || "system"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-black" />
        ),
        info: (
          <InfoIcon className="size-4 text-black" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-black" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-black" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-zinc-500" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg group-[.toaster]:p-4 group-[.toaster]:rounded-xl group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-3 group-[.toaster]:border",
          description: "group-[.toast]:text-zinc-500 text-xs",
          actionButton:
            "group-[.toast]:bg-black group-[.toast]:text-white group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-semibold hover:bg-black/90 cursor-pointer transition-all border-none focus:outline-none",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
