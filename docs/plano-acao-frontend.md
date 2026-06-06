# Plano de Acao para Implementar o Frontend React - JKCards

## Objetivo

Construir um frontend React para o ecommerce JKCards, com experiencia de loja para usuarios comuns e area administrativa para gerenciamento de produtos, pedidos, categorias, usuarios e indicadores.

O projeto tambem sera usado como portfolio, entao o frontend deve demonstrar organizacao, boa experiencia visual, responsividade, clareza de fluxos e integracao real com API.

## Direcao visual

Cores pedidas:

- Preto
- Azul claro
- Branco
- Amarelo em detalhes

Sugestao de paleta:

- Fundo principal: `#05070A`
- Fundo secundario: `#101820`
- Texto principal: `#F8FAFC`
- Texto secundario: `#B6C2CF`
- Azul claro principal: `#38BDF8`
- Azul claro hover: `#7DD3FC`
- Amarelo de destaque: `#FACC15`
- Bordas: `#1F2A37`
- Erro: `#EF4444`
- Sucesso: `#22C55E`

Estilo recomendado:

- Visual moderno e limpo, com cara de loja de cards/produtos colecionaveis.
- Header fixo ou persistente com busca, carrinho e login.
- Cards de produto objetivos, com imagem, nome, preco e acao.
- Area admin mais funcional, com tabelas, filtros, formularios e indicadores.
- Evitar telas muito vazias: usar listagens, estados de carregamento e feedbacks.

## Stack recomendada

Stack oficial recomendada para o frontend:

- React
- Vite
- TypeScript
- React Router DOM
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- Axios
- Lucide React

Justificativa:

- O escopo original cita React com HTML, CSS e JavaScript, mas para um ecommerce com autenticacao, carrinho, pedidos, roles, dashboard e integracao com API, TypeScript e bibliotecas especializadas deixam o projeto mais seguro, mais profissional e melhor para portfolio.
- Vite deixa o desenvolvimento rapido e simples.
- TanStack Query organiza chamadas HTTP, cache, loading e erros.
- Zustand resolve estados globais como carrinho e autenticacao com menos complexidade.
- React Hook Form e Zod tornam os formularios mais confiaveis.
- Tailwind acelera a criacao de uma interface responsiva e consistente.
- Axios centraliza a comunicacao com o backend.
- Lucide React entrega icones modernos e consistentes.

Documento complementar:

- Ver `docs/stack-frontend-recomendada.md` para descricao detalhada de cada tecnologia.

## Estrutura sugerida de pastas

```text
src/
  api/
    apiClient.ts
    authApi.ts
    productsApi.ts
    categoriesApi.ts
    ordersApi.ts
    usersApi.ts
    dashboardApi.ts
  assets/
  components/
    Button/
    Input/
    ProductCard/
    Header/
    Sidebar/
    Modal/
    Table/
    Pagination/
    StatusBadge/
  contexts/
    AuthContext.tsx
    CartContext.tsx
  hooks/
    useAuth.ts
    useCart.ts
    useDebounce.ts
  layouts/
    StoreLayout.tsx
    AdminLayout.tsx
  pages/
    store/
      HomePage.tsx
      ProductsPage.tsx
      ProductDetailsPage.tsx
      CartPage.tsx
      CheckoutPage.tsx
      MyOrdersPage.tsx
      OrderDetailsPage.tsx
    auth/
      LoginPage.tsx
      RegisterPage.tsx
    admin/
      DashboardPage.tsx
      ProductsAdminPage.tsx
      ProductFormPage.tsx
      CategoriesAdminPage.tsx
      OrdersAdminPage.tsx
      UsersAdminPage.tsx
  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx
    AdminRoute.tsx
  styles/
    global.css
    tailwind.css
  stores/
    authStore.ts
    cartStore.ts
  schemas/
    loginSchema.ts
    productSchema.ts
    userSchema.ts
    orderStatusSchema.ts
  types/
    product.ts
    category.ts
    order.ts
    user.ts
  utils/
    currency.ts
    jwt.ts
    dates.ts
```

## Perfis e permissoes

### Usuario visitante

Pode:

- Ver catalogo de produtos.
- Buscar produtos.
- Ver detalhe de produto.
- Montar carrinho local.
- Acessar login/cadastro.

Nao pode:

- Finalizar pedido sem login.
- Acessar area administrativa.

### Usuario autenticado comum

No backend atual, esse perfil corresponde a `ROLE_OPERATOR`.

Pode:

- Ver produtos.
- Montar carrinho.
- Gerar pedido.
- Consultar seus pedidos, quando o backend oferecer listagem.
- Ver detalhe de pedido proprio.

### Admin

No backend atual, esse perfil corresponde a `ROLE_ADMIN`.

Pode:

- Tudo que o usuario comum pode.
- Criar, editar e deletar produtos.
- Visualizar pedidos de usuarios.
- Atualizar status de pedido, quando o backend expor esse endpoint.
- Gerenciar categorias e usuarios, quando o backend expor esses endpoints.
- Ver dashboard financeiro, quando o backend expor esse endpoint.

## Rotas sugeridas

### Loja

```text
/                       Catalogo principal
/produtos               Lista completa com filtros
/produtos/:id           Detalhe do produto
/carrinho               Carrinho
/checkout               Revisao e criacao do pedido
/pedidos                Meus pedidos
/pedidos/:id            Detalhe do pedido
```

### Autenticacao

```text
/login                  Login
/cadastro               Cadastro de usuario
```

### Admin

```text
/admin                  Dashboard
/admin/produtos         Lista admin de produtos
/admin/produtos/novo    Cadastro de produto
/admin/produtos/:id     Edicao de produto
/admin/categorias       Gerenciamento de categorias
/admin/pedidos          Pedidos gerados
/admin/usuarios         Usuarios cadastrados
```

## Telas do frontend

### 1. Catalogo / Home

Objetivo:

- Ser a primeira tela util do ecommerce.
- Exibir produtos disponiveis com busca e paginacao.

Consome hoje:

```http
GET /products?name=&page=0&size=12
GET /categories
```

Componentes:

- Header com logo JKCards, busca, carrinho, login/perfil.
- Grid de produtos.
- Card de produto com imagem, nome, preco e botoes.
- Filtros por categoria, se o backend adicionar filtro por categoria.
- Paginacao.

Estados:

- Carregando.
- Lista vazia.
- Erro de API.
- Produto sem imagem.

Observacao tecnica:

- Antes de implementar detalhe/carrinho, corrigir no backend o retorno de `id` em `ProductMinDto`.

### 2. Detalhe do produto

Consome hoje:

```http
GET /products/{id}
```

Componentes:

- Imagem grande.
- Nome.
- Descricao.
- Preco.
- Categorias.
- Controle de quantidade.
- Botao adicionar ao carrinho.

Observacao tecnica:

- Corrigir no backend o retorno de `id` em `ProductDto`.

### 3. Carrinho

Dados:

- Pode ser mantido no frontend com `localStorage` ou estado global.

Campos por item:

- `productId`
- `name`
- `price`
- `imgUrl`
- `quantity`

Acoes:

- Aumentar quantidade.
- Diminuir quantidade.
- Remover item.
- Limpar carrinho.
- Ir para checkout.

Regra:

- Se usuario nao estiver autenticado, direcionar para login antes de finalizar.

### 4. Checkout

Consome hoje:

```http
POST /orders
```

Body esperado:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 90.5
    }
  ]
}
```

Fluxo:

1. Validar login.
2. Validar carrinho nao vazio.
3. Enviar pedido.
4. Limpar carrinho apos sucesso.
5. Redirecionar para `/pedidos/:id`.

Observacao:

- O backend atual nao tem pagamento online. Exibir status inicial como "Aguardando pagamento/confirmacao".

### 5. Login

Consome hoje:

```http
POST /oauth2/token
GET /users/me
```

Fluxo:

1. Enviar `username` e `password` para `/oauth2/token`.
2. Guardar `access_token`.
3. Chamar `/users/me`.
4. Salvar usuario e roles.
5. Redirecionar conforme origem:
   - carrinho/checkout se veio de compra;
   - admin se for admin;
   - catalogo caso contrario.

Cuidados:

- Usar `application/x-www-form-urlencoded`.
- Usar Basic Auth com `clientId` e `clientSecret`.
- Tratar `401`/credenciais invalidas.

### 6. Cadastro

Status atual:

- O backend ainda nao possui endpoint publico de cadastro de usuario.

Quando backend implementar:

```http
POST /users
```

Campos sugeridos:

- Nome.
- Email.
- Telefone.
- Data de nascimento.
- Senha.
- Confirmacao de senha.

### 7. Meus pedidos

Status atual:

- O backend possui `GET /orders/{id}`, mas nao possui listagem dos pedidos do usuario logado.

Endpoint necessario:

```http
GET /orders/my
```

Enquanto nao existir:

- O frontend so consegue mostrar o pedido recem-criado, usando o id retornado no checkout.

### 8. Detalhe do pedido

Consome hoje:

```http
GET /orders/{id}
```

Componentes:

- Numero do pedido.
- Data.
- Status.
- Dados do cliente.
- Itens.
- Total.
- Informacao de pagamento, se existir.

### 9. Admin - Dashboard

Status atual:

- Backend ainda nao possui endpoint de dashboard.

Endpoint sugerido:

```http
GET /admin/dashboard?startDate=2026-01-01&endDate=2026-01-31
```

Cards:

- Total de pedidos.
- Receita bruta.
- Receita liquida.
- Ticket medio.
- Pedidos por status.

Filtros:

- Periodo.
- Status.

Observacao:

- Para receita liquida real, o backend precisa ter custo dos produtos, taxa, desconto ou algum campo equivalente.

### 10. Admin - Produtos

Consome hoje:

```http
GET /products
POST /products
PUT /products/{id}
DELETE /products/{id}
GET /categories
```

Funcionalidades:

- Tabela de produtos.
- Busca por nome.
- Paginacao.
- Criar produto.
- Editar produto.
- Excluir produto.
- Selecionar categorias.
- Upload ou URL de imagem.

Campos:

- Nome.
- Descricao.
- Preco.
- URL da imagem.
- Categorias.

Bloqueio:

- Corrigir validacao `@NotEmpty` em `price` no backend antes de confiar no formulario.

### 11. Admin - Categorias

Status atual:

- Backend possui apenas listagem.

Endpoints necessarios:

```http
POST /categories
PUT /categories/{id}
DELETE /categories/{id}
```

Funcionalidades:

- Lista de categorias.
- Criar categoria.
- Editar categoria.
- Excluir categoria.

### 12. Admin - Pedidos

Status atual:

- Backend nao possui listagem geral nem atualizacao de status.

Endpoints necessarios:

```http
GET /orders
PUT /orders/{id}/status
```

Funcionalidades:

- Tabela de pedidos.
- Filtro por periodo.
- Filtro por status.
- Ver detalhe do pedido.
- Alterar status manualmente.

### 13. Admin - Usuarios

Status atual:

- Backend possui apenas `/users/me`.

Endpoints necessarios:

```http
GET /users
GET /users/{id}
POST /users
PUT /users/{id}
DELETE /users/{id}
```

Funcionalidades:

- Lista de usuarios.
- Criar usuario.
- Editar usuario.
- Excluir/desativar usuario.
- Gerenciar roles.

## Ordem recomendada de implementacao

### Fase 1 - Preparacao do frontend

1. Criar projeto React com Vite e TypeScript.
2. Configurar rotas com React Router.
3. Configurar Tailwind CSS e tema global com cores do JKCards.
4. Criar `apiClient` com Axios, base URL e interceptador de token.
5. Criar types TypeScript para produtos, categorias, usuarios e pedidos.
6. Configurar TanStack Query.
7. Criar stores Zustand para autenticacao e carrinho.
8. Criar schemas Zod para formularios principais.

### Fase 2 - Loja publica

1. Implementar catalogo com `GET /products`.
2. Implementar busca e paginacao.
3. Implementar detalhe de produto.
4. Implementar carrinho local.

Dependencia critica:

- Corrigir retorno de `id` nos DTOs de produto do backend.

### Fase 3 - Autenticacao

1. Implementar login com `/oauth2/token`.
2. Buscar usuario logado com `/users/me`.
3. Proteger rotas autenticadas.
4. Proteger rotas admin por role.

### Fase 4 - Pedido

1. Implementar checkout.
2. Integrar `POST /orders`.
3. Criar tela de pedido criado/detalhe.
4. Preparar tela "Meus pedidos", aguardando endpoint de listagem.

### Fase 5 - Admin de produtos

1. Listar produtos.
2. Cadastrar produto.
3. Editar produto.
4. Excluir produto.
5. Integrar categorias no formulario.

### Fase 6 - Completar backend faltante e telas admin

1. Criar endpoints de usuarios.
2. Criar endpoints de categorias.
3. Criar endpoints de pedidos para admin.
4. Criar endpoint de atualizar status.
5. Criar endpoint de dashboard.
6. Implementar telas admin restantes.

### Fase 7 - Portfolio e acabamento

1. Responsividade mobile.
2. Estados vazios bonitos e funcionais.
3. Loading skeletons.
4. Toasts de sucesso/erro.
5. Confirmacao antes de exclusoes.
6. README do frontend.
7. Screenshots ou GIFs para portfolio.
8. Deploy do backend e frontend.

## Checklist de integracao

- `VITE_API_URL` configurado.
- TypeScript configurado em modo consistente.
- Tailwind CSS configurado com a paleta do projeto.
- TanStack Query configurado no topo da aplicacao.
- Axios centralizado em `apiClient`.
- Zustand configurado para auth e carrinho.
- Schemas Zod criados para formularios importantes.
- Login envia form-urlencoded.
- Basic Auth configurado para token.
- JWT salvo de forma consistente.
- Header `Authorization` enviado nas rotas protegidas.
- Roles lidas de `/users/me` ou do JWT.
- Carrinho persiste em `localStorage`.
- Produtos sem imagem usam fallback visual.
- Erros de validacao aparecem perto dos campos.
- Admin nao ve telas quebradas quando endpoint ainda nao existe.

## Pendencias de backend antes do frontend completo

Prioridade alta:

- Corrigir IDs ausentes em `ProductDto` e `ProductMinDto`.
- Corrigir `@NotEmpty` em `price`.
- Garantir que roles do JWT sejam convertidas corretamente para `@PreAuthorize`.
- Criar cadastro de usuario.
- Criar listagem de pedidos do usuario.

Prioridade media:

- Criar CRUD de categorias.
- Criar listagem e atualizacao de pedidos para admin.
- Criar CRUD/admin de usuarios.

Prioridade portfolio:

- Criar dashboard.
- Adicionar PostgreSQL real.
- Melhorar dados seed para o nicho JKCards.
- Adicionar imagens reais/boas de produtos.
