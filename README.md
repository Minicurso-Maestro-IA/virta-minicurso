# Virta — fork do minicurso

Este é o **virta de verdade**, o app de controle financeiro, adaptado para a
aula: o backend Java foi substituído por um servidor falso que roda dentro do
próprio navegador. Todas as telas funcionam, e **alguns defeitos visuais foram
plantados de propósito** — cada um é uma tarefa.

- **Site:** https://minicurso-maestro-ia.github.io/virta-minicurso/
- **Tarefas:** na aba [Issues](../../issues)
- **Entrar:** `maria@virta.com` / `123456` (ou cadastre-se; é tudo no navegador)

---

## Rodar na sua máquina

```bash
git clone https://github.com/Minicurso-Maestro-IA/virta-minicurso.git
cd virta-minicurso
npm install
npm run dev
```

**Não precisa de backend, banco, Java nem variável de ambiente.** Os dados vivem
no `localStorage` e são semeados na primeira abertura.

Para conferir que seu conserto compila — comando que aparece no *Pronto quando*
de toda tarefa:

```bash
npm run build
```

## Como funciona sem backend

O virta original conversa com uma API Spring. Aqui, `src/mock/servidor.ts`
intercepta o `fetch` do navegador e responde as mesmas rotas a partir de
`src/mock/dados.ts`.

A interceptação é no `fetch`, e não em cada service, de propósito: o app faz rede
em quatro lugares diferentes (`lib/http.ts`, `lib/api.ts`, o download do extrato
e a assinatura de eventos), e remendar os quatro significaria alterar justamente
o código que vocês vão ler. **Nenhum componente, service ou contexto foi
alterado** para o app funcionar — só quem responde é outro.

O login com Google fica desativado, porque OAuth de verdade precisa de servidor.
O app já trata isso sozinho: sem `VITE_GOOGLE_CLIENT_ID`, o botão não aparece.

## As telas

Dashboard, Transações, Membros, Categorias, Relatórios, Configurações da
carteira, Perfil, Trocar senha, Login, Cadastro, Esqueci a senha e Redefinir
senha.

## O caminho de uma tarefa

1. Pegue um card do **Backlog**, mova para **Em andamento** e se atribua.
2. Leia o card inteiro antes de abrir o código — principalmente o
   **Pronto quando** e **A pergunta**.
3. Trabalhe com o agente.
4. **Leia o diff.** Mexeu só no que a tarefa pedia? Você entende cada linha?
   Apagou alguma coisa? (olhe as linhas com `-`, não só as com `+`)
5. Rode `npm run build` e **olhe a tela**. Build passando não quer dizer tela
   certa — foi exatamente assim que estes defeitos chegaram aqui.
6. Responda **A pergunta** nos comentários do card.
7. Abra o pull request.

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
