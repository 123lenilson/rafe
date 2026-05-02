# Arquitectura Hexagonal — Sistema Rafe
### Documentação técnica completa

---

## Índice

1. [O que é a Arquitectura Hexagonal](#1-o-que-é-a-arquitectura-hexagonal)
2. [Os dois lados do Hexágono](#2-os-dois-lados-do-hexágono)
3. [Driving Adapters — Entrada](#3-driving-adapters--entrada)
   - [.htaccess](#31-htaccess)
   - [Entry Points](#32-entry-points)
   - [HTTP — Request e Response](#33-http--request-e-response)
   - [Router e Routes](#34-router-e-routes)
   - [Middleware e Segurança OWASP](#35-middleware-e-segurança-owasp)
   - [Controllers](#36-controllers)
   - [CLI — Entrada por Terminal](#37-cli--entrada-por-terminal)
   - [Queue — Entrada por Filas](#38-queue--entrada-por-filas)
   - [Ports de Entrada](#39-ports-de-entrada)
4. [O Hexágono — Núcleo do Sistema](#4-o-hexágono--núcleo-do-sistema)
   - [Services](#41-services)
   - [Domain](#42-domain)
   - [Shared Domain](#43-shared-domain)
5. [Driven Adapters — Saída](#5-driven-adapters--saída)
   - [Ports de Saída](#51-ports-de-saída)
   - [Repositórios MySQL](#52-repositórios-mysql)
   - [Adapter da AGT](#53-adapter-da-agt)
   - [Adapter de Email](#54-adapter-de-email)
   - [Fake Adapters para Testes](#55-fake-adapters-para-testes)
6. [Injecção de Dependência](#6-injecção-de-dependência)
7. [Módulos do Sistema](#7-módulos-do-sistema)
8. [Estrutura de Pastas Completa](#8-estrutura-de-pastas-completa)
9. [Regras de Ouro](#9-regras-de-ouro)

---

## 1. O que é a Arquitectura Hexagonal

A Arquitectura Hexagonal, também chamada **Ports & Adapters**, foi criada por Alistair Cockburn. A ideia central é simples:

> **Proteger o núcleo do sistema (Domain) de tudo que é externo — base de dados, APIs, HTTP, email, terminal.**

O núcleo contém as regras de negócio puras. Tudo o resto é detalhe de infraestrutura que pode ser trocado sem tocar no núcleo.

### Por que usar no Rafe?

- O sistema precisa de cumprir normas legais (SAFT-AO, AGT) — as regras de negócio têm de estar isoladas e protegidas
- Permite desenvolvimento **orientado a testes** — podes testar toda a lógica sem base de dados real
- Múltiplos módulos desenvolvidos em paralelo — cada módulo é uma ilha independente
- Facilita trocar o MySQL por outro motor de BD sem tocar em nenhuma regra de negócio
- Permite múltiplas entradas — HTTP, CLI, Filas — usando o mesmo núcleo

---

## 2. Os dois lados do Hexágono

```
[ Driving Adapters ]         [ DOMAIN ]         [ Driven Adapters ]
  quem inicia a acção    ←→  núcleo puro  ←→    quem executa para fora

  Browser (HTTP)                                  MySQL
  Terminal (CLI)           regras de              AGT API
  Redis / RabbitMQ         negócio puras          Email
  Testes unitários                                Redis Queue
```

| Lado | Nome | Quem inicia | Exemplos |
|---|---|---|---|
| Esquerdo | Driving Adapters | O mundo exterior chama o sistema | HTTP, CLI, Testes, Filas |
| Direito | Driven Adapters | O sistema chama o mundo exterior | BD, Email, APIs externas |

---

## 3. Driving Adapters — Entrada

### 3.1 .htaccess

O `.htaccess` é o porteiro do servidor Apache. Sem ele, cada URL precisaria de um ficheiro PHP real no disco. Com ele, **todos os pedidos são redirecionados para um único entry point**.

```apache
RewriteEngine On

# Pedidos à API → entry point do backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^api/(.*)$ public/api/index.php [QSA,L]
```

**O que acontece:**
1. Browser pede `POST /api/facturas/recibo`
2. Apache verifica — esse ficheiro não existe no disco
3. `.htaccess` intercepta — redirige para `public/api/index.php`
4. O URL original fica disponível em `$_SERVER['REQUEST_URI']`

### 3.2 Entry Points

O sistema tem **quatro entry points** — cada um para um tipo de entrada diferente:

| Ficheiro | Quem chama | Para quê |
|---|---|---|
| `/index.php` | Browser directamente | Carrega a interface POS (HTML+CSS+JS) |
| `/public/api/index.php` | `.htaccess` via fetch() do JS | Recebe e despacha pedidos HTTP |
| `/cli.php` | Terminal (`php cli.php`) | Comandos administrativos |
| `/worker.php` | Servidor em background | Processa filas Redis/RabbitMQ |

```php
// public/api/index.php — entry point do backend
require_once __DIR__ . '/../../app/Http/Router.php';
require_once __DIR__ . '/../../app/Http/Routes/routes.php';

$router->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);
```

### 3.3 HTTP — Request e Response

A pasta `app/Http/` contém as ferramentas do protocolo HTTP. Existem para que os Controllers nunca toquem em `$_SERVER`, `php://input` ou `header()` directamente.

**`Request.php`** — encapsula tudo que vem do browser:

```php
class Request
{
    public function body(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    public function method(): string { return $_SERVER['REQUEST_METHOD']; }
    public function uri(): string    { return parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); }
    public function header(string $nome): ?string { return $_SERVER['HTTP_' . strtoupper($nome)] ?? null; }
}
```

**`Response.php`** — encapsula tudo que vai para o browser:

```php
class Response
{
    public static function json(array $dados, int $codigo = 200): void
    {
        http_response_code($codigo);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    }

    public static function erro(string $mensagem, int $codigo = 400): void
    {
        self::json(['erro' => $mensagem], $codigo);
    }
}
```

### 3.4 Router e Routes

O Router é o primeiro código PHP a executar depois do servidor receber um pedido HTTP. A única função é olhar para a URL + método HTTP e decidir qual Controller chamar.

```php
// app/Http/Router.php
class Router
{
    private array $rotas = [];

    public function post(string $uri, array $handler): void
    {
        $this->rotas[] = ['method' => 'POST', 'uri' => $uri, 'handler' => $handler];
    }

    public function get(string $uri, array $handler): void
    {
        $this->rotas[] = ['method' => 'GET', 'uri' => $uri, 'handler' => $handler];
    }

    public function dispatch(string $method, string $uri): void
    {
        foreach ($this->rotas as $rota) {
            if ($rota['method'] === $method && $rota['uri'] === $uri) {
                [$classe, $metodo] = $rota['handler'];
                $controller = new $classe();
                $controller->$metodo(new Request());
                return;
            }
        }
        Response::erro('Rota não encontrada', 404);
    }
}
```

As rotas são divididas por módulo e agregadas num ficheiro principal:

```php
// app/Http/Routes/routes.php — agrega todos os módulos
require_once 'facturas.routes.php';
require_once 'clientes.routes.php';
require_once 'stock.routes.php';
require_once 'financeiro.routes.php';
require_once 'compras.routes.php';
require_once 'relatorios.routes.php';
```

```php
// app/Http/Routes/facturas.routes.php
$router->post('/api/facturas',          [FacturaController::class, 'criar']);
$router->post('/api/facturas/recibo',   [FacturaController::class, 'criarRecibo']);
$router->post('/api/facturas/proforma', [FacturaController::class, 'criarProforma']);
$router->get('/api/facturas',           [FacturaController::class, 'listar']);
$router->get('/api/facturas/{id}',      [FacturaController::class, 'buscar']);
```

> **Regra:** URL não é ficheiro no disco. É só uma string que o Router compara com a tabela de rotas.

### 3.5 Middleware e Segurança OWASP

O Middleware é a primeira barreira de segurança — executa antes de qualquer Controller.

```php
// app/Http/Middleware/AuthMiddleware.php
class AuthMiddleware
{
    public function handle(Request $request): void
    {
        $token = $request->header('Authorization');

        if (!$token || !$this->tokenValido($token)) {
            Response::json(['erro' => 'Não autorizado'], 401);
            exit;
        }
    }
}
```

**Mapeamento OWASP por camada:**

| OWASP | Categoria | Camada responsável |
|---|---|---|
| A01 | Broken Access Control | Middleware (token + permissões) |
| A03 SQL Injection | Injection | Adapter BD (prepared statements) |
| A03 XSS | Injection | Controller (htmlspecialchars) |
| A04 | Insecure Design | Domain (regras de negócio) |
| A07 | Authentication Failures | Middleware (JWT, sessão) |
| A08 | Mass Assignment | Controller (lista branca de campos) |
| A09 | Logging & Monitoring | Middleware + Adapter |

### 3.6 Controllers

O Controller é o **Driving Adapter HTTP** — traduz o mundo HTTP para o mundo interno do sistema. Faz três coisas e só três:

1. Lê o JSON do request
2. Chama o Service (via Port de entrada)
3. Devolve JSON de resposta

```php
// Modules/Facturacao/Controllers/FacturaController.php
class FacturaController
{
    public function __construct(
        private CriarFacturaReciboPort $criarFacturaService
    ) {}

    public function criarRecibo(Request $request): void
    {
        $dados = $request->body();

        // Validação de formato
        if (empty($dados['id_cliente'])) {
            Response::erro('id_cliente é obrigatório', 400);
            return;
        }

        $idCliente  = (int) $dados['id_cliente'];
        $observacao = htmlspecialchars(trim($dados['observacao'] ?? ''));

        // Chama o Service via Port
        $factura = $this->criarFacturaService->executar(
            new DadosFactura($idCliente, $observacao, $dados['items'])
        );

        Response::json(['factura' => $factura->paraArray()]);
    }
}
```

> **O Controller não tem lógica de negócio. Não sabe se o cliente tem crédito, se o stock chega, se o IVA está correcto — isso é o Domain.**

### 3.7 CLI — Entrada por Terminal

Permite que os programadores interajam com o sistema via terminal sem precisar do browser.

```php
// cli.php — entry point CLI
require_once 'app/Cli/CommandRouter.php';

$comando = $argv[1] ?? null;  // php cli.php gerar-saft 2025-01
$args    = array_slice($argv, 2);

$router = new CommandRouter(Container::build());
$router->dispatch($comando, $args);
```

```php
// app/Cli/Commands/GerarSAFTCommand.php
class GerarSAFTCommand
{
    public function __construct(private GerarSAFTPort $service) {}

    public function executar(array $args): void
    {
        $periodo = $args[0] ?? date('Y-m');
        $ficheiro = $this->service->executar($periodo);
        echo "SAFT-AO gerado: {$ficheiro}\n";
    }
}
```

**Exemplos de uso:**
```bash
php cli.php gerar-saft 2025-01
php cli.php fechar-caixa
php cli.php listar-pendentes
```

### 3.8 Queue — Entrada por Filas

As filas permitem processar tarefas pesadas em segundo plano sem bloquear a resposta HTTP.

```php
// worker.php — entry point das filas (corre sempre em background)
require_once 'app/Queue/QueueDispatcher.php';

$queue      = new RedisQueue();
$dispatcher = new QueueDispatcher(Container::build());

while (true) {
    $job = $queue->proximoJob();
    if ($job) {
        $dispatcher->processar($job);
    }
    sleep(1);
}
```

**Exemplos de Jobs:**
- `EnviarEmailJob` — envio de email de recibo em background
- `ComunicarAGTJob` — comunicação com a AGT sem bloquear o POS
- `GerarRelatorioJob` — geração de relatórios pesados

### 3.9 Ports de Entrada

O Port de entrada é uma **interface que o Service implementa**. Garante que HTTP, CLI e Filas chamam o Service exactamente da mesma forma.

```php
// Modules/Facturacao/Domain/Ports/Entrada/CriarFacturaReciboPort.php
interface CriarFacturaReciboPort
{
    public function executar(DadosFactura $dados): Factura;
}

// O Service implementa o Port
class CriarFacturaReciboService implements CriarFacturaReciboPort
{
    public function executar(DadosFactura $dados): Factura { ... }
}
```

Agora qualquer entrada chama o mesmo contrato:

```php
// Controller HTTP        → $this->port->executar($dados)
// CLI Command            → $this->port->executar($dados)
// Queue Job              → $this->port->executar($dados)
// Teste unitário         → $this->port->executar($dados)
```

---

## 4. O Hexágono — Núcleo do Sistema

### 4.1 Services

O Service é o **orquestrador do fluxo**. Não tem regras de negócio, não conhece a BD, não conhece HTTP. Coordena quem faz o quê e em que ordem.

**Um Service por caso de uso** — nunca um Service gordo que faz tudo:

```
Services/
├── CriarFacturaReciboService.php
├── CriarFacturaProformaService.php
├── CriarNotaCreditoService.php
└── AnularFacturaService.php
```

O Service tem sempre três fases:

```php
class CriarFacturaReciboService implements CriarFacturaReciboPort
{
    public function executar(DadosFactura $dados): Factura
    {
        // ═══════════════════════════════
        // FASE 1 — RECOLHA
        // Vai buscar TUDO que o Domain precisa
        // Se algo não existir, pára aqui antes do Domain
        // ═══════════════════════════════
        $cliente = $this->clienteRepo->buscarPorId($dados->idCliente);
        if (!$cliente) throw new \DomainException('Cliente não encontrado');

        $caixaAberta = $this->caixaRepo->buscarAberta();
        if (!$caixaAberta) throw new \DomainException('Caixa não está aberta');

        $itemsCompletos = [];
        foreach ($dados->items as $item) {
            $produto = $this->produtoRepo->buscarPorId($item->idProduto);
            if (!$produto) throw new \DomainException("Produto {$item->idProduto} não encontrado");
            $stock = $this->stockRepo->quantidadeActual($item->idProduto);
            $itemsCompletos[] = new ItemFactura($produto, $item->quantidade, $stock);
        }

        // ═══════════════════════════════
        // FASE 2 — DOMAIN
        // Tudo pronto — Domain decide as regras
        // Se uma regra falhar, lança excepção
        // ═══════════════════════════════
        $factura = new Factura($cliente, $itemsCompletos, $dados->metodoPagamento);

        // ═══════════════════════════════
        // FASE 3 — EFEITOS (dentro de transacção)
        // Domain aprovou — persiste e acciona efeitos
        // ═══════════════════════════════
        $this->db->iniciarTransaccao();
        try {
            $this->facturaRepo->guardar($factura);
            $this->stockRepo->subtrair($factura->items());
            $this->caixaRepo->registarMovimento($caixaAberta, $factura->total());
            $this->db->confirmar();
        } catch (Exception $e) {
            $this->db->reverter();
            throw $e;
        }

        return $factura;
    }
}
```

| Fase | Pergunta | Se falhar |
|---|---|---|
| Recolha | Existe tudo que preciso? | Para — nada aconteceu |
| Domain | As regras de negócio passam? | Para — nada aconteceu |
| Efeitos | Consegui guardar tudo? | Transacção reverte — nada fica a meio |

### 4.2 Domain

O Domain é o **coração do sistema** — contém as regras de negócio puras. Não conhece nada externo.

**O Domain:**
- ✅ Conhece: regras de negócio, entidades, value objects
- ❌ Não conhece: MySQL, HTTP, email, AGT, framework

```php
// Modules/Facturacao/Domain/ItemFactura.php
class ItemFactura
{
    public function __construct(
        private Produto $produto,
        private int     $quantidade,
        private int     $stockActual  // ← veio do Service, já pronto
    ) {
        // Regras de negócio puras — sem tocar em BD
        if ($this->quantidade <= 0) {
            throw new \DomainException('Quantidade tem de ser maior que zero');
        }

        if ($this->quantidade > $this->stockActual) {
            throw new \DomainException(
                "Stock insuficiente para {$this->produto->nome()}. " .
                "Disponível: {$this->stockActual}, pedido: {$this->quantidade}"
            );
        }
    }
}
```

> **Regra de ouro:** O Domain nunca vai buscar nada. Recebe tudo pronto do Service e só decide se as regras passam ou não.

### 4.3 Shared Domain

Conceitos que pertencem a todos os módulos — importados directamente, sem Port.

```
app/Shared/Domain/
├── Dinheiro.php       ← valor monetário em AOA + operações
├── NIF.php            ← validação do NIF angolano
├── Endereco.php       ← morada estruturada
└── PeriodoFiscal.php  ← mês/ano fiscal para SAFT-AO
```

```php
// app/Shared/Domain/Dinheiro.php
class Dinheiro
{
    public function __construct(
        private float  $valor,
        private string $moeda = 'AOA'
    ) {
        if ($this->valor < 0) {
            throw new \DomainException('Valor monetário não pode ser negativo');
        }
    }

    public function somar(Dinheiro $outro): Dinheiro
    {
        return new Dinheiro($this->valor + $outro->valor, $this->moeda);
    }

    public function aplicarIVA(float $taxa): Dinheiro
    {
        return new Dinheiro($this->valor * (1 + $taxa / 100), $this->moeda);
    }
}
```

**Como é usado nos módulos:**

```php
// Importação directa — não precisa de Port
use App\Shared\Domain\Dinheiro;
use App\Shared\Domain\NIF;

class Factura
{
    public function __construct(
        private Dinheiro $total,
        private NIF      $nifCliente
    ) {}
}
```

**Quando usar Port vs importação directa:**

| Situação | Como aceder |
|---|---|
| Shared Domain (Dinheiro, NIF, Endereço) | Importação directa — é código puro PHP |
| Domain de outro módulo (Produto, Cliente) | Via Port — é código de outro domínio |
| Base de dados, APIs externas | Via Port — é infraestrutura |

---

## 5. Driven Adapters — Saída

### 5.1 Ports de Saída

O Port de saída é uma **interface definida pelo Domain** que o Adapter implementa. O Domain nunca sabe quem está por baixo.

```
Port (interface)           Adapter (implementação)
RepositorioDeFacturas  →   MySQLFacturaRepo
                       →   PostgreSQLFacturaRepo   (amanhã)
                       →   FakeFacturaRepo         (nos testes)
```

A palavra `implements` é a **promessa** de que a classe cumpre todos os métodos definidos na interface. Se faltar um método, o PHP pára imediatamente com erro.

> **Analogia:** É como um contrato de aluguer com a cláusula de reparar danos. O contrato define a obrigação (o quê). O inquilino decide como cumprir — empresa X, empresa Y, ele próprio. O dono não precisa de saber como — só que foi cumprido.

### 5.2 Repositórios MySQL

**Um repositório por entidade principal do módulo.** Nunca um repositório gigante para tudo.

O repositório faz a tradução entre dois mundos:
- **Escrita:** objecto Domain → INSERT/UPDATE na BD
- **Leitura:** linha da BD → objecto Domain (via método `reconstruir`)

```php
// Modules/Clientes/Adapters/MySQLClienteRepo.php
class MySQLClienteRepo implements RepositorioDeClientes
{
    public function __construct(private PDO $pdo) {}

    // ESCRITA — objecto vai para a BD
    public function guardar(Cliente $cliente): void
    {
        $stmt = $this->pdo->prepare(
            "INSERT INTO clientes (nome, nif, email, telefone) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([
            $cliente->nome(),
            $cliente->nif()->valor(),
            $cliente->email(),
            $cliente->telefone()
        ]);
    }

    // LEITURA — BD vem para objecto (usa reconstruir)
    public function buscarPorId(int $id): ?Cliente
    {
        $stmt = $this->pdo->prepare("SELECT * FROM clientes WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $this->reconstruir($row) : null;
    }

    public function listar(): array
    {
        $rows = $this->pdo->query("SELECT * FROM clientes ORDER BY nome")->fetchAll();
        return array_map(fn($row) => $this->reconstruir($row), $rows);
    }

    // TRADUTOR — array da BD → objecto Domain
    private function reconstruir(array $row): Cliente
    {
        return new Cliente(
            id:       $row['id'],
            nome:     $row['nome'],
            nif:      new NIF($row['nif']),
            email:    $row['email'],
            telefone: $row['telefone']
        );
    }
}
```

**Tabelas por repositório:**

| Repositório | Tabelas que conhece |
|---|---|
| `MySQLClienteRepo` | `clientes` |
| `MySQLFacturaRepo` | `facturas`, `itens_factura` |
| `MySQLProdutoRepo` | `produtos`, `categorias` |
| `MySQLCaixaRepo` | `caixa`, `movimentos_caixa` |
| `MySQLComprasRepo` | `encomendas`, `guias_recepcao` |

### 5.3 Adapter da AGT

```php
// Modules/Facturacao/Domain/Ports/Saida/ComunicadorAGT.php
interface ComunicadorAGT
{
    public function comunicar(Factura $factura): RespostaAGT;
    public function anular(string $numeroFactura): void;
}

// Modules/Facturacao/Adapters/AGTAdapter.php
class AGTAdapter implements ComunicadorAGT
{
    public function comunicar(Factura $factura): RespostaAGT
    {
        $resposta = file_get_contents('https://agt.minfin.gov.ao/api/factura', false,
            stream_context_create(['http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/json',
                'content' => json_encode($factura->paraAGT())
            ]])
        );
        return new RespostaAGT(json_decode($resposta, true));
    }
}
```

### 5.4 Adapter de Email

```php
// Shared/Domain/Ports/EnviadorDeEmail.php
interface EnviadorDeEmail
{
    public function enviar(string $para, string $assunto, string $corpo): void;
}

// Infrastructure/Adapters/SMTPEmailAdapter.php
class SMTPEmailAdapter implements EnviadorDeEmail
{
    public function enviar(string $para, string $assunto, string $corpo): void
    {
        $mail = new PHPMailer();
        $mail->addAddress($para);
        $mail->Subject = $assunto;
        $mail->Body    = $corpo;
        $mail->send();
    }
}
```

### 5.5 Fake Adapters para Testes

Um dos maiores benefícios dos Ports — podes criar Adapters falsos para testes sem BD real:

```php
// Tests/Fakes/FakeFacturaRepo.php
class FakeFacturaRepo implements RepositorioDeFacturas
{
    private array $facturas = [];

    public function guardar(Factura $factura): void
    {
        $this->facturas[] = $factura; // guarda em memória
    }

    public function buscarPorId(int $id): ?Factura
    {
        return $this->facturas[$id] ?? null;
    }

    public function total(): int { return count($this->facturas); }
}
```

```php
// Teste limpo — sem BD, sem AGT, sem email
$service = new CriarFacturaReciboService(
    new FakeFacturaRepo(),
    new FakeClienteRepo(),
    new FakeAGTAdapter(),
    new FakeEmailAdapter()
);

$service->executar($dados);
assert($fakeRepo->total() === 1); // confirma que foi guardado
```

---

## 6. Injecção de Dependência

O Container é o ficheiro que **monta todas as peças quando o sistema arranca**. É aqui que se decide: em produção usa MySQL, nos testes usa Fake.

```php
// app/Container.php
class Container
{
    public static function build(): array
    {
        // 1. Ligação à BD — uma só vez
        $pdo = new PDO(
            'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'],
            $_ENV['DB_USER'],
            $_ENV['DB_PASS']
        );

        // 2. Driven Adapters
        $facturaRepo  = new MySQLFacturaRepo($pdo);
        $clienteRepo  = new MySQLClienteRepo($pdo);
        $produtoRepo  = new MySQLProdutoRepo($pdo);
        $caixaRepo    = new MySQLCaixaRepo($pdo);
        $agtAdapter   = new AGTAdapter();
        $emailAdapter = new SMTPEmailAdapter();

        // 3. Services (recebem os Adapters)
        $criarFacturaService = new CriarFacturaReciboService(
            $facturaRepo, $clienteRepo, $produtoRepo, $caixaRepo, $agtAdapter, $emailAdapter
        );
        $criarClienteService = new CriarClienteService($clienteRepo);
        $entradaStockService = new EntradaStockService($produtoRepo);

        // 4. Controllers (recebem os Services)
        return [
            FacturaController::class => new FacturaController($criarFacturaService),
            ClienteController::class => new ClienteController($criarClienteService),
            StockController::class   => new StockController($entradaStockService),
        ];
    }
}
```

**Fluxo de montagem:**

```
Container arranca
      ↓
cria PDO (ligação BD)
      ↓
cria Adapters (MySQL, AGT, Email)
      ↓
injjecta Adapters nos Services
      ↓
injjecta Services nos Controllers
      ↓
Router recebe request → chama Controller já montado
```

---

## 7. Módulos do Sistema

O sistema é dividido em módulos independentes. Cada módulo é uma ilha — não importa código directamente de outro módulo, só comunica via Ports.

### Módulo 1 — Facturação (Core)
Documentos obrigatórios por lei angolana (SAFT-AO):
- Factura, Factura-Recibo, Factura Simplificada
- Nota de Crédito e Nota de Débito
- Códigos de isenção de IVA
- Retenção na Fonte (6.5% para prestação de serviços)
- Comunicação com a AGT

### Módulo 2 — Stock e Inventário
- Multiarmazém
- Controlo por lotes e datas de expiração
- Códigos de barras
- Custo Médio Ponderado (CMP)
- Entradas e saídas integradas com Facturação

### Módulo 3 — Financeiro (Tesouraria)
- Controlo de pendentes (Aging de balancetes)
- Gestão de Caixas e Bancos
- Reconciliação bancária
- Fecho de caixa diário
- Pagamentos a fornecedores

### Módulo 4 — Clientes e Fornecedores
- Validação de NIF angolano
- Histórico de consumo
- Limites de conta corrente e crédito

### Módulo 5 — Compras e Aprovisionamento
- Notas de Encomenda
- Guias de Recepção
- Cálculo de custos de desembarque (fretes, direitos aduaneiros)

### Módulo 6 — Relatórios e Conformidade Legal
- Exportação SAFT-AO mensal
- Mapas de IVA (Liquidado vs Dedutível)
- Estatísticas de venda por produto, vendedor ou zona

---

## 8. Estrutura de Pastas Completa

```
/
├── index.php                            ← frontend (interface POS)
├── .htaccess                            ← intercepta HTTP
├── cli.php                              ← entry point CLI
├── worker.php                           ← entry point Filas
│
├── public/
│   └── api/
│       └── index.php                    ← entry point backend
│
└── app/
    │
    ├── Http/                            ← ferramentas HTTP
    │   ├── Request.php
    │   ├── Response.php
    │   ├── Router.php
    │   ├── Middleware/
    │   │   └── AuthMiddleware.php
    │   └── Routes/
    │       ├── routes.php
    │       ├── facturas.routes.php
    │       ├── clientes.routes.php
    │       ├── stock.routes.php
    │       ├── financeiro.routes.php
    │       ├── compras.routes.php
    │       └── relatorios.routes.php
    │
    ├── Cli/                             ← ferramentas CLI
    │   ├── CommandRouter.php
    │   └── Commands/
    │       ├── GerarSAFTCommand.php
    │       ├── FecharCaixaCommand.php
    │       └── ListarPendentesCommand.php
    │
    ├── Queue/                           ← ferramentas de Filas
    │   ├── QueueDispatcher.php
    │   └── Jobs/
    │       ├── EnviarEmailJob.php
    │       ├── ComunicarAGTJob.php
    │       └── GerarRelatorioJob.php
    │
    ├── Shared/                          ← partilhado por todos os módulos
    │   └── Domain/
    │       ├── Dinheiro.php
    │       ├── NIF.php
    │       ├── Endereco.php
    │       └── PeriodoFiscal.php
    │
    ├── Container.php                    ← injecção de dependência
    │
    └── Modules/
        │
        ├── Facturacao/
        │   ├── Controllers/
        │   │   └── FacturaController.php
        │   ├── Services/
        │   │   ├── CriarFacturaReciboService.php
        │   │   ├── CriarFacturaProformaService.php
        │   │   ├── CriarNotaCreditoService.php
        │   │   └── AnularFacturaService.php
        │   ├── Domain/
        │   │   ├── Factura.php
        │   │   ├── FacturaRecibo.php
        │   │   ├── ItemFactura.php
        │   │   ├── LinhaIVA.php
        │   │   ├── RetencaoFonte.php
        │   │   └── Ports/
        │   │       ├── Entrada/
        │   │       │   └── CriarFacturaReciboPort.php
        │   │       └── Saida/
        │   │           ├── RepositorioDeFacturas.php
        │   │           └── ComunicadorAGT.php
        │   └── Adapters/
        │       ├── MySQLFacturaRepo.php
        │       └── AGTAdapter.php
        │
        ├── Stock/
        │   ├── Controllers/
        │   │   └── StockController.php
        │   ├── Services/
        │   │   ├── EntradaStockService.php
        │   │   ├── BaixaStockService.php
        │   │   ├── TransferenciaArmazemService.php
        │   │   └── CustoMedioPonderadoService.php
        │   ├── Domain/
        │   │   ├── Produto.php
        │   │   ├── Armazem.php
        │   │   ├── MovimentoStock.php
        │   │   ├── Lote.php
        │   │   └── Ports/
        │   │       ├── Entrada/
        │   │       │   └── EntradaStockPort.php
        │   │       └── Saida/
        │   │           └── RepositorioDeProdutos.php
        │   └── Adapters/
        │       └── MySQLProdutoRepo.php
        │
        ├── Financeiro/
        │   ├── Controllers/
        │   │   └── CaixaController.php
        │   ├── Services/
        │   │   ├── AbrirCaixaService.php
        │   │   ├── FecharCaixaService.php
        │   │   ├── RegistarMovimentoService.php
        │   │   └── ReconciliacaoBancariaService.php
        │   ├── Domain/
        │   │   ├── Caixa.php
        │   │   ├── MovimentoCaixa.php
        │   │   ├── ContaCorrente.php
        │   │   └── Ports/
        │   │       ├── Entrada/
        │   │       │   └── AbrirCaixaPort.php
        │   │       └── Saida/
        │   │           └── RepositorioDeCaixa.php
        │   └── Adapters/
        │       └── MySQLCaixaRepo.php
        │
        ├── Clientes/
        │   ├── Controllers/
        │   │   └── ClienteController.php
        │   ├── Services/
        │   │   ├── CriarClienteService.php
        │   │   ├── ActualizarClienteService.php
        │   │   └── ListarClientesService.php
        │   ├── Domain/
        │   │   ├── Cliente.php
        │   │   ├── LimiteCredito.php
        │   │   └── Ports/
        │   │       ├── Entrada/
        │   │       │   └── CriarClientePort.php
        │   │       └── Saida/
        │   │           └── RepositorioDeClientes.php
        │   └── Adapters/
        │       └── MySQLClienteRepo.php
        │
        ├── Compras/
        │   ├── Controllers/
        │   │   └── CompraController.php
        │   ├── Services/
        │   │   ├── CriarNotaEncomendaService.php
        │   │   ├── ReceberMercadoriaService.php
        │   │   └── CalcularCustoDesembarqueService.php
        │   ├── Domain/
        │   │   ├── NotaEncomenda.php
        │   │   ├── GuiaRecepcao.php
        │   │   ├── CustoDesembarque.php
        │   │   └── Ports/
        │   │       ├── Entrada/
        │   │       │   └── CriarEncomendaPort.php
        │   │       └── Saida/
        │   │           └── RepositorioDeCompras.php
        │   └── Adapters/
        │       └── MySQLComprasRepo.php
        │
        └── Relatorios/
            ├── Controllers/
            │   └── RelatorioController.php
            ├── Services/
            │   ├── GerarSAFTAOService.php
            │   ├── GerarMapaIVAService.php
            │   └── EstatisticasVendaService.php
            ├── Domain/
            │   ├── SAFTAO.php
            │   ├── MapaIVA.php
            │   └── Ports/
            │       ├── Entrada/
            │       │   └── GerarSAFTPort.php
            │       └── Saida/
            │           └── ExportadorSAFT.php
            └── Adapters/
                ├── XMLExportadorSAFT.php
                └── MySQLRelatorioRepo.php
```

---

## 9. Regras de Ouro

Estas regras nunca se quebram em nenhuma circunstância:

### 1. O Domain não conhece nada externo
```php
// NUNCA dentro do Domain
new PDO(...)           // BD
file_get_contents(...) // HTTP/API
new PHPMailer()        // Email
$_SERVER               // HTTP
```

### 2. Cada módulo é uma ilha
```php
// NUNCA fazer isto
use App\Modules\Stock\Domain\Produto; // dentro de Facturacao

// SEMPRE assim
use App\Modules\Stock\Domain\Ports\Saida\RepositorioDeProdutos; // via Port
```

### 3. O Service recolhe tudo antes do Domain
```php
// O Domain recebe tudo pronto — nunca vai buscar nada
$produto = $this->produtoRepo->buscarPorId($id); // Service recolhe
$item    = new ItemFactura($produto, $qty, $stock); // Domain recebe pronto
```

### 4. Um repositório por entidade — nunca um repositório global
```php
// NUNCA
class RepositorioGeral {
    public function salvarCliente() { ... }
    public function salvarFactura() { ... }
    public function salvarProduto() { ... }
}

// SEMPRE
class MySQLClienteRepo implements RepositorioDeClientes { ... }
class MySQLFacturaRepo implements RepositorioDeFacturas { ... }
class MySQLProdutoRepo implements RepositorioDeProdutos { ... }
```

### 5. O Controller só faz três coisas
```
1. Lê o request
2. Chama o Service
3. Devolve resposta
```

### 6. Ports de saída são sempre obrigatórios — Ports de entrada são opcionais
- **Saída:** o Domain chama infra (BD, APIs) → Port obrigatório para proteger o Domain
- **Entrada:** só necessário se houver múltiplas entradas (HTTP + CLI + Filas)

---

*Documento gerado durante o processo de aprendizagem e planeamento da arquitectura do sistema Rafe.*
*Próximos passos: Redis (filas em detalhe), ficheiro .env (configuração de ambiente), organização dos testes.*
