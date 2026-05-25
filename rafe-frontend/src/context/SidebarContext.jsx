import { SidebarProvider as Provider } from '@/shared/components/ui/sidebar'

export function SidebarProvider({ children, ...props }) {
  return <Provider {...props}>{children}</Provider>
}
