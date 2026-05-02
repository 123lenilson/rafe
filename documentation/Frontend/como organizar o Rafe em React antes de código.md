Excelente escolha. Estrutura primeiro evita reescrever tudo depois.

---

## Como o React organiza um sistema como o Rafe

No React, tudo é **componente**. Um componente é um pedaço da interface com a sua própria responsabilidade. Pensa assim:

> _O que vês no ecrã = árvore de componentes_

---

## A árvore do Rafe

Com base no que conheço do teu sistema — POS, gestão de stock, clientes, financeiro — e tendo o Square como inspiração, a estrutura seria assim:

```
App  ← raiz de tudo
│
├── Layout  ← estrutura visual permanente (sidebar, header)
│   ├── Sidebar  ← navegação principal entre módulos
│   └── Header   ← info do utilizador, empresa, notificações
│
├── Módulos (cada um é uma "página")
│   ├── POS          ← o teu sistema actual
│   ├── Stock        ← gestão de produtos/inventário
│   ├── Clientes     ← gestão de clientes
│   ├── Financeiro   ← relatórios, caixa, movimentos
│   ├── Faturas      ← listagem e emissão de documentos
│   └── Definições   ← empresa, utilizadores, impostos
│
└── Shared  ← componentes usados em todo o lado
    ├── Modal
    ├── Alert
    ├── Button
    ├── Table
    └── Badge
```

---

## Dentro do módulo POS (que já conheces bem)

O POS é o módulo mais complexo. Por dentro fica assim:

```
POS
├── ProductPanel        ← grelha de produtos + categorias
│   ├── CategoryBar     ← barra de categorias (Todos, Bebidas...)
│   ├── SearchBar       ← pesquisa + modo barcode
│   └── ProductGrid     ← cards de produtos
│
├── CartPanel           ← carrinho lateral
│   ├── CartList        ← lista de itens
│   │   └── CartItem    ← cada linha (qty, preço, edição)
│   ├── OrderSummary    ← subtotal, imposto, total
│   └── PaymentFooter   ← métodos de pagamento + keypad
│
├── InvoicePanel        ← tipo de documento + cliente
│   ├── DocTypeSelector ← Factura, Recibo, Proforma...
│   └── ClientSelector  ← painel de cliente
│
└── Modals              ← pop-ups do POS
    ├── InvoiceA4       ← fatura A4 para imprimir
    ├── Invoice80mm     ← recibo térmico
    └── ConfirmModal    ← confirmações (limpar carrinho, etc.)
```

---

## Como isto mapeia para os teus ficheiros actuais

|Ficheiro actual (JS puro)|Componente React|
|---|---|
|`products.ui.js`|`ProductPanel` + `ProductGrid`|
|`cart.ui.js`|`CartPanel` + `CartList` + `CartItem`|
|`cart-editing.ui.js`|lógica dentro de `CartItem`|
|`payment.ui.js`|`PaymentFooter`|
|`client-panel.ui.js`|`ClientSelector`|
|`invoice-type.ui.js`|`DocTypeSelector` + `InvoicePanel`|
|`alerts.ui.js`|`Alert` (Shared)|
|`modal.ui.js`|`Modal` (Shared)|
|`bottom-sheet.ui.js`|lógica dentro de `CartPanel` (mobile)|
|`state.js`|**Context API** (estado global)|
|`app.js`|`App` + inicialização via `useEffect`|

---

## A regra de ouro para estruturar

Quando estiveres a instruir a IA para construir um componente, usa sempre esta lógica:

**1 responsabilidade = 1 componente**

- `CartItem` só sabe renderizar um item do carrinho
- `PaymentFooter` só sabe lidar com pagamento
- `ProductGrid` só sabe mostrar a grelha de produtos

Se um componente começa a fazer duas coisas distintas, divide-o.

---

## A pasta do projecto em React + Vite

```
rafe/
├── src/
│   ├── main.jsx          ← ponto de entrada (equivale ao index.php)
│   ├── App.jsx           ← raiz da aplicação
│   │
│   ├── context/          ← estado global (substitui state.js)
│   │   ├── CartContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── TenantContext.jsx
│   │
│   ├── modules/          ← cada módulo do Rafe
│   │   ├── pos/
│   │   ├── stock/
│   │   ├── clientes/
│   │   ├── financeiro/
│   │   └── faturas/
│   │
│   ├── shared/           ← componentes reutilizáveis
│   │   ├── Modal.jsx
│   │   ├── Alert.jsx
│   │   ├── Button.jsx
│   │   └── Table.jsx
│   │
│   ├── services/         ← chamadas à API (substitui os teus services/*.js)
│   │   ├── pos.service.js
│   │   ├── stock.service.js
│   │   └── clientes.service.js
│   │
│   └── assets/           ← CSS, imagens, fontes
│
├── index.html
├── vite.config.js
└── package.json
```

---

## O que nota de importante aqui

**A pasta `services/` não muda quase nada.** Os teus `fetch()` ao PHP continuam exactamente iguais — só mudam de lugar. Isso é uma boa notícia porque o teu backend Laravel não precisa de saber que o frontend mudou para React.

**O multitenant aparece no `TenantContext`** — cada empresa que paga acesso ao Rafe tem o seu contexto. Cada chamada à API vai saber a que empresa pertence.

---

Queres que avancemos agora para perceber como o **estado funciona no React** [[Estado (useState), Componentes (JSX), Efeitos (useEffect)]] ou preferes primeiro ver como a **navegação entre módulos** funciona sem fazer reload da página?