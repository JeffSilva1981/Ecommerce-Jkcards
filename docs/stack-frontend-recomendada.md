# Stack Frontend Recomendada - JKCards

## Visao geral

O escopo original sugere React com HTML, CSS e JavaScript. Essa base funciona, mas para um ecommerce com autenticacao, carrinho, pedidos, administracao, dashboard e uso como portfolio, a recomendacao e usar uma stack mais robusta:

```text
React
Vite
TypeScript
React Router DOM
TanStack Query
Zustand
React Hook Form
Zod
Tailwind CSS
Axios
Lucide React
```

Essa stack continua sendo React, mas com ferramentas que reduzem bugs, melhoram produtividade e deixam o projeto com cara mais profissional.

## React

O que e:

- Biblioteca JavaScript para criar interfaces de usuario baseadas em componentes.

Por que usar:

- E madura, muito usada no mercado e excelente para portfolio.
- Permite montar telas reutilizaveis, como cards de produto, tabelas admin, formularios e layouts.

Para que serve no JKCards:

- Construir catalogo, detalhe de produto, carrinho, checkout, login e painel admin.

## Vite

O que e:

- Ferramenta para criar e rodar projetos frontend modernos.

Por que usar:

- E mais simples e rapida que setups antigos.
- Tem otima integracao com React e TypeScript.

Para que serve no JKCards:

- Criar o projeto frontend.
- Rodar o ambiente local.
- Gerar build final para deploy.

## TypeScript

O que e:

- Uma camada de tipagem sobre JavaScript.

Por que usar:

- Ajuda a evitar erros comuns antes mesmo de rodar o projeto.
- Melhora muito a integracao com API, principalmente quando existem modelos como produto, pedido, usuario, role e status.
- Valoriza o projeto como portfolio.

Para que serve no JKCards:

- Tipar respostas da API.
- Garantir que carrinho, pedido e produto tenham os campos corretos.
- Evitar erros como `productId` inexistente, `status` escrito errado ou campos nulos usados sem tratamento.

Exemplos de tipos uteis:

```ts
type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imgUrl?: string;
  categories?: Category[];
};

type OrderStatus =
  | "WAITING_PAYMENT"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";
```

## React Router DOM

O que e:

- Biblioteca de rotas para aplicacoes React.

Por que usar:

- Permite criar navegacao entre telas sem recarregar a pagina.
- Facilita rotas protegidas por login e por perfil admin.

Para que serve no JKCards:

- Criar rotas como `/produtos`, `/carrinho`, `/checkout`, `/pedidos/:id` e `/admin/produtos`.
- Proteger telas de usuario autenticado.
- Bloquear area admin para quem nao tem `ROLE_ADMIN`.

## TanStack Query

O que e:

- Biblioteca para buscar, cachear e sincronizar dados vindos da API.

Por que usar:

- Evita escrever muito estado manual de loading, erro e refetch.
- Melhora a experiencia do usuario com cache e atualizacao automatica.
- Organiza muito bem chamadas como listar produtos, buscar pedido e atualizar produto.

Para que serve no JKCards:

- Buscar produtos.
- Buscar categorias.
- Buscar usuario logado.
- Criar pedido.
- Atualizar produto no admin.
- Recarregar listas depois de criar, editar ou deletar.

## Zustand

O que e:

- Biblioteca simples para estado global no React.

Por que usar:

- Mais leve e direta que Redux para esse tamanho de projeto.
- Funciona muito bem para estados que varias telas precisam acessar.

Para que serve no JKCards:

- Guardar dados de autenticacao.
- Guardar token JWT.
- Guardar usuario logado e roles.
- Controlar carrinho.
- Persistir carrinho em `localStorage`.

## React Hook Form

O que e:

- Biblioteca para criar formularios em React com boa performance e menos codigo repetitivo.

Por que usar:

- Facilita formularios grandes.
- Controla validacao, erros, submit e estado de campos.
- Evita renderizacoes desnecessarias.

Para que serve no JKCards:

- Login.
- Cadastro de usuario.
- Formulario de produto.
- Formulario de categoria.
- Alteracao de status de pedido.
- Filtros do dashboard.

## Zod

O que e:

- Biblioteca para criar schemas de validacao com TypeScript.

Por que usar:

- Garante que os dados do formulario estejam corretos antes de enviar para API.
- Integra muito bem com React Hook Form.
- Ajuda a manter validacoes padronizadas.

Para que serve no JKCards:

- Validar email e senha no login.
- Validar nome, descricao, preco, imagem e categorias no cadastro de produto.
- Validar cadastro de usuario.
- Validar filtros de periodo no dashboard.

Exemplo:

```ts
const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1500),
  price: z.number().positive(),
  imgUrl: z.string().url().optional(),
  categories: z.array(z.object({ id: z.number() })).min(1),
});
```

## Tailwind CSS

O que e:

- Framework CSS baseado em classes utilitarias.

Por que usar:

- Acelera bastante a criacao da interface.
- Facilita responsividade.
- Ajuda a manter consistencia visual sem criar muitos arquivos CSS manuais.

Para que serve no JKCards:

- Aplicar a identidade visual preta, azul clara, branca e amarela.
- Criar grids responsivos de produtos.
- Criar tabelas admin, botoes, inputs, badges de status e layouts.

Observacao:

- Mesmo usando Tailwind, vale criar componentes reutilizaveis para botoes, inputs, cards, modais e tabelas.

## Axios

O que e:

- Cliente HTTP para fazer requisicoes para APIs.

Por que usar:

- Facilita headers, interceptadores, base URL e tratamento de erros.
- E pratico para enviar token JWT em todas as rotas protegidas.

Para que serve no JKCards:

- Criar `apiClient`.
- Enviar login para `/oauth2/token`.
- Enviar `Authorization: Bearer <token>`.
- Consumir endpoints de produtos, categorias, pedidos e usuarios.

## Lucide React

O que e:

- Biblioteca de icones para React.

Por que usar:

- Tem icones modernos, leves e consistentes.
- Ajuda a deixar o projeto mais bonito e profissional sem desenhar icones manualmente.

Para que serve no JKCards:

- Icones de carrinho, usuario, busca, editar, excluir, salvar, dashboard, pedido e logout.

## Como essa stack conversa com o backend

Fluxo recomendado:

1. Axios envia login para `/oauth2/token`.
2. Zustand salva token e usuario logado.
3. Axios adiciona token nas chamadas protegidas.
4. TanStack Query busca e cacheia dados da API.
5. React Hook Form coleta dados dos formularios.
6. Zod valida antes de enviar.
7. React Router controla telas publicas, autenticadas e admin.

## Decisao final recomendada

Usar:

```text
React + Vite + TypeScript
React Router DOM
TanStack Query
Zustand
React Hook Form + Zod
Tailwind CSS
Axios
Lucide React
```

Motivo:

- E uma stack moderna, direta, boa para ecommerce pequeno/medio e excelente para portfolio.
- Nao complica tanto quanto Next.js.
- Mantem o backend Java/Spring Boot como API principal.
- Da ao frontend uma estrutura profissional sem exagero.

