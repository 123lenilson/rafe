# Testes no Projecto Rafe
### Como TDD, Cobertura, Padrão AAA e todos os tipos de teste se organizam no sistema real

---

## Índice

1. [Cobertura de Testes](#1-cobertura-de-testes)
2. [Padrão AAA — Arrange, Act, Assert](#2-padrão-aaa--arrange-act-assert)
3. [A Pirâmide de Testes no Rafe](#3-a-pirâmide-de-testes-no-rafe)
4. [Stub, Mock, Spy e Fake no Rafe](#4-stub-mock-spy-e-fake-no-rafe)
5. [BDD e ATDD no Rafe](#5-bdd-e-atdd-no-rafe)
6. [Testes de Contrato, Performance, Segurança, Regressão e Mutação no Rafe](#6-testes-de-contrato-performance-segurança-regressão-e-mutação-no-rafe)
7. [Estrutura de Pastas de Testes no Rafe](#7-estrutura-de-pastas-de-testes-no-rafe)
8. [Regras de Ouro dos Testes no Rafe](#8-regras-de-ouro-dos-testes-no-rafe)

---

## 1. Cobertura de Testes

### O que é

Cobertura de testes é uma **métrica** que responde à pergunta:

> *"Que percentagem do código do Rafe é executada quando os testes correm?"*

Se tens 200 linhas de lógica no Domain e os testes passam por 160 delas, tens **80% de cobertura**.

### O que a cobertura mede — e o que não mede

A cobertura diz-te **quantas linhas foram executadas** pelos testes. Mas não te diz se os testes são bons.

```
Exemplo perigoso:

Tens um teste que chama CriarFacturaReciboService
O teste passa → 90% de cobertura ✅

Mas o teste não verifica:
  - Se o IVA foi calculado correctamente
  - Se o stock foi subtraído
  - Se a caixa foi actualizada

Resultado: 90% de cobertura com testes inúteis.
```

**A cobertura é um indicador, não uma garantia de qualidade.**

### Metas reais para o Rafe

| Camada | Meta de Cobertura | Porquê |
|---|---|---|
| Domain (Factura, ItemFactura, Dinheiro, NIF...) | **95%+** | Regras de negócio puras — têm de estar todas testadas |
| Services (CriarFacturaReciboService...) | **85%+** | Orquestração crítica — falhas aqui têm impacto directo |
| Adapters MySQL | **60%+** | Testados nos testes de integração |
| Controllers | **50%+** | Lógica mínima — só lêem request e chamam Service |
| Middleware | **70%+** | Segurança — autenticação tem de ser testada |

### O perigo da cobertura de 100%

Perseguir 100% de cobertura a todo o custo leva a testes vazios que só executam código sem verificar nada.

> **Regra do Rafe:** Prioriza cobertura total no Domain. No resto, foca-te em cobrir os caminhos críticos — não em atingir um número.

---

## 2. Padrão AAA — Arrange, Act, Assert

### O que é

O padrão AAA é a **estrutura interna de cada teste**. Todo o teste bem escrito tem exactamente três partes, nesta ordem:

```
ARRANGE  →  Prepara tudo o que o teste precisa
ACT      →  Executa a acção que estás a testar
ASSERT   →  Verifica se o resultado é o esperado
```

### Porquê usar AAA

Sem AAA, os testes tornam-se confusos — misturam preparação, execução e verificação. Com AAA, qualquer programador lê o teste e percebe imediatamente o que está a ser testado.

### AAA aplicado ao Domain do Rafe

**Teste: Não deve criar ItemFactura com stock insuficiente**

```
ARRANGE:
  - Produto com nome "Óleo Alimentar"
  - Stock actual disponível: 5 unidades
  - Quantidade pedida: 10 unidades

ACT:
  - Tentar criar new ItemFactura(produto, quantidade=10, stockActual=5)

ASSERT:
  - O sistema deve lançar DomainException
  - Mensagem: "Stock insuficiente para Óleo Alimentar. Disponível: 5, pedido: 10"
```

**Teste: Dinheiro deve calcular IVA correctamente**

```
ARRANGE:
  - Valor base: 1.000 AOA
  - Taxa IVA: 14% (taxa standard em Angola)

ACT:
  - Chamar dinheiro->aplicarIVA(14)

ASSERT:
  - Resultado deve ser 1.140 AOA
```

**Teste: NIF angolano inválido deve ser rejeitado**

```
ARRANGE:
  - String "123" (NIF muito curto)

ACT:
  - Tentar criar new NIF("123")

ASSERT:
  - Deve lançar DomainException
  - Mensagem: "NIF inválido"
```

### AAA aplicado ao Service do Rafe

**Teste: CriarFacturaReciboService deve guardar a factura**

```
ARRANGE:
  - FakeClienteRepo com cliente id=1 já dentro
  - FakeProdutoRepo com produto id=10 (stock=20) já dentro
  - FakeFacturaRepo vazio
  - FakeCaixaRepo com caixa aberta
  - FakeAGTAdapter pronto a responder
  - Dados do pedido: cliente=1, produto=10, quantidade=2

ACT:
  - Chamar criarFacturaService->executar(dadosDoPedido)

ASSERT:
  - FakeFacturaRepo deve ter 1 factura guardada
  - O stock do produto deve ter diminuído 2 unidades
  - A caixa deve ter registado o movimento
```

### A Regra dos Três Blocos

Cada teste deve ter **exactamente um ACT**. Se o teu teste tem dois ACTs, está a testar duas coisas ao mesmo tempo — divide-o em dois testes.

```
❌ Errado — dois ACTs num teste:
  Arrange: preparar dados
  Act: criar factura
  Act: anular factura     ← segundo ACT
  Assert: factura anulada

✅ Correcto — dois testes separados:
  Teste 1: deve criar factura com sucesso
  Teste 2: deve anular factura existente
```

---

## 3. A Pirâmide de Testes no Rafe

```
                    /\
                   /  \
                  / E2E \
                 /  (poucos)\
                /____________\
               /              \
              /  Integração    \
             /    (alguns)      \
            /____________________\
           /                      \
          /       Unitários         \
         /         (muitos)          \
        /______________________________\
```

### Camada 1 — Testes Unitários (70% dos testes)

**O que testam no Rafe:** A lógica pura dentro do Domain e dos Value Objects do Shared Domain. São os testes mais importantes do sistema porque o Domain contém as regras de negócio que têm cumprimento legal em Angola.

**Exemplos concretos:**

```
Domain — Facturação:
  ✅ Factura calcula total com IVA de 14% correctamente
  ✅ Factura aplica retenção na fonte de 6.5% em serviços
  ✅ ItemFactura rejeita quantidade zero
  ✅ ItemFactura rejeita quantidade acima do stock
  ✅ Nota de crédito não pode exceder valor da factura original

Domain — Stock:
  ✅ MovimentoStock rejeita entrada com quantidade negativa
  ✅ CustoMedioPonderado calcula correctamente com dois lotes
  ✅ Produto com data de expiração vencida é rejeitado

Domain — Financeiro:
  ✅ Caixa não pode ser fechada se já estiver fechada
  ✅ MovimentoCaixa rejeita valor zero
  ✅ Reconciliação bancária detecta divergências

Shared Domain:
  ✅ Dinheiro rejeita valores negativos
  ✅ Dinheiro soma correctamente dois valores em AOA
  ✅ Dinheiro aplica IVA de 14% correctamente
  ✅ NIF angolano com formato inválido é rejeitado
  ✅ NIF com comprimento incorrecto é rejeitado
```

**Velocidade:** Milissegundos. Podem correr centenas por segundo sem BD, sem rede, sem nada externo.

---

### Camada 2 — Testes de Integração (20% dos testes)

**O que testam no Rafe:** Se os Adapters comunicam correctamente com o MySQL. Se o Service orquestra correctamente todas as dependências. Se o Container monta as peças certas.

**Exemplos concretos:**

```
Adapters MySQL:
  ✅ MySQLFacturaRepo guarda factura e recupera pelo id
  ✅ MySQLClienteRepo lista clientes ordenados por nome
  ✅ MySQLProdutoRepo actualiza stock após venda
  ✅ MySQLCaixaRepo encontra caixa aberta do dia

Services com Fakes:
  ✅ CriarFacturaReciboService orquestra recolha, domain e efeitos
  ✅ EntradaStockService actualiza CMP após nova entrada
  ✅ FecharCaixaService rejeita fechar caixa já fechada

AGT Adapter:
  ✅ AGTAdapter formata o JSON da factura no formato da AGT
  ✅ AGTAdapter trata resposta de erro da AGT correctamente
```

**Velocidade:** Segundos. Precisam de BD de teste configurada.

---

### Camada 3 — Testes E2E (10% dos testes)

**O que testam no Rafe:** Fluxos completos do utilizador — do request HTTP até à resposta JSON, passando por toda a cadeia: Router → Middleware → Controller → Service → Domain → Adapter → BD.

**Exemplos concretos:**

```
Fluxo de Facturação:
  ✅ POST /api/facturas/recibo com dados válidos → factura criada + comunicada à AGT
  ✅ POST /api/facturas/recibo sem token → 401 Unauthorized
  ✅ POST /api/facturas/recibo com stock insuficiente → 400 com mensagem clara

Fluxo de Stock:
  ✅ POST /api/stock/entrada → stock actualizado + CMP recalculado
  ✅ GET /api/stock/produtos → lista com quantidades actuais

Fluxo de Caixa:
  ✅ POST /api/caixa/abrir → caixa aberta com saldo inicial
  ✅ POST /api/caixa/fechar → caixa fechada com relatório de fecho
```

**Velocidade:** Minutos. O E2E só diz *que* há um erro — os unitários e de integração dizem *onde*.

---

## 4. Stub, Mock, Spy e Fake no Rafe

A Arquitectura Hexagonal do Rafe foi desenhada exactamente para facilitar o uso destas técnicas. Os Ports de saída são as **costuras perfeitas** onde Stubs, Mocks, Spies e Fakes encaixam.

---

### 🟡 Stub no Rafe — "O Figurante"

**Onde aparece:** Quando testamos o Domain ou o Service e precisamos que uma dependência retorne algo, mas não nos importamos com o comportamento dela.

**Situação real:** Testar se `CriarFacturaReciboService` calcula correctamente o total da factura. Para isso, o Service precisa de ir buscar o cliente e o produto — mas o que importa é o cálculo, não de onde vieram os dados.

```
Stub do RepositorioDeClientes:
  → Seja qual for o id pedido, devolve sempre:
    Cliente { nome: "Empresa ABC", nif: "500123456" }
  → Não tens de criar nada na BD
  → O teste foca-se só no cálculo

Stub do RepositorioDeProdutos:
  → Seja qual for o id pedido, devolve sempre:
    Produto { nome: "Óleo", precoUnitario: 1500 AOA, iva: 14% }
```

**Onde no código Rafe:** Os `FakeClienteRepo` e `FakeProdutoRepo` da pasta `Tests/Fakes/` actuam como Stubs quando apenas devolvem dados fixos sem verificar nada.

---

### 🔵 Mock no Rafe — "O Fiscal"

**Onde aparece:** Quando precisamos de provar que o Service chamou uma dependência externa — e com os argumentos correctos. Especialmente importante para a **AGT** e para o **Email**.

**Situação real:** Depois de criar uma factura-recibo, o sistema **tem de** comunicar à AGT. Esta é uma obrigação legal. O Mock garante que essa chamada aconteceu — com a factura correcta.

```
Mock do ComunicadorAGT:
  → Substitui completamente o AGTAdapter real
  → Nenhuma chamada real é feita à AGT
  → Regista: "foi chamado 1 vez, com a Factura nº FR-2025-001"
  → No final do teste, verificas esse registo:
      "O comunicador AGT foi chamado com a factura correcta? Sim ✅"
  → Se o Service "esqueceu" de comunicar → teste falha ❌

Mock do EnviadorDeEmail:
  → Nenhum email é enviado de verdade
  → Regista: "foi chamado com destinatário cliente@empresa.ao"
  → Verificas: o email foi para o cliente certo com o assunto certo?
```

**Porquê é crítico no Rafe:** A comunicação com a AGT é legal. Um Mock garante que o código nunca "esquece" de comunicar — algo que só descobririas em produção com multas da AGT.

---

### ⚪ Spy no Rafe — "A Câmara"

**Onde aparece:** Quando queremos que um serviço interno funcione de verdade, mas confirmar que foi chamado. Útil para serviços de logging e de cache internos.

**Situação real:** O sistema tem um serviço interno de logging que regista todas as operações para auditoria (exigência legal SAFT-AO). Queres que o logging funcione normalmente — mas confirmar que cada acção ficou registada.

```
Spy no ServiçoDeAuditoria:
  → O serviço de auditoria funciona normalmente — regista de verdade
  → Mas o Spy está a observar nos bastidores
  → No final confirmas: "a criação da factura foi auditada? Sim ✅"
  → O registo de auditoria existe mesmo — o Spy só confirmou que aconteceu
```

**Diferença para o Mock no contexto do Rafe:**
- **Mock** → A AGT não é chamada de verdade (não podes fazer chamadas reais à AGT nos testes)
- **Spy** → O serviço de auditoria funciona de verdade (pode registar — não há problema)

---

### ⚫ Fake no Rafe — "A Maquete"

**Onde aparece:** Em todo o lado. O Rafe já tem Fakes definidos na secção 5.5 da arquitectura — é o padrão central de testes do sistema.

**O Rafe já tem estes Fakes:**

```
Tests/Fakes/
  ├── FakeFacturaRepo      → implementa RepositorioDeFacturas, guarda em memória
  ├── FakeClienteRepo      → implementa RepositorioDeClientes, guarda em memória
  ├── FakeProdutoRepo      → implementa RepositorioDeProdutos, guarda em memória
  ├── FakeCaixaRepo        → implementa RepositorioDeCaixa, guarda em memória
  ├── FakeAGTAdapter       → implementa ComunicadorAGT, não chama a AGT
  └── FakeEmailAdapter     → implementa EnviadorDeEmail, não envia emails
```

**Porquê os Fakes funcionam tão bem no Rafe:** Porque a Arquitectura Hexagonal usa Ports (interfaces). O Fake implementa o mesmo Port que o Adapter real — o Service não sabe a diferença. Em produção recebe `MySQLFacturaRepo`, nos testes recebe `FakeFacturaRepo`. O código do Service não muda.

```
Produção:   CriarFacturaReciboService(MySQLFacturaRepo, AGTAdapter, SMTPEmailAdapter)
Testes:     CriarFacturaReciboService(FakeFacturaRepo,  FakeAGT,    FakeEmail)
                                       ↑ mesma interface, implementação diferente
```

---

### Numa Feature Completa — Todos os Quatro Juntos

**Feature: Criar Factura-Recibo**

```
Para testar CriarFacturaReciboService precisamos de:

STUB   → FakeClienteRepo devolve cliente fixo (não nos importa de onde)
STUB   → FakeProdutoRepo devolve produto fixo (não nos importa de onde)
FAKE   → FakeFacturaRepo guarda em memória (queremos confirmar que foi guardado)
FAKE   → FakeCaixaRepo com caixa aberta em memória
MOCK   → FakeAGTAdapter verifica se a AGT foi "chamada" com os dados certos
MOCK   → FakeEmailAdapter verifica se o email foi "enviado" para o cliente
```

Sim — numa só feature podes precisar dos quatro. E no Rafe isso é natural porque cada dependência tem o seu Port e pode ser substituída independentemente.

---

## 5. BDD e ATDD no Rafe

### BDD — Descrever Comportamentos em Linguagem de Negócio

O BDD é especialmente valioso no Rafe porque o sistema tem **regras legais angolanas** complexas. Escrever os comportamentos em linguagem natural garante que todos — programadores e stakeholders — concordam sobre o que o sistema deve fazer antes de uma linha de código ser escrita.

**Módulo de Facturação:**

```gherkin
Feature: Emissão de Factura-Recibo

  Scenario: Emissão com sucesso
    Given que a caixa está aberta
    And o cliente "Empresa ABC" com NIF "500123456" existe no sistema
    And o produto "Óleo Alimentar" tem 20 unidades em stock
    When o operador emite uma factura-recibo com 5 unidades de "Óleo Alimentar"
    Then a factura deve ser criada com IVA de 14%
    And o stock deve ficar com 15 unidades
    And a factura deve ser comunicada à AGT
    And o cliente deve receber o recibo por email

  Scenario: Emissão com stock insuficiente
    Given que o produto "Óleo Alimentar" tem 3 unidades em stock
    When o operador tenta emitir factura com 5 unidades
    Then o sistema deve rejeitar com "Stock insuficiente para Óleo Alimentar"
    And nenhuma factura deve ser criada
    And a AGT não deve ser contactada

  Scenario: Emissão com caixa fechada
    Given que não existe caixa aberta
    When o operador tenta emitir uma factura
    Then o sistema deve rejeitar com "Caixa não está aberta"
```

**Módulo de Stock:**

```gherkin
Feature: Entrada de Mercadoria

  Scenario: Entrada com cálculo de CMP
    Given que o produto "Açúcar" tem 100 unidades a 500 AOA cada
    When entram mais 50 unidades a 600 AOA cada
    Then o Custo Médio Ponderado deve ser 533,33 AOA
    And o stock total deve ser 150 unidades
```

---

### ATDD — Critérios de Aceitação Definidos em Equipa

O ATDD é o momento antes de qualquer código — a equipa define juntos o que significa "pronto".

**Feature: Geração do SAFT-AO**

```
Reunião entre: Dev + Contabilista (representa o negócio) + QA

Critérios de aceitação definidos em conjunto:

  ✅ O ficheiro XML gerado deve respeitar o esquema SAFT-AO 1.04
  ✅ Todas as facturas do período devem estar incluídas
  ✅ O total do ficheiro deve bater certo com os totais da BD
  ✅ Facturas anuladas devem aparecer como anuladas, não ausentes
  ✅ O NIF da empresa emissora deve estar correcto
  ❌ NÃO é aceite se o ficheiro demorar mais de 30 segundos a gerar
  ❌ NÃO é aceite se gerar um ficheiro vazio sem erro visível
```

Só depois disto o Dev escreve o `GerarSAFTAOService`.

---

## 6. Testes de Contrato, Performance, Segurança, Regressão e Mutação no Rafe

### 🎭 Testes de Contrato

**Onde se aplica no Rafe:** Na comunicação entre o frontend JavaScript (POS) e a API PHP.

O frontend e o backend são desenvolvidos separadamente. Se o backend mudar a estrutura da resposta sem avisar, o POS quebra.

**Contrato — Resposta de Factura Criada:**

```
A API promete devolver sempre:
  {
    "factura": {
      "numero": string,
      "total": number (em AOA),
      "iva": number,
      "data": string (formato ISO),
      "cliente": { "nome": string, "nif": string }
    }
  }

O frontend promete aceitar exactamente isso.
```

Se alguém mudar `"total"` para `"valor_total"` no backend, o teste de contrato detecta antes de chegar ao POS em produção.

---

### ⚡ Testes de Performance

**Onde se aplica no Rafe:** O sistema é um POS — ponto de venda. Num cenário de fim de mês ou de evento, pode ter muitos utilizadores a emitir facturas ao mesmo tempo.

```
Teste de Carga:
  Simulação: 50 operadores a emitir facturas em simultâneo
  Meta: cada factura deve ser processada em menos de 2 segundos
  Alerta: se passar de 5 segundos, há um problema

Teste de Stress:
  Simulação: aumentar até o sistema abrandar
  Meta: identificar o ponto de quebra antes de ir para produção

Teste de Resistência:
  Simulação: sistema a funcionar durante 8 horas seguidas (dia de trabalho)
  Meta: sem memory leaks, sem degradação de velocidade
  Risco identificado: worker.php em loop infinito — monitorizar consumo de memória
```

---

### 🔒 Testes de Segurança

**Onde se aplica no Rafe:** O sistema lida com dados fiscais — facturas, NIFs, valores financeiros. Uma vulnerabilidade pode ter consequências legais graves.

O Rafe já mapeia OWASP por camada — os testes de segurança validam que esse mapeamento funciona:

```
A01 — Broken Access Control:
  Teste: Um utilizador sem permissão consegue aceder a POST /api/facturas?
  Esperado: 401 Unauthorized do AuthMiddleware

A03 — SQL Injection:
  Teste: Enviar NIF = "' OR 1=1 --" no corpo do pedido
  Esperado: Prepared statements do MySQLClienteRepo bloqueiam o ataque

A03 — XSS:
  Teste: Enviar observação = "<script>alert('xss')</script>"
  Esperado: htmlspecialchars no Controller neutraliza o script

A08 — Mass Assignment:
  Teste: Enviar campos extra no JSON (ex: "is_admin": true)
  Esperado: Controller usa lista branca — campos extra são ignorados

Força Bruta no Login:
  Teste: 10 tentativas de login falhadas em sequência
  Esperado: Conta bloqueada temporariamente
```

---

### 📸 Testes de Regressão

**Onde se aplica no Rafe:** Em cada Pull Request — antes de qualquer código novo entrar no repositório, todos os testes correm automaticamente.

**Cenário real:**

```
Semana 1: CriarFacturaReciboService está perfeito — testes passam ✅
Semana 3: Um programador adiciona suporte a descontos comerciais
Semana 3: Sem querer, o cálculo do IVA ficou errado
Semana 3: Testes de regressão detectam imediatamente ❌
           "CriarFacturaReciboService — cálculo IVA 14% FALHOU"
Semana 3: Corrige antes de fazer commit — nenhum cliente é afectado
```

Sem regressão, o erro só seria descoberto quando um cliente reclamasse uma factura errada — com implicações fiscais.

**O que corre em cada commit no Rafe:**

```
1. Todos os testes unitários do Domain (rápido — segundos)
2. Todos os testes de integração (médio — minutos)
3. Testes E2E dos fluxos críticos (lento — só nos deploys)
```

---

### 🧪 Testes de Mutação

**Onde se aplica no Rafe:** No Domain — especialmente nas regras de cálculo de IVA, retenção na fonte e CMP.

O teste de mutação sabota o código do Domain e verifica se os testes detectam a sabotagem:

```
Código original em ItemFactura:
  "Se quantidade > stockActual → rejeitar"

Mutação introduzida:
  "Se quantidade < stockActual → rejeitar"   ← lógica invertida

Os testes do Rafe detectaram?
  Sim → Os testes são robustos ✅
  Não → Os testes são fracos mesmo que passem ❌

---

Código original em Dinheiro:
  "aplicarIVA(14) → valor * 1.14"

Mutação introduzida:
  "aplicarIVA(14) → valor * 1.41"   ← taxa errada

Os testes detectaram?
  Devem detectar imediatamente — este cálculo é crítico para conformidade fiscal.
```

**Porquê é importante no Rafe:** O sistema lida com obrigações fiscais angolanas. Um erro de cálculo no IVA ou na retenção na fonte que os testes não detectam pode gerar multas da AGT. O teste de mutação garante que os testes são suficientemente bons para apanhar esses erros.

---

## 7. Estrutura de Pastas de Testes no Rafe

```
/
└── tests/
    │
    ├── Unit/                              ← Testes Unitários (70%)
    │   ├── Shared/
    │   │   ├── DinheiroTest.php           ← testa AOA, IVA, somas
    │   │   ├── NIFTest.php                ← testa validação NIF angolano
    │   │   └── PeriodoFiscalTest.php
    │   │
    │   └── Modules/
    │       ├── Facturacao/
    │       │   ├── FacturaTest.php        ← regras da factura
    │       │   ├── ItemFacturaTest.php    ← stock, quantidade, preço
    │       │   ├── LinhaIVATest.php       ← cálculo IVA 14%
    │       │   └── RetencaoFonteTest.php  ← retenção 6.5%
    │       ├── Stock/
    │       │   ├── ProdutoTest.php
    │       │   ├── MovimentoStockTest.php
    │       │   └── CustoMedioPonderadoTest.php
    │       ├── Financeiro/
    │       │   ├── CaixaTest.php
    │       │   └── MovimentoCaixaTest.php
    │       └── Clientes/
    │           ├── ClienteTest.php
    │           └── LimiteCreditoTest.php
    │
    ├── Integration/                       ← Testes de Integração (20%)
    │   ├── Adapters/
    │   │   ├── MySQLFacturaRepoTest.php
    │   │   ├── MySQLClienteRepoTest.php
    │   │   ├── MySQLProdutoRepoTest.php
    │   │   └── MySQLCaixaRepoTest.php
    │   └── Services/
    │       ├── CriarFacturaReciboServiceTest.php
    │       ├── EntradaStockServiceTest.php
    │       └── FecharCaixaServiceTest.php
    │
    ├── E2E/                               ← Testes End-to-End (10%)
    │   ├── FacturacaoFluxoTest.php        ← POST /api/facturas/recibo
    │   ├── StockFluxoTest.php             ← POST /api/stock/entrada
    │   └── CaixaFluxoTest.php             ← POST /api/caixa/abrir + fechar
    │
    └── Fakes/                             ← Fakes reutilizáveis por todos os testes
        ├── FakeFacturaRepo.php
        ├── FakeClienteRepo.php
        ├── FakeProdutoRepo.php
        ├── FakeCaixaRepo.php
        ├── FakeAGTAdapter.php
        └── FakeEmailAdapter.php
```

---

## 8. Regras de Ouro dos Testes no Rafe

Estas regras nunca se quebram — são o complemento directo das Regras de Ouro da Arquitectura Hexagonal.

### 1. O Domain é sempre testável sem BD, sem rede, sem nada externo
O Domain do Rafe não conhece nada externo — por isso os seus testes correm em qualquer máquina, sem configuração, em milissegundos.

### 2. Cada Fake implementa o mesmo Port que o Adapter real
`FakeFacturaRepo implements RepositorioDeFacturas` — exactamente como `MySQLFacturaRepo`. O Service não sabe a diferença.

### 3. Um teste testa uma coisa só
Se o teste falha, tens de saber imediatamente o que está errado. Um teste que testa cinco coisas ao mesmo tempo é inútil quando falha.

### 4. Os testes do Domain cobrem 95%+ do código do Domain
As regras de IVA, retenção na fonte, stock e CMP têm de estar todas cobertas. São obrigações legais.

### 5. Nenhum teste de integração usa a BD de produção
Os testes de integração usam uma BD de teste separada — ou os Fakes. Nunca a BD real.

### 6. Os testes de regressão correm em cada commit
Antes de qualquer código entrar no repositório, todos os testes unitários correm automaticamente. Os testes de integração correm antes de cada deploy.

### 7. A cobertura é um indicador, não um objectivo
95% de cobertura com testes que verificam algo real é infinitamente melhor que 100% com testes vazios.

---

*Documento preparado com base na arquitectura do sistema Rafe e nos conceitos de TDD, BDD, ATDD e estratégias de teste.*
*Próximo passo natural: implementar os Fakes da pasta `Tests/Fakes/` e começar pelos testes unitários do Shared Domain — `DinheiroTest.php` e `NIFTest.php`.*
