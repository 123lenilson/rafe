# Rafe — Sistema de Facturação POS

## O que é isto

Sistema de Facturação SaaS para pequenas e médias empresas angolanas (PMEs). O módulo POS (ponto de venda) permite emitir documentos fiscais conformes com a legislação angolana (SAFT-AO, AGT), gerir pedidos de venda e controlar stock em tempo real. Desenvolvido com Arquitectura Hexagonal (Ports & Adapters) — Domain e Services em PHP puro, Adapters via Laravel.

## Valor Central

O Domain de negócio tem de ser completamente isolado de qualquer infraestrutura — testável sem base de dados, sem HTTP, sem framework — para garantir que as regras fiscais angolanas são correctamente implementadas e verificáveis.

## Current State (v1.0 Shipped)

- **Domain POS**: Entidades de negócio (`Pedido`, `LinhaVenda`, `DocumentoFiscal`, `ItemPedido`) 100% testadas e isoladas.
- **Ports de Suporte**: Interfaces para Stock, Clientes, Pagamentos e Transacção definidas.
- **Services POS**: `GerirPedidoService` e `FinalizarVendaService` implementados com gestão atómica de estado.
- **Fake Adapters**: Camada de repositórios em memória concluída e operacional para suportar testes BDD.
- **Qualidade**: 100% BDD Coverage, Testes Unitários a Verde e 100% MSI (Infection).

## Next Milestone Goals (v2.0)

- **Adapters de Saída**: Implementar repositórios em Eloquent (MySQL) ligando os Ports do Módulo POS, Stock e Clientes.
- **Adapters de Entrada**: Criar os Controllers, Middlewares e Rotas Laravel (API HTTP).
- **Testes de Integração**: Testar o ciclo completo desde o HTTP até à Base de Dados.

<details>
<summary>Histórico Anterior (v0.1 - Planeamento)</summary>

### Requisitos Validados
- ✓ **POS-DOM-01** — `ItemPedido` com regras de negócio (quantidade, preço, desconto) — Domain Phase 1
- ✓ **POS-DOM-02** — `Pedido` como agregado de `ItemPedido` com validações de estado — Domain Phase 1
- ✓ **POS-DOM-03** — `LinhaVenda` com cálculo de subtotal, imposto e retenção — Domain Phase 1
- ✓ **POS-DOM-04** — `DocumentoFiscal` com cálculo de totais (ilíquido, IVA, retenção, a pagar) — Domain Phase 1
- ✓ **POS-TEST-01** — Cobertura completa BDD + unitários + mutação (Infection) para todo o Domain POS — Domain Phase 1

### Fora do Âmbito
- Adapters Laravel (Eloquent, Controllers, Routes, Middleware) — implementados numa fase posterior após os Services estarem validados
- Frontend React — foco posterior ao backend estar completo
- Integração AGT (comunicação real) — fase posterior (após Services e Adapters estarem estáveis)
- Exportação SAFT-AO — fase posterior
- Módulos Financeiro, Compras, Relatórios — fases posteriores
- Autenticação e multi-tenancy — fora do âmbito do Milestone 1
</details>

## Contexto

**Arquitectura:** Hexagonal (Ports & Adapters)
- Hexágono (Domain + Services + Ports): PHP puro, sem framework
- Adapters de Entrada: Laravel (Controllers, Routes, Middleware) — fase posterior
- Adapters de Saída: Laravel (Eloquent ORM), AGT, Email — fase posterior
- Comunicação entre módulos: exclusivamente por Ports (interfaces PHP puras)

**Metodologia de desenvolvimento:**
1. Escrever feature em BDD (Behat) — accordar cenários
2. Escrever testes unitários (vermelho)
3. Criar a classe (verde)
4. Correr testes de mutação com Infection (sobreviver a mutantes)
5. Só então avançar para a próxima classe

**Stack:**
- PHP 8.3 + Laravel 13 (scaffold)
- PHPUnit 12 + Mockery + Infection (mutation testing)
- MySQL (base de dados)
- React + Vite (frontend — fase posterior)
- XAMPP/WAMP no Windows (servidor local)

## Restrições

- **Arquitectura**: Domain e Services em PHP puro — nunca tocar em PDO, Eloquent, `$_SERVER` ou qualquer artefacto de framework dentro do Hexágono
- **Módulos**: Cada módulo é uma ilha — sem imports directos entre módulos (sempre via Port)
- **Testes**: Nenhuma classe avança sem cobertura BDD + unitária + mutação
- **Plataforma**: Windows (XAMPP/WAMP) — comandos de shell devem ser compatíveis
- **Base de dados**: MySQL (não SQLite, não PostgreSQL)

## Decisões-Chave

| Decisão | Justificação | Estado |
|---------|-------------|--------|
| PHP puro para o Hexágono (sem Laravel no Domain) | Isola regras fiscais de qualquer framework; testabilidade máxima | ✓ Validado |
| Laravel apenas nos Adapters | Permite trocar o framework sem tocar nas regras de negócio | ✓ Validado |
| BDD → Unit → Mutation como metodologia obrigatória | Garante que cada classe tem comportamento especificado, implementado e resistente a mutantes | ✓ Validado |
| Ports de suporte antes dos Services | Services dependem de dados externos; Ports desbloqueiam o desenvolvimento sem esperar pelos Adapters | ✓ Validado |
| Fake Adapters para testes dos Services | Permite testar Services sem BD real; alinha com a arquitectura Hexagonal | ✓ Validado |
| TransacaoPort para gerir atomicidade | Isola o Service da implementação `DB::transaction` do Laravel | ✓ Validado |
| Módulo POS (não "Facturação") | Nome reflecte o ponto de entrada comercial do sistema | ✓ Validado |

---
*Última actualização: 2026-05-01 — Encerramento da v1.0*
