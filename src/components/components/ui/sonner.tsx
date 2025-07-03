import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"light"}
      position="top-right"
      className="toaster group !text-white"
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "#fff",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
