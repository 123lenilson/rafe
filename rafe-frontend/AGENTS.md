# AGENTS.md — Rafe Frontend

Este ficheiro define apenas **comportamento do agente**. Regras de sistema (arquitectura de código, cores, tipografia, espaçamento, layout) vivem noutros ficheiros, e devem ser consultadas conforme a tarefa:
- Arquitectura de código, componentes, estado: `skill-arquitetura.md`
- Identidade visual, cores, tipografia, espaçamento, layout, animações: `skill-identidade-visual.md`
- Em qualquer tarefa que toque em UI (componentes visuais, espaçamento, tamanhos, cores, layout, Sheet/Drawer/Modal), é obrigatório ler `skill-identidade-visual.md` antes de escrever código. Nunca uses `px` fora da moldura definida nessa skill.
## Regras que valem para TODA a tarefa
- Antes de qualquer tarefa, ler `.agents/skills/fluxo-de-trabalho/SKILL.md`.
  Resumo: nunca rodar dev/build nem verificar a interface por browser ou
  screenshots; o utilizador valida no navegador. Só `tsc --noEmit`, lint e
  releitura do código são permitidos.

## Escopo estrito de implementação
Estas regras são obrigatórias para qualquer tarefa, visual ou não, em qualquer ficheiro do projecto.
- Implementa exactamente o que foi pedido no prompt, nada mais e nada menos. Não adiciones estados de hover, efeitos de clique, animações, transições, componentes de feedback visual (cards, badges, toasts, banners de estado), textos auxiliares, ou qualquer interacção, elemento ou comportamento que não tenha sido explicitamente descrito no prompt, mesmo que pareça "natural", "esperado" ou "uma melhoria óbvia" para o elemento em questão.
- Nunca reintroduzas, restaures ou "adivinhes" uma versão anterior de uma interacção que já foi deliberadamente alterada ou removida em prompts anteriores, mesmo que essa versão anterior ainda esteja presente no histórico de conversa ou em código comentado.
- Preserva sempre, sem excepção, todo o comportamento, estado, estilo e componentes já existentes que não foram mencionados no prompt actual. Uma tarefa focada num elemento (ex: um input, um botão) nunca deve alterar elementos vizinhos ou o fluxo de interacção geral à sua volta, salvo pedido explícito.
- Se identificares uma funcionalidade em falta, uma inconsistência, ou uma melhoria que consideres relevante mas que não foi pedida, não implementes por conta própria: reporta a sugestão em texto no final da resposta e aguarda confirmação antes de tocar em código.
- Em caso de dúvida entre fazer menos ou fazer mais do que o prompt pede, escolhe sempre fazer menos.

## Uso de modos (Kilo CLI)
- Para qualquer tarefa que envolva decisão de arquitectura ou múltiplos ficheiros: usar modo `Plan` primeiro, apresentar o plano, aguardar aprovação antes de mudar para `Code`.
- Para dúvidas sobre código existente sem intenção de alterar: usar modo `Ask`.
- Após qualquer alteração: correr modo `Review` antes de considerar a tarefa concluída, reportando apenas o que foi encontrado — não corrigir automaticamente sem confirmação.