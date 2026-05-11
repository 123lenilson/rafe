
O conceito foi criado por **Mike Cohn** e responde a uma pergunta simples:

> _"Quantos testes de cada tipo devo ter no meu projecto?"_

---

## A Pirâmide

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

**Quanto mais alto na pirâmide → menos testes, mais lentos e mais caros.** **Quanto mais baixo na pirâmide → mais testes, mais rápidos e mais baratos.**

---

## Cada Camada Explicada

### 🟢 Base — Testes Unitários

São a **fundação** de tudo. Testam uma coisa só, de forma isolada, sem depender de nada externo.

**No delivery:**

- Calcular o total do pedido
- Validar se o email do cliente tem formato correcto
- Verificar se o desconto é aplicado correctamente

**Características:**

```
Quantidade  → Muitos (70% do total)
Velocidade  → Milissegundos
Custo       → Muito barato
Feedback    → Imediato
```

---

### 🟡 Meio — Testes de Integração

Testam se **dois ou mais componentes funcionam bem juntos**. Já envolvem dependências reais ou quase reais.

**No delivery:**

- O serviço de pedidos comunica correctamente com a base de dados?
- O serviço de pagamento recebe e processa os dados certos?
- A API devolve a resposta correcta quando chamada?

**Características:**

```
Quantidade  → Alguns (20% do total)
Velocidade  → Segundos
Custo       → Médio
Feedback    → Demorado
```

---

### 🔴 Topo — Testes E2E (End-to-End)

Testam o **fluxo completo do utilizador**, do início ao fim. Simulam um utilizador real a usar o sistema.

**No delivery:**

- Cliente abre o app → escolhe restaurante → adiciona itens → paga → recebe confirmação
- Cliente tenta pagar com cartão inválido → vê mensagem de erro → tenta novamente

**Características:**

```
Quantidade  → Poucos (10% do total)
Velocidade  → Minutos
Custo       → Caro
Feedback    → Muito demorado
```

---

## Porque é uma Pirâmide e não um Rectângulo?

Imagina que tens **100 testes só E2E** e nenhum unitário. O que acontece?

```
❌ Os testes demoram horas a correr
❌ Quando um falha, não sabes onde está o problema
❌ São frágeis — qualquer mudança pequena quebra tudo
❌ A equipa começa a ignorá-los porque são lentos
```

Agora imagina **100 testes unitários e nenhum E2E**:

```
❌ Cada peça funciona isolada
❌ Mas não sabes se o sistema funciona como um todo
❌ O cliente pode ter uma experiência horrível mesmo com tudo "verde"
```

A pirâmide encontra o **equilíbrio certo** entre os três.

---

## O Anti-Padrão — O Cone de Gelado

Muitas equipas fazem exactamente o oposto da pirâmide:

```
        /____________________\
       /                      \
      /         E2E            \
     /        (muitos)          \
    /____________________________\
   /                              \
  /        Integração              \
 /           (alguns)               \
/______________________________________\
/                                        \
/            Unitários                    \
/              (poucos)                    \
/____________________________________________\
```

O resultado é uma suite de testes **lenta, frágil e cara** — que a equipa acaba por não confiar nem executar.

---

## Aplicado ao Delivery — Distribuição Ideal

```
UNITÁRIOS (70%)
├── Cálculo de totais e taxas
├── Validações de dados do cliente
├── Regras de desconto e promoções
├── Formatação de endereços
└── Lógica de atribuição de estafeta

INTEGRAÇÃO (20%)
├── Serviço de pedidos + base de dados
├── Serviço de pagamento + API do banco
├── Serviço de notificação + email
└── API + autenticação

E2E (10%)
├── Fluxo completo de fazer um pedido
├── Fluxo de cancelamento
└── Fluxo de pagamento falhado
```

---

## A Regra de Ouro da Pirâmide

> _"Se um teste unitário pode cobrir isto, não precisas de um teste de integração. Se um teste de integração pode cobrir isto, não precisas de um E2E."_

Sempre que possível, **desce na pirâmide**. Testes mais baixos são mais rápidos, mais baratos e mais fáceis de manter.

---

Queres que avancemos para os **Testes de Integração** em detalhe, ou preferes entender melhor como a pirâmide se aplica numa equipa real no dia a dia?