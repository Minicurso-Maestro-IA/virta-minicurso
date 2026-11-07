# O que foi pedido
Correção do componente CategoryBadge em /app/transacoes. Na exibição de cada categoria, a etiqueta exibe a cor correta apenas no indicador circular (bolinha), enquanto o fundo e o texto permanecem em tom neutro/cinza. O componente deve ser corrigido para que o fundo e o texto utilizem a cor da categoria recebida via propriedades (mantendo a opacidade no fundo), a bolinha mantenha a cor da categoria, e transações sem categoria não exibam nenhuma etiqueta (retornando nulo).

# Regras
1. O container da etiqueta de categoria (fundo e texto) deve utilizar a cor da categoria informada, aplicando transparência no fundo e cor sólida no texto.
2. O indicador circular interno (bolinha) deve exibir a cor sólida da categoria informada.
3. Se nenhuma cor for fornecida (nula ou indefinida), deve ser utilizada a cor neutra padrão `#71717a` para a bolinha, texto e fundo (com transparência).
4. Se o nome da categoria não for fornecido, for nulo, indefinido, vazio ou composto apenas por espaços, o componente deve retornar `null` e não renderizar nenhum elemento.
5. Em transações com categorias coloridas (como "Moradia" em roxo e "Mercado" em laranja), o fundo, o texto e o indicador devem refletir consistentemente as cores atribuídas.
6. O projeto deve compilar com sucesso via `npm run build`, sem erros de TypeScript ou problemas de tipagem.

# Casos de borda e o que decidi
- Decidi que a transparência do fundo deve seguir a convenção de 10% de opacidade hexadecimal (`1a` adicionado à cor hex, no formato `${cor}1a`), mantendo coerência com o padrão visual existente.
- Decidi que valores de `name` vazios (`""`), nulos, indefinidos ou preenchidos exclusivamente com espaços em branco devem ser tratados como ausência de categoria, retornando `null` para evitar renderizar badges vazios.
- Decidi que a tipagem do componente deve aceitar de forma segura `name` e `color` opcionais/nulos para evitar quebras em tempo de execução com dados parciais.
- Decidi que transações sem categoria (como "Passagens") não devem exibir container nem espaço residual na listagem.

# Perguntas em aberto
Nenhuma.

# Pronto quando
1. Componente chamado com categoria "Moradia" e cor "#8b5cf6" renderiza texto "Moradia", indicador circular com fundo "#8b5cf6", fundo do container com "#8b5cf61a" e texto com cor "#8b5cf6".
2. Componente chamado com categoria "Mercado" e cor "#f97316" renderiza texto "Mercado", indicador circular com fundo "#f97316", fundo do container com "#f973161a" e texto com cor "#f97316".
3. Componente chamado com cor nula (name: "Geral", color: null) utiliza a cor padrão "#71717a" na bolinha, texto e fundo ("#71717a1a").
4. Componente chamado com name vazio (""), nulo ou espaços em branco retorna `null` e nenhum nó DOM é renderizado.
5. Transação "Passagens" (sem categoria) não exibe nenhum badge visual na lista de transações.
6. O comando `npm run build` na pasta do projeto é executado com código de retorno 0.
