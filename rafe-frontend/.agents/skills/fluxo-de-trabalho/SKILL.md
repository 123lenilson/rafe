---
name: fluxo-de-trabalho
description: Regras de verificação e fecho de qualquer tarefa no Rafe Frontend. Usar SEMPRE, em toda a tarefa (lógica, estado, componentes ou visual), antes de decidir como verificar o trabalho e ao escrever o resumo final. Define o que o agent pode e não pode rodar, e como reportar o resultado.
---

# Verificação do trabalho

O utilizador valida o resultado final (interface e comportamento) por si,
abrindo o projecto no navegador. O agent NÃO deve gastar tokens nem memória
do PC a tentar ver o resultado.

## Proibido
- Rodar `npm run dev`, `npm run build` ou qualquer servidor/processo longo
- Abrir navegador, Playwright, Puppeteer ou outra automação de browser
- Tirar screenshots ou inspecionar a interface renderizada

## Permitido (verificações leves)
- Reler o código alterado e confirmar que é coerente
- Typecheck (`tsc --noEmit`) e lint
- Testes unitários pontuais e directamente relacionados com a mudança

Se o utilizador avisar que o PC está pesado com `tsc` ou lint, deixar de os
rodar e verificar apenas relendo o código.

## Ao terminar
- Resumir o que foi alterado, ficheiro a ficheiro
- Indicar que página/rota o utilizador deve abrir para conferir
- Nunca afirmar "testei visualmente" ou "confirmei no browser"
- Se algo só se confirma a correr, dizê-lo e deixar a decisão ao utilizador