import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  ShoppingCart,
  FileText,
  Package,
  Users,
  Wallet,
  UserCog,
  Settings,
  ChevronDown,
  Briefcase,
  ChevronsUpDown,
  Search,
  BellDot,
  MessageCircle
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
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/shared/components/ui/sheet'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/shared/components/ui/command'

const byPrefixAndName = {
  fas: {
    'cash-register': faCashRegister
  }
}

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
        "flex flex-row items-center gap-3 bg-white rounded-lg cursor-pointer hover:bg-[#f0f0f0] transition-all duration-300 ease-in-out",
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
  const navigate = useNavigate()
  const { state } = useSidebar()
  const [openMenu, setOpenMenu] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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

  // Estilo comum para submenus (preto bold, padding vertical maior, fonte próxima do link principal, transição super suave idêntica e cor #f0f0f0)
  const getSubmenuClass = ({ isActive }) => cn(
    "w-full h-auto px-4 py-2 text-[14px] font-bold text-black transition-all duration-300 ease-in-out block rounded-md",
    isActive
      ? "bg-[#f0f0f0]"
      : "text-black hover:bg-[#f0f0f0]"
  )




  return (
    <Sidebar className="border-r border-zinc-200 bg-white">
      {/* Cabeçalho do Sidebar - RAFE Brand */}
      <SidebarHeader className="pt-0 pb-1 px-3 bg-white">
        <div className="flex flex-col gap-2 w-full">
          {/* Bloco 1: Dados da Empresa (RAFE Brand - Botão CompanySelector) */}
          <div className="flex flex-col gap-0.5 border-b border-zinc-200 pt-0 pb-0 -mx-3 px-3">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <CompanySelector companyName="Rafe" plan="Ecosystem" onClick={() => setIsSheetOpen(true)} />
              <SheetContent side="right" className="bg-white border-l border-zinc-200 p-6 flex flex-col gap-6 w-[320px] sm:w-[350px]">
                <SheetHeader className="p-0 border-b border-zinc-100 pb-4">
                  <SheetTitle className="text-black font-extrabold text-xl tracking-tight">Rafe Ecosystem</SheetTitle>
                  <SheetDescription className="text-zinc-400 mt-1">
                    Configurações da empresa
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <span className="text-zinc-500 text-sm font-semibold leading-relaxed">
                    Aqui terá configurações de conta da empresa
                  </span>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Bloco 2: Barra de Pesquisa Interativa (Garante visibilidade responsiva em expandido/colapsado com estilos do SearchButton) */}
          <div className="flex w-full justify-center pt-4">
            {state !== 'collapsed' ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 w-full max-w-xs rounded-full border border-gray-300 bg-white text-gray-500 text-sm transition-colors hover:border-gray-400 active:border-black focus:outline-none focus:border-black select-none cursor-pointer"
              >
                <Search className="h-4 w-4 text-black shrink-0" />
                <span className="flex-1 text-left">Pesquisar...</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Pesquisar"
                className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 bg-white text-gray-500 transition-colors hover:border-gray-400 active:border-black focus:outline-none focus:border-black select-none shrink-0 cursor-pointer"
              >
                <Search className="h-4 w-4 text-black shrink-0" />
              </button>
            )}
          </div>
        </div>
      </SidebarHeader>

      {/* Conteúdo Principal de Navegação */}
      <SidebarContent className="bg-white px-3 pt-1 pb-4">
        <SidebarMenu className="gap-0.5">
          
          {/* Home */}
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
                <Home className="h-4 w-4 shrink-0" />
                <span>Home</span>
              </NavLink>
            </SidebarMenuButton>
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

          {/* Facturação (Submenu) */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSubmenu('faturacao')}
              className={triggerClass}
            >
              <div className="flex items-center gap-4">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Facturação</span>
              </div>
              {state !== 'collapsed' && (
                <ChevronDown
                  strokeWidth={2.5}
                  className={cn(
                    "h-[18px] w-[18px] text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-95 group-hover/trigger:scale-100",
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
                  strokeWidth={2.5}
                  className={cn(
                    "h-[18px] w-[18px] text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-95 group-hover/trigger:scale-100",
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
                  strokeWidth={2.5}
                  className={cn(
                    "h-[18px] w-[18px] text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-95 group-hover/trigger:scale-100",
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
                  strokeWidth={2.5}
                  className={cn(
                    "h-[18px] w-[18px] text-zinc-400 opacity-0 group-hover/trigger:opacity-100 transition-all duration-300 transform scale-95 group-hover/trigger:scale-100",
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
      <SidebarFooter className="py-3 px-3 border-t border-zinc-100 bg-white">
        <div className="flex flex-col gap-1 w-full">
          {/* Bloco 1: Sidebar Utility Bar (Menu de Ícones) */}
          {state !== 'collapsed' && (
            <div className="flex flex-row items-center justify-around w-full py-1">
              <button
                title="Notificações"
                className="flex items-center justify-center p-2 rounded-lg text-zinc-500 hover:text-black hover:bg-[#f0f0f0] transition-all duration-300 ease-in-out cursor-pointer"
              >
                <BellDot className="h-4 w-4 shrink-0" />
              </button>

              <button
                title="Mensagens"
                className="flex items-center justify-center p-2 rounded-lg text-zinc-500 hover:text-black hover:bg-[#f0f0f0] transition-all duration-300 ease-in-out cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
              </button>

              <button
                title="Caixa - Fechado"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-50 transition-all duration-300 ease-in-out cursor-pointer hover:bg-red-100/50"
              >
                <FontAwesomeIcon icon={byPrefixAndName.fas['cash-register']} className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs font-bold leading-none">Fechado</span>
              </button>
            </div>
          )}

          {/* Bloco 2: Informação do Utilizador (Avatar + Detalhes) */}
          <div className="flex w-full justify-center">
            <div
              className={cn(
                "flex flex-row items-center gap-3 bg-white rounded-lg cursor-pointer hover:bg-[#f0f0f0] transition-all duration-300 ease-in-out w-full",
                state === 'collapsed' ? "p-2 justify-center" : "px-4 py-2 justify-between"
              )}
            >
              <Avatar className="h-8 w-8 select-none shrink-0">
                <AvatarImage src="" alt="Operador Rafe" />
                <AvatarFallback className="font-bold text-[10px] text-black bg-zinc-100 border border-zinc-200">OP</AvatarFallback>
              </Avatar>
              {state !== 'collapsed' && (
                <>
                  <div className="flex flex-col min-w-0 flex-1 text-left gap-0.5">
                    <span className="text-sm font-semibold text-black truncate leading-tight">Operador Rafe</span>
                    <span className="text-[10px] text-zinc-400 truncate leading-tight">operator@rafe.com</span>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 text-zinc-400 shrink-0" />
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarFooter>

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} title="Menu de Pesquisa" description="Escreva um termo para pesquisar ou navegar...">
        <CommandInput placeholder="Escreva para pesquisar..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Links Principais">
            <CommandItem onSelect={() => { navigate('/dashboard'); setIsSearchOpen(false); }}>
              <Home className="text-zinc-400 shrink-0" />
              <span>Home / Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/pos'); setIsSearchOpen(false); }}>
              <ShoppingCart className="text-zinc-400 shrink-0" />
              <span>POS (Ponto de Venda)</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/clients'); setIsSearchOpen(false); }}>
              <Users className="text-zinc-400 shrink-0" />
              <span>Clientes</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/users'); setIsSearchOpen(false); }}>
              <UserCog className="text-zinc-400 shrink-0" />
              <span>Utilizadores</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Facturação">
            <CommandItem onSelect={() => { navigate('/faturacao/orcamento'); setIsSearchOpen(false); }}>
              <FileText className="text-zinc-400 shrink-0" />
              <span>Orçamentos</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/faturacao/facturas'); setIsSearchOpen(false); }}>
              <FileText className="text-zinc-400 shrink-0" />
              <span>Facturas</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/faturacao/proforma'); setIsSearchOpen(false); }}>
              <FileText className="text-zinc-400 shrink-0" />
              <span>Proformas</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/faturacao/recibo'); setIsSearchOpen(false); }}>
              <FileText className="text-zinc-400 shrink-0" />
              <span>Recibos</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Produtos">
            <CommandItem onSelect={() => { navigate('/produtos/listar'); setIsSearchOpen(false); }}>
              <Package className="text-zinc-400 shrink-0" />
              <span>Listar Produtos</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/produtos/entrada-saida'); setIsSearchOpen(false); }}>
              <Package className="text-zinc-400 shrink-0" />
              <span>Entrada / Saída</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Finanças">
            <CommandItem onSelect={() => { navigate('/financas/fluxo-caixa'); setIsSearchOpen(false); }}>
              <Wallet className="text-zinc-400 shrink-0" />
              <span>Fluxo de Caixa</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/financas/contas-bancos'); setIsSearchOpen(false); }}>
              <Wallet className="text-zinc-400 shrink-0" />
              <span>Contas / Bancos</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/financas/despesas'); setIsSearchOpen(false); }}>
              <Wallet className="text-zinc-400 shrink-0" />
              <span>Despesas</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Sidebar>
  )
}
