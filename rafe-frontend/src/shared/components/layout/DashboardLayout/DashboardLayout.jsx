import { Outlet, useLocation, Link } from 'react-router-dom'
import * as Collapsible from '@radix-ui/react-collapsible'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarGroup,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton
} from '@/shared/components/ui/sidebar'
import {
  LayoutDashboard, ShoppingCart, Package,
  Users, BarChart2, UserCog, Settings, ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader as SheetHeaderComponent,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet'
import { CompanySelector } from './CompanySelector'
import { SearchButton } from '@/shared/components/ui/search-button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command"

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Vendas', icon: ShoppingCart, children: [
      { label: 'Ponto de Venda', path: '/pos' },
      { label: 'Facturas', path: '/invoicing' },
    ]
  },
  {
    label: 'Produtos', icon: Package, children: [
      { label: 'Lista', path: '/products' },
    ]
  },
  {
    label: 'Clientes', icon: Users, children: [
      { label: 'Lista', path: '/clients' },
    ]
  },
  {
    label: 'Finanças', icon: BarChart2, children: [
      { label: 'Relatórios', path: '/finances' },
    ]
  },
  { label: 'Utilizadores', path: '/users', icon: UserCog },
  { label: 'Configurações', path: '/settings', icon: Settings },
]

export function DashboardLayout() {
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({})
  const [searchOpen, setSearchOpen] = useState(false)

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 sticky top-0 z-20 bg-sidebar">
          <div className="flex flex-col gap-2">
            <div className="-mx-4 px-4 pb-2 border-b border-sidebar-border">
              <Sheet>
                <SheetTrigger asChild>
                  <CompanySelector companyName="Rafe" plan="Enterprise" />
                </SheetTrigger>
                <SheetContent side="right" className="bg-white">
                  <SheetHeaderComponent>
                    <SheetTitle>Editar Empresa</SheetTitle>
                    <SheetDescription>
                      Atualize os dados e configurações da sua empresa aqui.
                    </SheetDescription>
                  </SheetHeaderComponent>
                  <div className="mt-6">
                    {/* Formulário ou dados da empresa entrarão aqui no futuro */}
                    <p className="text-sm text-muted-foreground">Conteúdo do formulário em breve...</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="my-3">
              <SearchButton onClick={() => setSearchOpen(true)} />
              <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                <Command>
                  <CommandInput placeholder="Escreva um comando ou pesquise..." />
                  <CommandList>
                    <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                    <CommandGroup heading="Sugestões">
                      <CommandItem>Dashboard</CommandItem>
                      <CommandItem>Vendas</CommandItem>
                      <CommandItem>Configurações</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CommandDialog>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = item.path && (location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/dashboard'))
                const isOpen = openMenus[item.label]

                if (item.children) {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.label)}
                        className="justify-between hover:bg-[#f0f0f0] data-[active=true]:bg-[#f0f0f0] py-3 h-auto"
                      >
                        <div className="flex items-center gap-4">
                          <Icon />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-all duration-200 ease-in-out opacity-0",
                          "group-hover/menu-item:opacity-100",
                          isOpen && "opacity-100 rotate-180"
                        )} />
                      </SidebarMenuButton>
                      <Collapsible.Root open={isOpen} onOpenChange={() => toggleMenu(item.label)}>
                        <Collapsible.Content className="grid overflow-hidden transition-all duration-300 ease-in-out data-[state=open]:grid-rows-[1fr] data-[state=closed]:grid-rows-[0fr]">
                          <div className="overflow-hidden">
                            <SidebarMenuSub>
                              {item.children.map((child) => (
                                <SidebarMenuSubItem key={child.path}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={location.pathname === child.path}
                                    className="hover:bg-[#f0f0f0] data-[active=true]:bg-[#f0f0f0] py-2.5 h-auto"
                                  >
                                    <Link to={child.path}>{child.label}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </div>
                        </Collapsible.Content>
                      </Collapsible.Root>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} className="hover:bg-[#f0f0f0] data-[active=true]:bg-[#f0f0f0] py-3 h-auto">
                      <Link to={item.path} className="flex items-center gap-4">
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-sidebar-border sticky bottom-0 z-20 bg-sidebar">
          <p className="text-xs text-sidebar-foreground/50">v1.0.0</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}