import { RouterProvider } from 'react-router-dom'
import { TooltipProvider } from '@/shared/components/ui/tooltip'
import { Toaster } from '@/shared/components/ui/sonner'
import { router } from '@/router/router'

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
