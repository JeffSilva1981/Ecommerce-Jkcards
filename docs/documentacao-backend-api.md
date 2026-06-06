# Documentacao do Backend e API - JKCards

## Visao geral

O projeto `jkcards` e uma API REST de ecommerce desenvolvida com Java 21, Spring Boot 3.5.3, Spring Web, Spring Data JPA, Bean Validation, Spring Security, OAuth2 Authorization Server e Resource Server JWT.

Pelo codigo atual, a aplicacao possui recursos para:

- Autenticacao via OAuth2 password grant customizado, retornando JWT.
- Listagem e detalhe de produtos.
- CRUD de produtos para administradores.
- Listagem de categorias.
- Criacao e consulta de pedidos autenticados.
- Consulta do usuario autenticado.
- Controle de permissoes por roles `ROLE_OPERATOR` e `ROLE_ADMIN`.

Importante: o texto de escopo enviado menciona CRUD completo de usuarios, categorias e pedidos, mas esses endpoints ainda nao estao implementados nos controllers atuais. A documentacao abaixo separa o que existe hoje do que ainda precisa ser criado no backend.

## Stack atual

- Linguagem: Java 21
- Framework: Spring Boot 3.5.3
- Web/API: Spring Web
- Persistencia: Spring Data JPA / Hibernate
- Validacao: Bean Validation / Jakarta Validation
- Seguranca: Spring Security
- Autenticacao: OAuth2 Authorization Server com grant `password` customizado
- Token: JWT self-contained
- Banco configurado no projeto: H2 em memoria no profile `test`
- Banco citado no escopo: PostgreSQL, mas nao ha dependencia/configuracao PostgreSQL no `pom.xml` e nem properties especificas para Postgres no codigo atual

## Configuracoes principais

Arquivo: `src/main/resources/application.properties`

```properties
spring.profiles.active=test
spring.jpa.open-in-view=false
security.client-id=${CLIENT_ID:myclientid}
security.client-secret=${CLIENT_SECRET:myclientsecret}
security.jwt.duration=${JWT_DURATION:86400}
cors.origins=${CORS_ORIGINS:http://localhost:3000,http://localhost:5173}
```

Arquivo: `src/main/resources/application-test.properties`

```properties
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.defer-datasource-initialization=true
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## Dados iniciais

O arquivo `src/main/resources/import.sql` cria:

- Categorias:
  - Livros
  - Eletronicos
  - Computadores
- 25 produtos de exemplo.
- Usuarios:
  - `maria@gmail.com`, com `ROLE_OPERATOR`
  - `alex@gmail.com`, com `ROLE_OPERATOR` e `ROLE_ADMIN`
- Pedidos e pagamentos de exemplo.

Observacao: alguns textos do `import.sql` aparecem com encoding quebrado, como `EletrÃ´nicos`.

## Modelo de dominio

### Usuario

Entidade: `User`

Campos principais:

- `id`
- `name`
- `email`
- `phone`
- `birthDate`
- `password`
- `roles`
- `orders`

Regras:

- `email` e unico.
- Implementa `UserDetails`.
- Pode possuir multiplas roles.

### Role

Entidade: `Role`

Campos:

- `id`
- `authority`

Roles usadas no seed:

- `ROLE_OPERATOR`
- `ROLE_ADMIN`

### Categoria

Entidade: `Category`

Campos:

- `id`
- `name`
- `products`

Relacionamento:

- Muitos-para-muitos com produtos.

### Produto

Entidade: `Product`

Campos:

- `id`
- `name`
- `description`
- `price`
- `imgUrl`
- `categories`
- `items`

Relacionamentos:

- Muitos-para-muitos com categorias.
- Um-para-muitos com itens de pedido.

### Pedido

Entidade: `Order`

Campos:

- `id`
- `moment`
- `status`
- `client`
- `payment`
- `items`

Relacionamentos:

- Muitos-para-um com usuario cliente.
- Um-para-um com pagamento.
- Um-para-muitos com itens de pedido.

### Item de pedido

Entidade: `OrderItem`

Campos:

- `order`
- `product`
- `quantity`
- `price`

A chave primaria e composta por pedido e produto.

### Pagamento

Entidade: `Payment`

Campos:

- `id`
- `moment`
- `order`

### Status de pedido

Enum: `OrderStatus`

Valores:

- `WAITING_PAYMENT`
- `PAID`
- `SHIPPED`
- `DELIVERED`
- `CANCELED`

## Autenticacao

### Login

Endpoint gerado pelo Authorization Server:

```http
POST /oauth2/token
```

Autenticacao do client:

- Client ID padrao: `myclientid`
- Client Secret padrao: `myclientsecret`
- Enviar via HTTP Basic Auth.

Body em `application/x-www-form-urlencoded`:

```text
grant_type=password
username=alex@gmail.com
password=<senha_do_usuario>
```

Exemplo com `curl`:

```bash
curl -X POST http://localhost:8080/oauth2/token \
  -u myclientid:myclientsecret \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=alex@gmail.com&password=<senha>"
```

Resposta esperada:

```json
{
  "access_token": "jwt",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

O JWT recebe claims customizadas:

```json
{
  "username": "alex@gmail.com",
  "authorities": ["ROLE_OPERATOR", "ROLE_ADMIN"]
}
```

### Uso do token no frontend

Enviar o token nas rotas protegidas:

```http
Authorization: Bearer <access_token>
```

## Regras de autorizacao

A configuracao global permite as requisicoes, mas os metodos protegidos usam `@PreAuthorize`.

Resumo:

- Produtos:
  - Listagem e detalhe: publico.
  - Criar, editar e deletar: `ROLE_ADMIN`.
- Categorias:
  - Listagem: publico.
- Pedidos:
  - Consultar pedido por id: `ROLE_ADMIN` ou `ROLE_OPERATOR`.
  - Criar pedido: `ROLE_OPERATOR`.
  - O service valida se o operador esta consultando o proprio pedido ou se e admin.
- Usuario:
  - `/users/me`: `ROLE_ADMIN` ou `ROLE_OPERATOR`.

## Endpoints existentes

Base URL local esperada:

```text
http://localhost:8080
```

### Auth

#### `POST /oauth2/token`

Realiza login e retorna token JWT.

Body:

```text
grant_type=password
username=<email>
password=<senha>
```

Content-Type:

```text
application/x-www-form-urlencoded
```

Autorizacao:

- HTTP Basic com `client-id` e `client-secret`.

Uso no frontend:

- Tela de login.
- Salvar `access_token`.
- Decodificar roles para montar menus por perfil.
- Chamar `/users/me` apos o login para obter dados completos do usuario.

### Usuarios

#### `GET /users/me`

Retorna o usuario autenticado.

Autorizacao:

- `ROLE_ADMIN` ou `ROLE_OPERATOR`.

Resposta:

```json
{
  "id": 2,
  "name": "Alex Green",
  "email": "alex@gmail.com",
  "phone": "977777777",
  "birthDate": "1987-12-13",
  "password": null,
  "roles": ["ROLE_OPERATOR", "ROLE_ADMIN"]
}
```

Uso no frontend:

- Carregar perfil autenticado.
- Identificar permissoes.
- Exibir nome do usuario logado.

### Produtos

#### `GET /products`

Lista produtos paginados.

Autorizacao:

- Publico.

Query params:

- `name`: filtro por nome. Padrao atual: espaco.
- `page`: pagina, iniciando em `0`.
- `size`: tamanho da pagina.
- `sort`: ordenacao Spring, por exemplo `name,asc`.

Exemplo:

```http
GET /products?name=pc&page=0&size=12&sort=name,asc
```

Resposta:

```json
{
  "content": [
    {
      "id": 1,
      "name": "PC Gamer",
      "price": 1200.0,
      "imgUrl": "https://..."
    }
  ],
  "pageable": {},
  "totalPages": 3,
  "totalElements": 25,
  "size": 12,
  "number": 0
}
```

Atencao: no codigo atual, o construtor `ProductMinDto(Product entity)` nao preenche o campo `id`. Isso pode fazer a API retornar `id: null` na listagem ate que o backend seja corrigido.

Uso no frontend:

- Tela de vitrine/catalogo.
- Busca por nome.
- Paginacao.
- Listagem admin de produtos.

#### `GET /products/{id}`

Retorna detalhe de um produto.

Autorizacao:

- Publico.

Resposta:

```json
{
  "id": 1,
  "name": "PC Gamer",
  "description": "Descricao do produto",
  "price": 1200.0,
  "imgUrl": "https://...",
  "categories": [
    {
      "id": 3,
      "name": "Computadores"
    }
  ]
}
```

Atencao: no codigo atual, o construtor `ProductDto(Product entity)` tambem nao preenche `id`.

Uso no frontend:

- Pagina de detalhe do produto.
- Botao de adicionar ao carrinho.
- Edicao admin de produto.

#### `POST /products`

Cria produto.

Autorizacao:

- `ROLE_ADMIN`.

Body:

```json
{
  "name": "Booster Pokemon",
  "description": "Pacote lacrado com cartas colecionaveis.",
  "price": 29.9,
  "imgUrl": "https://...",
  "categories": [
    {
      "id": 1
    }
  ]
}
```

Resposta:

- `201 Created`
- Body com `ProductDto`.
- Header `Location` com URL do recurso criado.

Validacoes atuais:

- `name`: nao pode estar em branco, tamanho 3 a 100.
- `description`: nao pode estar em branco, tamanho 10 a 1500.
- `price`: positivo.
- `categories`: ao menos uma categoria.

Atencao: o campo `price` usa `@NotEmpty`, que nao e adequado para `Double`; deve ser `@NotNull`. Enquanto isso nao for corrigido, validacoes de criacao/edicao podem falhar com erro inesperado.

#### `PUT /products/{id}`

Atualiza produto.

Autorizacao:

- `ROLE_ADMIN`.

Body:

```json
{
  "name": "Booster Pokemon Atualizado",
  "description": "Descricao atualizada com detalhes comerciais.",
  "price": 34.9,
  "imgUrl": "https://...",
  "categories": [
    {
      "id": 1
    },
    {
      "id": 3
    }
  ]
}
```

Resposta:

- `200 OK`
- Body com `ProductDto`.

#### `DELETE /products/{id}`

Remove produto.

Autorizacao:

- `ROLE_ADMIN`.

Resposta:

- `204 No Content`

### Categorias

#### `GET /categories`

Lista todas as categorias.

Autorizacao:

- Publico.

Resposta:

```json
[
  {
    "id": 1,
    "name": "Livros"
  },
  {
    "id": 2,
    "name": "Eletronicos"
  }
]
```

Uso no frontend:

- Filtros de catalogo.
- Select no cadastro/edicao de produto.

### Pedidos

#### `GET /orders/{id}`

Busca pedido por id.

Autorizacao:

- `ROLE_ADMIN` ou `ROLE_OPERATOR`.

Regra adicional:

- `ROLE_OPERATOR` so pode consultar o proprio pedido.
- `ROLE_ADMIN` pode consultar qualquer pedido.

Resposta:

```json
{
  "id": 1,
  "moment": "2022-07-25T13:00:00Z",
  "status": "WAITING_PAYMENT",
  "client": {
    "id": 1,
    "name": "Maria Brown"
  },
  "payment": null,
  "items": [
    {
      "productId": 1,
      "name": "The Lord of the Rings",
      "price": 90.5,
      "quantity": 2,
      "imgUrl": "https://...",
      "subTotal": 181.0
    }
  ],
  "total": 181.0
}
```

Uso no frontend:

- Tela de detalhe do pedido.
- Confirmacao apos compra.
- Area "meus pedidos", desde que exista um endpoint de listagem ou o front tenha o id do pedido criado.

#### `POST /orders`

Cria pedido com os itens do carrinho.

Autorizacao:

- `ROLE_OPERATOR`.

Comportamento do backend:

- Define `moment` como horario atual.
- Define `status` como `WAITING_PAYMENT`.
- Define `client` como o usuario autenticado.
- Salva os itens enviados.

Body:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 90.5
    },
    {
      "productId": 3,
      "quantity": 1,
      "price": 1250.0
    }
  ]
}
```

Resposta:

- `201 Created`
- Body com `OrderDto`.
- Header `Location` com URL do pedido criado.

Uso no frontend:

- Finalizar carrinho.
- Criar pedido sem pagamento online.
- Redirecionar para tela de pedido criado.

Atencao: o backend aceita o `price` enviado pelo cliente. Para seguranca comercial, o ideal e ignorar o preco do frontend e buscar o preco atual do produto no backend.

## Formato de erros

### Erro comum

```json
{
  "timeStamp": "2026-06-06T13:00:00Z",
  "status": 404,
  "error": "Product not found",
  "path": "/products/999"
}
```

### Erro de validacao

```json
{
  "timeStamp": "2026-06-06T13:00:00Z",
  "status": 400,
  "error": "Validation exception",
  "path": "/products",
  "errors": [
    {
      "fieldName": "name",
      "message": "The name must be between 3 and 10 characters long."
    }
  ]
}
```

## Endpoints citados no escopo, mas ainda ausentes

Para o frontend completo descrito pelo desenvolvedor, faltam endpoints para:

- Cadastro publico de usuario.
- CRUD administrativo de usuarios.
- CRUD de categorias.
- Listagem de pedidos do usuario logado.
- Listagem administrativa de todos os pedidos.
- Atualizacao manual de status de pedido pelo admin.
- Cancelamento/remocao de pedido.
- Dashboard administrativo com:
  - quantidade de pedidos por periodo;
  - faturamento bruto por periodo;
  - resultado liquido por periodo;
  - possiveis filtros por status.
- Campo de custo do produto ou margem, caso o sistema precise calcular resultado liquido real.

## Sugestao de contrato para endpoints faltantes

### Usuarios

```http
POST /users
GET /users
GET /users/{id}
PUT /users/{id}
DELETE /users/{id}
```

### Categorias

```http
POST /categories
GET /categories/{id}
PUT /categories/{id}
DELETE /categories/{id}
```

### Pedidos

```http
GET /orders
GET /orders/my
PUT /orders/{id}/status
DELETE /orders/{id}
```

Exemplo de body para atualizar status:

```json
{
  "status": "PAID"
}
```

### Dashboard

```http
GET /admin/dashboard?startDate=2026-01-01&endDate=2026-01-31
```

Resposta sugerida:

```json
{
  "ordersCount": 42,
  "grossRevenue": 8500.0,
  "netRevenue": 5200.0,
  "averageTicket": 202.38,
  "byStatus": [
    {
      "status": "WAITING_PAYMENT",
      "count": 10
    },
    {
      "status": "PAID",
      "count": 20
    }
  ]
}
```

