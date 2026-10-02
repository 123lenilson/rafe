import { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
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

const MAX_POS_TABS = 15

export function POSLayout() {
  const [tabs, setTabs] = useState<POSTab[]>([
    { id: 1, title: 'Factura-Recibo #1' },
  ])
  const [activeTabId, setActiveTabId] = useState<number | null>(1)
  const tabsListElement = useRef<HTMLDivElement | null>(null)
  const tabElements = useRef(new Map<number, HTMLDivElement>())
  const titleElements = useRef(new Map<number, HTMLSpanElement>())
  const knownTabIds = useRef(new Set(tabs.map((tab) => tab.id)))
  const closingTabIds = useRef(new Set<number>())
  const [overflowingTabIds, setOverflowingTabIds] = useState<Set<number>>(
    () => new Set(),
  )

  useEffect(() => {
    for (const tab of tabs) {
      if (knownTabIds.current.has(tab.id)) continue

      knownTabIds.current.add(tab.id)
      tabElements.current.get(tab.id)?.animate(
        [
          { transform: 'translateY(100%)' },
          { transform: 'translateY(0%)' },
        ],
        { duration: 200, easing: 'ease-out' },
      )
    }
  }, [tabs])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setOverflowingTabIds((currentIds) => {
        const nextIds = new Set(currentIds)
        let changed = false

        for (const [tabId, element] of titleElements.current) {
          const isOverflowing = element.scrollWidth > element.clientWidth
          if (isOverflowing === nextIds.has(tabId)) continue

          changed = true
          if (isOverflowing) nextIds.add(tabId)
          else nextIds.delete(tabId)
        }

        return changed ? nextIds : currentIds
      })
    })

    titleElements.current.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [tabs])

  useEffect(() => {
    if (activeTabId === null) return

    const tabsList = tabsListElement.current
    const tabElement = tabElements.current.get(activeTabId)
    if (!tabsList || !tabElement) return

    const tabsListRect = tabsList.getBoundingClientRect()
    const tabRect = tabElement.getBoundingClientRect()

    if (tabRect.left < tabsListRect.left) {
      tabsList.scrollLeft -= tabsListRect.left - tabRect.left
    } else if (tabRect.right > tabsListRect.right) {
      tabsList.scrollLeft += tabRect.right - tabsListRect.right
    }
  }, [activeTabId, tabs.length])

  function handleAddTab() {
    const openTabCount = tabs.filter(
      (tab) => !closingTabIds.current.has(tab.id),
    ).length

    if (openTabCount >= MAX_POS_TABS) {
      toast.info('Limite de 15 abas atingido', {
        description: 'Feche algumas abas para abrir uma nova.',
      })
      return
    }

    const nextId = Math.max(0, ...tabs.map((tab) => tab.id)) + 1
    const newTab = { id: nextId, title: `Factura-Recibo #${nextId}` }

    setTabs((currentTabs) => [...currentTabs, newTab])
    setActiveTabId(newTab.id)
  }

  function handleCloseTab(tabId: number) {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    if (tabIndex === -1 || closingTabIds.current.has(tabId)) return

    closingTabIds.current.add(tabId)

    if (activeTabId === tabId) {
      const nextActiveTab =
        tabs
          .slice(0, tabIndex)
          .reverse()
          .find((tab) => !closingTabIds.current.has(tab.id)) ??
        tabs
          .slice(tabIndex + 1)
          .find((tab) => !closingTabIds.current.has(tab.id))
      setActiveTabId(nextActiveTab?.id ?? null)
    }

    const tabElement = tabElements.current.get(tabId)
    const finishClosing = () => {
      setTabs((currentTabs) => currentTabs.filter((tab) => tab.id !== tabId))
      tabElements.current.delete(tabId)
      knownTabIds.current.delete(tabId)
      closingTabIds.current.delete(tabId)
      setOverflowingTabIds((currentIds) => {
        if (!currentIds.has(tabId)) return currentIds

        const nextIds = new Set(currentIds)
        nextIds.delete(tabId)
        return nextIds
      })
    }

    if (!tabElement) {
      finishClosing()
      return
    }

    tabElement.animate(
      [{ transform: 'translateY(0%)' }, { transform: 'translateY(100%)' }],
      { duration: 200, easing: 'ease-in', fill: 'forwards' },
    ).onfinish = finishClosing
  }

  return (
    <Tabs
      className="fixed inset-0 flex flex-col gap-0 overflow-hidden bg-background"
      onValueChange={(value) => setActiveTabId(Number(value))}
      value={activeTabId === null ? '' : String(activeTabId)}
    >
      <div className="flex h-8 shrink-0 items-end gap-1 border-b border-background bg-muted px-0">
        <TabsList
          aria-label="Abas do POS"
          ref={(element) => {
            tabsListElement.current = element
          }}
          className="flex h-full group-data-horizontal/tabs:h-full min-w-0 w-fit shrink items-end justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-none border-0 bg-muted p-0"
          style={{ scrollbarWidth: 'none' }}
          variant="line"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            const tabLabel = tab.title.replace(/ #\d+$/, '')

            return (
              <div
                key={tab.id}
                ref={(element) => {
                  if (element) tabElements.current.set(tab.id, element)
                  else tabElements.current.delete(tab.id)
                }}
                className={`relative min-w-12 rounded-t-md ${
                  isActive
                    ? '-mb-px z-10 min-w-16 rounded-t-lg bg-background'
                    : 'bg-muted transition-colors duration-200 hover:bg-border'
                }`}
                role="presentation"
              >
                <TabsTrigger
                  aria-label={tab.title}
                  className={`h-8 min-w-0 w-full justify-start gap-1 rounded-t-md rounded-b-none border border-b-0 px-2 text-left text-foreground shadow-none after:hidden focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 focus-visible:ring-0 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=inactive]:bg-muted ${
                    isActive
                      ? 'gap-0 rounded-t-lg border-background pl-1 pr-8 transition-none'
                      : 'border-transparent transition-colors duration-200 data-[state=inactive]:hover:bg-border'
                  }`}
                  style={{ fontSize: '0.75rem' }}
                  value={String(tab.id)}
                >
                  <span className="shrink-0 whitespace-nowrap">{`#${tab.id}`}</span>
                  <span
                    ref={(element) => {
                      if (element) titleElements.current.set(tab.id, element)
                      else titleElements.current.delete(tab.id)
                    }}
                    className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
                    style={{
                      maskImage: overflowingTabIds.has(tab.id)
                        ? 'linear-gradient(to right, black calc(100% - 0.75rem), transparent 100%)'
                        : undefined,
                    }}
                  >
                    {tabLabel}
                  </span>
                </TabsTrigger>
                {isActive && (
                  <button
                    aria-label={`Fechar ${tab.title}`}
                    className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-secondary-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                    onClick={() => handleCloseTab(tab.id)}
                    type="button"
                  >
                    <X aria-hidden="true" size="0.75rem" strokeWidth={1.75} />
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
          <Plus aria-hidden="true" size="0.75rem" strokeWidth={1.75} />
        </button>
      </div>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          className="min-h-0 flex-1 rounded-b-md border-x border-b border-background bg-background"
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
