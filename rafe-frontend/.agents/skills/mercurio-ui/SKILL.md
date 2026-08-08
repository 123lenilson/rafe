---
name: mercury-ui
description: Padrões e regras de animação de tabela e painel de detalhe estilo Mercury no Rafe Frontend. Usar sempre que a tarefa envolver animação de colapso de colunas de tabela (translateX + opacity + step-end keyframes) e painel lateral flutuante de detalhes (right: 0, z-index: 30, inset padding).
---

# Skill: Mercury UI Animation — Rafe Frontend

Esta skill define o padrão técnico e visual para replicar a interacção fluida de tabelas e painéis de detalhe inspirada na **Mercury**.

---

## 🎭 1. Conceito de Interacção

Quando o utilizador clica numa linha de uma tabela:
1. **Saída das Colunas**: As colunas colapsáveis deslizam para a direita (`translateX(140px)`) e desvanecem (`opacity: 0`) em `0.4s`.
2. **Entrada do Painel**: O painel de detalhes entra da direita (`translateX(140px)` → `0px`) e surge simultaneamente (`opacity: 1`).
3. **Colapso de Largura**: No milissegundo exacto em que a transição termina (`0.4s`), um keyframe CSS `step-end` zera a largura física das colunas (`width: 0 !important; display: none !important;`), eliminando qualquer scroll horizontal indesejado.
4. **Scroll Isolado**: O scroll vertical pertence exclusivamente à tabela. O painel de detalhes permanece 100% fixo/imóvel à direita.

---

## 🛠️ 2. Estrutura HTML & React

### Container Principal
O container pai da tabela e do painel deve ter `position: relative` e `overflow: hidden`:

```tsx
<div className="max-w-[640px] w-full mx-auto bg-white rounded-xl flex-1 overflow-hidden flex flex-col relative">
  <div className="flex flex-1 min-h-0 overflow-hidden relative">
    {/* Área da Tabela */}
    <div
      className={`flex-1 min-w-0 overflow-y-auto rafe-table-scroll transition-[padding-right] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        columnsCollapsed ? 'rafe-table-condensed pr-[280px] overflow-x-hidden' : 'overflow-x-auto'
      }`}
    >
      {/* Tabela... */}
    </div>

    {/* Painel Flutuante */}
    <aside
      className={`rafe-detail-panel-wrapper p-2 box-border${panelOpen ? ' rafe-panel-visible' : ''}`}
      style={{ width: 280 }}
    >
      <EntryDetailPanel entry={selectedEntry} onClose={() => setSelectedEntryId(null)} />
    </aside>
  </div>
</div>
```

### Células Colapsáveis (`CollapsibleValueCell.tsx`)
As células que devem desaparecer aplicam a classe `.rafe-collapsible-col`:

```tsx
export function CollapsibleValueCell({ children, className = '' }: CollapsibleValueCellProps) {
  return (
    <div
      className={`rafe-collapsible-col px-[6px] py-[6px] ${className}`}
      style={{ width: 95, minWidth: 95, maxWidth: 95 }}
    >
      {children}
    </div>
  )
}
```

---

## 🎨 3. Regras CSS (`src/index.css`)

```css
/* Coluna colapsável: estado base (visível) */
.rafe-collapsible-col {
  --rafe-col-anim-dur: 0.4s;
  --rafe-col-translate: 140px;
  will-change: opacity, transform;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
  flex-grow: 0;
  transform: translateX(0);
  opacity: 1;
  transition:
    opacity var(--rafe-col-anim-dur) cubic-bezier(0.16, 1, 0.3, 1),
    transform var(--rafe-col-anim-dur) cubic-bezier(0.16, 1, 0.3, 1);
  animation: rafe-col-show var(--rafe-col-anim-dur) step-start forwards;
}

/* Coluna colapsável: estado colapsado (desliza 140px, desvanece e zera a largura) */
.rafe-table-condensed .rafe-collapsible-col {
  pointer-events: none;
  transform: translateX(var(--rafe-col-translate));
  opacity: 0;
  animation: rafe-col-hide var(--rafe-col-anim-dur) step-end forwards;
}

@keyframes rafe-col-show {
  0% { display: block; width: 95px; min-width: 95px; max-width: 95px; }
}

@keyframes rafe-col-hide {
  to {
    visibility: hidden;
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    display: none !important;
    overflow: hidden;
  }
}

/* Painel de detalhe: estado base (escondido a translateX(140px) com z-index:30) */
.rafe-detail-panel-wrapper {
  --rafe-panel-anim-dur: 0.4s;
  --rafe-panel-translate: 140px;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 30;
  opacity: 0;
  transform: translateX(var(--rafe-panel-translate));
  visibility: hidden;
  pointer-events: none;
  will-change: opacity, transform;
  transition:
    opacity var(--rafe-panel-anim-dur) cubic-bezier(0.16, 1, 0.3, 1),
    transform var(--rafe-panel-anim-dur) cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s linear var(--rafe-panel-anim-dur);
}

/* Painel de detalhe: estado visível */
.rafe-detail-panel-wrapper.rafe-panel-visible {
  opacity: 1;
  transform: translateX(0);
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0.05s, 0.05s, 0s;
}

/* Scrollbar ultra-fina (5px) para evitar cortar o layout */
.rafe-table-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
.rafe-table-scroll::-webkit-scrollbar-track { background: transparent; }
.rafe-table-scroll::-webkit-scrollbar-thumb { background: rgba(161, 161, 170, 0.25); border-radius: 9999px; }
.rafe-table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(161, 161, 170, 0.5); }
.rafe-table-scroll { scrollbar-width: thin; scrollbar-color: rgba(161, 161, 170, 0.25) transparent; }
```

---

## 🎨 4. Estilização do Card de Detalhes

Para evitar que as bordas fiquem cortadas no limite da caixa pai, o componente interno do painel deve ser um **card flutuante com bordas completas**:

```tsx
<div className="h-full bg-white border border-zinc-200/90 rounded-lg shadow-xs overflow-auto px-[14px] py-[14px] flex flex-col">
  {/* Conteúdo do detalhe... */}
</div>
```

---

## ⚠️ 5. Regras Obrigatórias

- **Nunca usar `width: 0` direto na transição CSS**: O colapso visual de largura DEVE ser feito via keyframe `step-end`, caso contrário o movimento de colunas perde o efeito de deslize horizontal.
- **Não usar `margin-right` no container da tabela**: Usar sempre `padding-right` (`pr-[280px]`) quando condensada, garantindo que a barra de rolagem permaneça discreta no limite externo e não no meio da tela.
- **Manter `z-index: 30` no wrapper do painel**: Isso impede que o cabeçalho fixo (`sticky top-0`) da tabela sobreponha o painel.
