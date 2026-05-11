Perfeito. Vamos cobrir os três em ordem, sempre com exemplos do teu sistema real.

---

## 1. Estado — `useState`

### O que é estado?

Estado é qualquer dado que quando muda, o ecrã precisa de actualizar.

No teu `state.js` tens isto:

```js
let cart = new Map();
let PRODUCTS = [];
let activeCategory = 'Todos Produtos';
let searchTerm = '';
```

Estas variáveis são estado. O problema no JS puro é que quando mudas uma delas, o ecrã não sabe — tens de chamar `renderCart()`, `renderProducts()`, etc. manualmente.

O `useState` resolve exactamente isso.

### Como funciona

```jsx
const [valor, setValor] = useState(valorInicial);
```

São sempre duas coisas:

- `valor` — o dado em si (lês aqui)
- `setValor` — a função para mudar o dado (escreves aqui)

Quando chamas `setValor(novoValor)`, o React actualiza o ecrã automaticamente.

### Exemplo real — o teu carrinho

**JS puro (como tens agora):**

```js
let cart = new Map();

function addToCart(produto) {
  cart.set(produto.id, { product: produto, qty: 1 });
  renderCart();           // tens de lembrar
  updateCartDisplay();    // tens de lembrar
  syncToAPI(produto.id);  // tens de lembrar
}
```

**React:**

```jsx
const [cart, setCart] = useState(new Map());

function addToCart(produto) {
  setCart(prev => {
    const novo = new Map(prev);
    novo.set(produto.id, { product: produto, qty: 1 });
    return novo;
  });
  // ecrã actualiza sozinho — não há mais nada para chamar
}
```

### A regra do `useState`

> Nunca mudas o valor directamente. Sempre usas o `set`.

```jsx
// ❌ ERRADO — React não sabe que mudou
cart.set(produto.id, item);

// ✅ CERTO — React sabe e actualiza o ecrã
setCart(novoCart);
```

### Os estados que o Rafe vai ter

Mapeando o teu `state.js` para React:

```jsx
// No POS
const [cart, setCart] = useState(new Map());
const [products, setProducts] = useState([]);
const [activeCategory, setActiveCategory] = useState('Todos Produtos');
const [searchTerm, setSearchTerm] = useState('');

// No pagamento
const [paymentMethod, setPaymentMethod] = useState(null);
const [cashAmount, setCashAmount] = useState(0);

// No documento
const [docType, setDocType] = useState('factura');
const [selectedClient, setSelectedClient] = useState(null);
```

Cada um destes, quando muda, actualiza a parte do ecrã que depende dele. Só essa parte — não o ecrã todo.

---

## 2. Componentes — JSX

### O que é um componente

Um componente é uma função que devolve o que aparece no ecrã. Ponto.

```jsx
function BotaoPagar() {
  return <button>Pagar</button>;
}
```

O `<button>Pagar</button>` dentro do JS chama-se **JSX**. Parece HTML mas não é — é JavaScript disfarçado. O Vite converte-o para JS real antes de chegar ao browser.

### A diferença do HTML que conheces

```jsx
// HTML normal
<div class="produto-card" onclick="addToCart(id)">

// JSX — repara nas diferenças
<div className="produto-card" onClick={() => addToCart(id)}>
```

Duas regras a memorizar:

- `class` vira `className`
- eventos são camelCase: `onclick` → `onClick`, `onchange` → `onChange`

### Props — como passas dados entre componentes

Props são os dados que um componente pai passa para um filho. É como os parâmetros de uma função.

**Exemplo real — card de produto:**

```jsx
// Componente filho — recebe os dados via props
function ProductCard({ nome, preco, disponivel, onAdicionar }) {
  return (
    <div className="produto-card">
      <span>{nome}</span>
      <span>{preco} Kz</span>
      <button 
        disabled={!disponivel}
        onClick={onAdicionar}
      >
        Adicionar
      </button>
    </div>
  );
}

// Componente pai — passa os dados
function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map(produto => (
        <ProductCard
          key={produto.id}
          nome={produto.name}
          preco={produto.price}
          disponivel={produto.available}
          onAdicionar={() => addToCart(produto)}
        />
      ))}
    </div>
  );
}
```

O `products.map(...)` é exactamente o que já fazes no teu JS puro para gerar HTML — só que aqui devolves JSX em vez de strings HTML.

### A regra do `key`

Quando renderizas uma lista, o React precisa de um `key` único em cada item. Usas sempre o ID:

```jsx
// ❌ ERRADO — sem key
products.map(p => <ProductCard nome={p.name} />)

// ✅ CERTO — com key
products.map(p => <ProductCard key={p.id} nome={p.name} />)
```

### Estado + Componente juntos

Aqui vês como os dois se ligam:

```jsx
function POS() {
  const [cart, setCart] = useState(new Map());
  const [products, setProducts] = useState([]);

  function addToCart(produto) {
    setCart(prev => {
      const novo = new Map(prev);
      novo.set(produto.id, { product: produto, qty: 1 });
      return novo;
    });
  }

  return (
    <div className="pos-layout">
      <ProductGrid 
        products={products}
        onAdicionar={addToCart}
      />
      <CartPanel 
        cart={cart}
        onRemover={...}
      />
    </div>
  );
}
```

O `POS` guarda o estado. Os filhos recebem dados via props e comunicam de volta via funções (`onAdicionar`, `onRemover`). Dados descem, eventos sobem.

---

## 3. Efeitos — `useEffect`

### O que é um efeito

Efeito é qualquer coisa que o componente precisa de fazer que não seja renderizar o ecrã. Por exemplo:

- Buscar dados da API ao carregar
- Ligar o SSE (como o teu `initSSE()`)
- Actualizar o título da página
- Criar um intervalo de tempo (`setInterval`)

### Como funciona

```jsx
useEffect(() => {
  // código que corre depois de o componente aparecer no ecrã
}, [dependências]);
```

O segundo argumento — as dependências — controla quando o efeito corre:

```jsx
// Corre uma vez — quando o componente aparece
useEffect(() => { ... }, []);

// Corre sempre que searchTerm muda
useEffect(() => { ... }, [searchTerm]);

// Corre sempre que o componente actualiza (evita isto)
useEffect(() => { ... });
```

### Exemplo real — o teu `init()`

**JS puro (como tens agora):**

```js
function init() {
  carregarClientePadrao()
    .then(() => {
      carregarProdutos();
      loadCartFromAPI();
      initSSE();
      initInvoiceFormat();
      initPayButton();
    });
}
init();
```

**React:**

```jsx
function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(new Map());

  // Equivalente ao teu init() — corre uma vez ao carregar
  useEffect(() => {
    carregarProdutos().then(data => setProducts(data));
    loadCartFromAPI().then(data => setCart(data));
    initSSE();
  }, []); // [] = só corre uma vez

  return ( ... );
}
```

### Exemplo real — pesquisa com debounce

**JS puro:**

```js
searchInput.addEventListener('input', debounce(() => {
  searchTerm = searchInput.value;
  renderProducts();
}, 300));
```

**React:**

```jsx
const [searchTerm, setSearchTerm] = useState('');

// Quando searchTerm muda, filtra produtos automaticamente
useEffect(() => {
  const timeout = setTimeout(() => {
    // filtra produtos
  }, 300);

  return () => clearTimeout(timeout); // limpeza — muito importante
}, [searchTerm]);
```

### A limpeza do `useEffect`

Quando o efeito cria algo que precisa de ser fechado (SSE, intervalo, listener), devolves uma função de limpeza:

```jsx
useEffect(() => {
  // Equivalente ao teu initSSE()
  const sse = new EventSource('/api/stream.php');
  
  sse.addEventListener('pedido_updated', (e) => {
    loadCartFromAPI();
  });

  // Equivalente ao teu closeSSE() — corre quando o componente sai do ecrã
  return () => {
    sse.close();
  };
}, []);
```

No teu `app.js` tens `window.addEventListener('beforeunload', closeSSE)` — no React não precisas disso, a função de limpeza trata de tudo.

---

## Resumo dos três

|Conceito|O que faz|Equivalente no teu sistema|
|---|---|---|
|`useState`|Guarda dados que mudam o ecrã|`state.js` + chamadas manuais ao render|
|Componentes + JSX|Pedaços do ecrã com responsabilidade própria|Ficheiros `ui/*.js`|
|`useEffect`|Corre código fora da renderização|`init()`, `initSSE()`, `addEventListener`|

---

Estes três são a base de tudo. A partir daqui há dois caminhos:

**A** — Perceber o **Context API** (como o estado global do Rafe vai funcionar entre módulos — o multitenant, o utilizador logado, o carrinho partilhado)

**B** — Perceber a **navegação entre módulos** sem reload (como o utilizador passa do POS para o Stock, para os Clientes, etc.)

Por onde queres ir?