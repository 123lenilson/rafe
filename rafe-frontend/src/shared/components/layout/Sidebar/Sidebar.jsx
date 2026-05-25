import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  Users,
  Wallet,
  UserCog,
  Settings,
  ChevronDown,
  Briefcase,
  ChevronsUpDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar
} from '@/shared/components/ui/sidebar'

export function CompanySelector({
  companyName = "RAFE",
  plan = "Ecosystem",
  onClick
}) {
  const { state } = useSidebar()

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-row items-center gap-3 bg-white rounded-lg cursor-pointer hover:bg-[#f0f0f0] border border-zinc-100 transition-all duration-300 ease-in-out",
        state === 'collapsed' ? "p-2 justify-center" : "px-4 py-3 justify-between"
      )}
    >
      {/* Icone da Empresa */}
      <div className="w-8 h-8 bg-black rounded-md flex justify-center items-center shrink-0">
        <Briefcase className="w-4 h-4 text-white" />
      </div>

      {state !== 'collapsed' && (
        <>
          {/* Bloco de Texto */}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-bold text-black leading-tight truncate">
              {companyName}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 leading-tight truncate">
              {plan}
            </span>
          </div>

          {/* Chevron */}
          <ChevronsUpDown className="w-4 h-4 text-zinc-400 shrink-0" />
        </>
      )}
    </div>
  )
}

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const [openMenu, setOpenMenu] = useState(null)

  // Determinar qual submenu expandir com base no path actual
  useEffect(() => {
    const path = location.pathname
    let target = null
    if (path.startsWith('/faturacao')) {
      target = 'faturacao'
    } else if (path.startsWith('/produtos')) {
      target = 'produtos'
    } else if (path.startsWith('/financas')) {
      target = 'financas'
    } else if (path.startsWith('/definicoes')) {
      target = 'definicoes'
    }

    if (target) {
      const timer = setTimeout(() => {
        setOpenMenu(target)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  const toggleSubmenu = (menuName) => {
    setOpenMenu(prev => prev === menuName ? null : menuName)
  }

  const isPathActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  // Estilos de link activo e inactivo para botões principais (preto bold, fonte maior, padding vertical aumentado, transição super suave, cor #f0f0f0 e gap-4 para ícones)
  const activeClass = "h-auto py-3 px-4 bg-[#f0f0f0] text-black font-bold text-[15px] hover:bg-[#f0f0f0] transition-all duration-300 ease-in-out gap-4"
  const inactiveClass = "h-auto py-3 px-4 text-black font-bold text-[15px] hover:bg-[#f0f0f0] transition-all duration-300 ease-in-out gap-4"

  // Estilo para botões de categoria pai (com submenu) para manter a seta justificada à direita e habilitar animações group-hover/trigger isoladas
  const triggerClass = cn(inactiveClass, "w-full flex items-center justify-between group/trigger")

  // Estilo comum para submenus (preto bold, padding vertical maior, fonte ainda menor, transição super suave idêntica e cor #f0f0f0)
  const getSubmenuClass = ({ isActive }) => cn(
    "w-full h-auto px-4 py-2 text-[11px] font-bold text-black transition-all duration-300 ease-in-out block rounded-md",
    isActive
      ? "bg-[#f0f0f0]"
      : "text-black hover:bg-[#f0f0f0]"
  )




  return (
    <Sidebar className="border-r border-zinc-200 bg-white">
      {/* Cabeçalho do Sidebar - RAFE Brand */}
      <SidebarHeader className="py-3 px-5 bg-white">
        <div className="flex flex-col gap-3 w-full">
          {/* Bloco 1: Dados da Empresa (RAFE Brand - Botão CompanySelector) */}
          <div className="flex flex-col gap-0.5 border-b border-zinc-100 pb-3">
            <CompanySelector companyName="Rafe" plan="Ecosystem" />
          </div>

          {/* Bloco 2: Informação adicional */}
          {state !== 'collapsed' && (
            <div>
              <span className="inline-block text-[11px] font-bold text-zinc-400 bg-[#f0f0f0] px-2.5 py-1.5 rounded-md transition-all duration-300">
                Aqui vai ter algo
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Conteúdo Principal de Navegação */}
      <SidebarContent className="bg-white px-2 py-4">
        <SidebarMenu className="gap-0.5">
          
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isPathActive('/dashboard')}
              className={cn(
                "transition-colors duration-150",
                isPathActive('/dashboard') ? activeClass : inactiveClass
              )}
            >
              <NavLink to="/dashboard">
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Faturação (Submenu) */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSubmenu('faturacao')}
              className={triggerClass}
            >
              <div className="flex items-center gap-4">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Faturação</span>
              </div>
              {state !== 'collapsed' && (
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-90 group-hover/trigger:scale-100",
                    openMenu === 'faturacao' && "rotate-180"
                  )}
                />
              )}
            </SidebarMenuButton>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out overflow-hidden w-full",
                openMenu === 'faturacao' && state !== 'collapsed'
                  ? "grid-rows-[1fr] opacity-100 mt-1"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="min-h-0">
                <SidebarMenuSub className="border-l border-zinc-200 ml-4 pl-2 gap-1">
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/faturacao/orcamento"
                      className={getSubmenuClass}
                    >
                      Orçamento
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/faturacao/facturas"
                      className={getSubmenuClass}
                    >
                      Facturas
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/faturacao/proforma"
                      className={getSubmenuClass}
                    >
                      Proforma
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/faturacao/recibo"
                      className={getSubmenuClass}
                    >
                      Recibo
                    </NavLink>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </div>
            </div>
          </SidebarMenuItem>

          {/* POS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isPathActive('/pos')}
              className={cn(
                "transition-colors duration-150",
                isPathActive('/pos') ? activeClass : inactiveClass
              )}
            >
              <NavLink to="/pos">
                <ShoppingCart className="h-4 w-4 shrink-0" />
                <span>POS</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Produtos (Submenu) */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSubmenu('produtos')}
              className={triggerClass}
            >
              <div className="flex items-center gap-4">
                <Package className="h-4 w-4 shrink-0" />
                <span>Produtos</span>
              </div>
              {state !== 'collapsed' && (
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-90 group-hover/trigger:scale-100",
                    openMenu === 'produtos' && "rotate-180"
                  )}
                />
              )}
            </SidebarMenuButton>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out overflow-hidden w-full",
                openMenu === 'produtos' && state !== 'collapsed'
                  ? "grid-rows-[1fr] opacity-100 mt-1"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="min-h-0">
                <SidebarMenuSub className="border-l border-zinc-200 ml-4 pl-2 gap-1">
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/produtos/listar"
                      className={getSubmenuClass}
                    >
                      Listar Produto
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/produtos/entrada-saida"
                      className={getSubmenuClass}
                    >
                      Entrada/Saída
                    </NavLink>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </div>
            </div>
          </SidebarMenuItem>

          {/* Clientes */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isPathActive('/clients')}
              className={cn(
                "transition-colors duration-150",
                isPathActive('/clients') ? activeClass : inactiveClass
              )}
            >
              <NavLink to="/clients">
                <Users className="h-4 w-4 shrink-0" />
                <span>Clientes</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Finanças (Submenu) */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSubmenu('financas')}
              className={triggerClass}
            >
              <div className="flex items-center gap-4">
                <Wallet className="h-4 w-4 shrink-0" />
                <span>Finanças</span>
              </div>
              {state !== 'collapsed' && (
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-90 group-hover/trigger:scale-100",
                    openMenu === 'financas' && "rotate-180"
                  )}
                />
              )}
            </SidebarMenuButton>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out overflow-hidden w-full",
                openMenu === 'financas' && state !== 'collapsed'
                  ? "grid-rows-[1fr] opacity-100 mt-1"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="min-h-0">
                <SidebarMenuSub className="border-l border-zinc-200 ml-4 pl-2 gap-1">
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/financas/fluxo-caixa"
                      className={getSubmenuClass}
                    >
                      Fluxo de Caixa
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/financas/contas-bancos"
                      className={getSubmenuClass}
                    >
                      Contas/Bancos
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/financas/despesas"
                      className={getSubmenuClass}
                    >
                      Despesas
                    </NavLink>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </div>
            </div>
          </SidebarMenuItem>

          {/* Utilizadores */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isPathActive('/users')}
              className={cn(
                "transition-colors duration-150",
                isPathActive('/users') ? activeClass : inactiveClass
              )}
            >
              <NavLink to="/users">
                <UserCog className="h-4 w-4 shrink-0" />
                <span>Utilizadores</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Definições (Submenu) */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSubmenu('definicoes')}
              className={triggerClass}
            >
              <div className="flex items-center gap-4">
                <Settings className="h-4 w-4 shrink-0" />
                <span>Definições</span>
              </div>
              {state !== 'collapsed' && (
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-90 group-hover/trigger:scale-100",
                    openMenu === 'definicoes' && "rotate-180"
                  )}
                />
              )}
            </SidebarMenuButton>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out overflow-hidden w-full",
                openMenu === 'definicoes' && state !== 'collapsed'
                  ? "grid-rows-[1fr] opacity-100 mt-1"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="min-h-0">
                <SidebarMenuSub className="border-l border-zinc-200 ml-4 pl-2 gap-1">
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/definicoes/metodos-pagamento"
                      className={getSubmenuClass}
                    >
                      Métodos de Pagamento
                    </NavLink>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </div>
            </div>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      {/* Rodapé do Sidebar */}
      <SidebarFooter className="p-4 border-t border-zinc-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-black">
            OP
          </div>
          {state !== 'collapsed' && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-black truncate">Operador Rafe</span>
              <span className="text-[10px] text-zinc-400 truncate">operator@rafe.com</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
