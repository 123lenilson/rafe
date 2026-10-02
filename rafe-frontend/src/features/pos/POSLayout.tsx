import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs'

interface POSTab {
  id: number
  title: string
}

export function POSLayout() {
  const [tabs, setTabs] = useState<POSTab[]>([
    { id: 1, title: 'Factura-Recibo #1' },
  ])
  const [activeTabId, setActiveTabId] = useState<number | null>(1)
  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  function handleAddTab() {
    const nextId = Math.max(0, ...tabs.map((tab) => tab.id)) + 1
    const newTab = { id: nextId, title: `Factura-Recibo #${nextId}` }

    setTabs((currentTabs) => [...currentTabs, newTab])
    setActiveTabId(newTab.id)
  }

  function handleCloseTab(tabId: number) {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    const remainingTabs = tabs.filter((tab) => tab.id !== tabId)

    setTabs(remainingTabs)

    if (activeTabId === tabId) {
      const nextActiveTab = remainingTabs[Math.max(0, tabIndex - 1)]
      setActiveTabId(nextActiveTab?.id ?? null)
    }
  }

  return (
    <Tabs
      className="fixed inset-0 flex flex-col gap-0 overflow-hidden bg-background"
      onValueChange={(value) => setActiveTabId(Number(value))}
      value={activeTabId === null ? '' : String(activeTabId)}
    >
      <div className="flex h-11 shrink-0 items-end gap-1 border-b border-border bg-muted px-0">
        <TabsList
          aria-label="Abas do POS"
          className="flex h-full min-w-0 flex-1 items-end justify-start gap-1 overflow-x-auto rounded-none border-0 bg-muted p-0"
          variant="line"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId

            return (
              <div
                key={tab.id}
                className={`relative w-[220px] shrink-0 rounded-t-md ${
                  isActive ? '-mb-px z-10 bg-background' : 'bg-muted'
                }`}
                role="presentation"
              >
                <TabsTrigger
                  className={`h-11 w-full justify-start rounded-t-md rounded-b-none border border-b-0 px-3 pr-12 text-left text-foreground shadow-none transition-none after:hidden focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 focus-visible:ring-0 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=inactive]:bg-muted ${
                    isActive ? 'border-border' : 'border-transparent'
                  }`}
                  value={String(tab.id)}
                >
                  {tab.title}
                </TabsTrigger>
                {isActive && (
                  <button
                    aria-label={`Fechar ${tab.title}`}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-secondary-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                    onClick={() => handleCloseTab(tab.id)}
                    type="button"
                  >
                    <X aria-hidden="true" size="1rem" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            )
          })}
        </TabsList>

        <button
          aria-label="Criar nova aba POS"
          className="ml-1 flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full text-secondary-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
          onClick={handleAddTab}
          type="button"
        >
          <Plus aria-hidden="true" size="1.125rem" strokeWidth={1.75} />
        </button>
      </div>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          className="min-h-0 flex-1 overflow-y-auto rounded-b-md border-x border-b border-border bg-background"
          value={String(tab.id)}
        >
          <div className="mx-auto w-full max-w-[1200px] p-6">
            <h1 className="text-2xl font-semibold leading-8 text-foreground">
              {tab.title}
            </h1>
            <p
              className="mt-2 text-secondary-foreground"
              style={{ fontSize: '0.8125rem', lineHeight: '1.125rem' }}
            >
              Conteúdo simulado desta operação POS.
            </p>

            <div className="mt-6 border-t border-border pt-6">
              <p
                className="font-medium text-foreground"
                style={{ fontSize: '0.8125rem', lineHeight: '1.125rem' }}
              >
                Produto de demonstração #{tab.id}
              </p>
              <p
                className="mt-2 text-secondary-foreground"
                style={{ fontSize: '0.8125rem', lineHeight: '1.125rem' }}
              >
                Esta aba mantém o seu próprio conteúdo de demonstração.
              </p>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
