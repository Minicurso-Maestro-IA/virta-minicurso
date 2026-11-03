# Virta — minicurso

App de carteira pessoal usado no minicurso de IA generativa. **Ele tem defeitos
de propósito**: cada um é uma tarefa para você resolver com um agente de IA.

- **Site:** publicado pelo GitHub Pages a cada push na `main`
- **Tarefas:** na aba [Issues](../../issues) deste repositório
- **Quadro:** o board do projeto, onde os cards andam do Backlog ao Done

---

## Rodar na sua máquina

```bash
git clone https://github.com/Minicurso-Maestro-IA/virta-minicurso.git
cd virta-minicurso
npm install
npm run dev
```

É só isso. **Não tem backend, não tem banco para instalar, não tem variável de
ambiente para configurar.**

Os dados vivem no `localStorage` do navegador e são criados sozinhos na primeira
abertura, com oito transações de exemplo. O botão **Recomeçar dados** devolve
tudo ao estado inicial — use sem medo quando bagunçar testando.

Para conferir que seu conserto compila:

```bash
npm run build
```

Esse comando aparece no **Pronto quando** de quase toda tarefa. Ele roda o
TypeScript junto, então pega erro que o navegador não mostra.

---

## O caminho de uma tarefa

1. Pegue um card do **Backlog**, mova para **Em andamento** e se atribua.
2. Leia o card inteiro antes de abrir o código. Olhe principalmente o
   **Pronto quando** (seu critério de parada) e **A pergunta** (o que você vai
   responder no fim, e que a IA não responde por você).
3. Trabalhe com o agente, no orquestrador ou na CLI.
4. **Leia o diff** antes de aceitar. Três perguntas, sempre:
   - mexeu só no que a tarefa pedia?
   - você entende cada linha?
   - apagou alguma coisa? (olhe as linhas com `-`, não só as com `+`)
5. Rode `npm run build` e **olhe a tela**. Build passando não quer dizer tela
   certa — foi exatamente assim que estes defeitos chegaram aqui.
6. Responda **A pergunta** nos comentários do card.
7. Mova para **Revisão**.

---

## Estrutura

```
src/
  App.tsx                      a página: abas, lista e resumo
  tipos.ts                     os tipos compartilhados
  lib/formato.ts               moeda e data no padrão brasileiro
  mock/db.ts                   o "banco": dados no navegador, com semente
  components/
    ListaTransacoes.tsx        a lista
    CategoriaBadge.tsx         a etiqueta de categoria
    Resumo.tsx                 os cartões e o gráfico
    NovaTransacao.tsx          o formulário
```

`lib/formato.ts` merece atenção: as funções de formatação **já existem e
funcionam**. Mais de uma tarefa é sobre usar o que está lá, não escrever
formatação nova — duas formatações no mesmo app divergem com o tempo, e aí
ninguém sabe qual é a certa.

---

## Escrevendo uma tarefa

Na aula, cada grupo escreve uma tarefa e **outro grupo executa**. Ao abrir uma
issue, o formulário pede quatro seções:

| Seção | O erro a evitar |
|---|---|
| **O sintoma** | diagnosticar em vez de descrever — se o seu diagnóstico estiver errado, leva o outro grupo junto |
| **Onde olhar** | entregar a linha do conserto, o que transforma a tarefa em digitação |
| **Pronto quando** | critério que depende de opinião ("tem que ficar bom") |
| **A pergunta** | não ter nenhuma, e a tarefa virar só "o agente consertou" |

Antes de entregar, leia o seu texto como se você fosse o outro grupo, sem nada
do que vocês conversaram. Dá para reproduzir? Dá para saber quando parar?
