# Melhorias Sugeridas para o Projeto JKCards

## Resumo executivo

O projeto ja possui uma boa base de ecommerce com Spring Boot, JPA, JWT, produtos, categorias, usuarios e pedidos. Para ficar pronto para um frontend completo e para portfolio, o principal trabalho agora e fechar lacunas de API, corrigir alguns bugs de DTO/validacao, melhorar seguranca comercial dos pedidos e preparar banco/configuracao de producao.

## Melhorias criticas

### 1. Corrigir retorno de ID nos DTOs de produto

Problema:

- `ProductDto(Product entity)` nao atribui `id = entity.getId()`.
- `ProductMinDto(Product entity)` nao atribui `id = entity.getId()`.

Impacto:

- A listagem pode retornar produtos com `id: null`.
- O frontend nao consegue abrir detalhe, editar, excluir ou adicionar ao carrinho de forma confiavel.

Acao:

```java
id = entity.getId();
```

Adicionar essa linha nos dois construtores.

Prioridade:

- Alta.

### 2. Corrigir validacao de preco

Problema:

- `ProductDto.price` e `Double`, mas esta anotado com `@NotEmpty`.
- `@NotEmpty` nao e indicado para numeros.

Impacto:

- Pode gerar erro inesperado em `POST /products` e `PUT /products/{id}`.

Acao:

- Trocar `@NotEmpty` por `@NotNull`.

Exemplo:

```java
@NotNull(message = "The price must not be empty.")
@Positive(message = "The price cannot be zero or negative.")
private Double price;
```

Prioridade:

- Alta.

### 3. Ajustar mensagens de validacao

Problemas:

- `Name must be empty.` deveria ser `Name must not be empty.`
- `Description must be empty.` deveria ser `Description must not be empty.`
- Mensagem do tamanho do nome diz `between 3 and 10`, mas a regra e `max = 100`.

Impacto:

- O frontend pode exibir mensagens confusas para o usuario.

Prioridade:

- Media.

### 4. Verificar conversao de roles do JWT

Problema potencial:

- Existe bean `JwtAuthenticationConverter`, mas o `ResourceServerConfig` usa `jwt(Customizer.withDefaults())`.
- Se o converter nao for aplicado, o `@PreAuthorize("hasRole(...)")` pode nao reconhecer `ROLE_ADMIN` e `ROLE_OPERATOR`.

Impacto:

- Rotas protegidas podem falhar com 403 mesmo com token valido.

Acao recomendada:

```java
http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));
```

Prioridade:

- Alta.

### 5. Nao confiar no preco enviado pelo frontend ao criar pedido

Problema:

- `OrderService.insert` usa `itemDto.getPrice()`.
- Um usuario pode alterar o preco no browser antes de enviar o pedido.

Impacto:

- Risco financeiro direto.

Acao:

- Buscar o produto pelo `productId`.
- Usar `product.getPrice()` no backend.

Exemplo:

```java
OrderItem item = new OrderItem(order, product, itemDto.getQuantity(), product.getPrice());
```

Prioridade:

- Alta.

## Lacunas de API para o frontend planejado

### 1. Cadastro publico de usuario

Necessario para:

- Usuario criar conta.
- Fluxo normal de ecommerce.

Endpoint sugerido:

```http
POST /users
```

Prioridade:

- Alta.

### 2. CRUD administrativo de usuarios

Necessario para:

- Tela admin de usuarios.
- Gerenciamento de roles.

Endpoints sugeridos:

```http
GET /users
GET /users/{id}
POST /users
PUT /users/{id}
DELETE /users/{id}
```

Prioridade:

- Media.

### 3. CRUD de categorias

Necessario para:

- Tela admin de categorias.
- Cadastro completo de produtos.

Endpoints sugeridos:

```http
POST /categories
GET /categories/{id}
PUT /categories/{id}
DELETE /categories/{id}
```

Prioridade:

- Media.

### 4. Listagem de pedidos do usuario

Necessario para:

- Tela "Meus pedidos".

Endpoint sugerido:

```http
GET /orders/my
```

Prioridade:

- Alta.

### 5. Listagem administrativa de pedidos

Necessario para:

- Admin ver todos os pedidos gerados pelos usuarios.

Endpoint sugerido:

```http
GET /orders?startDate=&endDate=&status=&page=&size=
```

Prioridade:

- Alta.

### 6. Atualizacao manual de status do pedido

Necessario para:

- Admin atualizar status manualmente, ja que nao havera pagamento integrado inicialmente.

Endpoint sugerido:

```http
PUT /orders/{id}/status
```

Body:

```json
{
  "status": "PAID"
}
```

Prioridade:

- Alta.

### 7. Dashboard administrativo

Necessario para:

- Quantidade de pedidos por periodo.
- Balanco financeiro bruto e liquido.

Endpoint sugerido:

```http
GET /admin/dashboard?startDate=&endDate=
```

Prioridade:

- Media.

## Melhorias de banco e producao

### 1. Adicionar PostgreSQL real

Problema:

- O escopo informa PostgreSQL, mas o projeto atual possui apenas H2 em memoria.

Acao:

- Adicionar dependencia do PostgreSQL no `pom.xml`.
- Criar profile `dev` ou `prod`.
- Configurar `spring.datasource.url`, usuario e senha por variaveis de ambiente.

Prioridade:

- Alta para producao.

### 2. Adicionar migrations

Sugestao:

- Usar Flyway ou Liquibase.

Beneficios:

- Controle de versao do banco.
- Deploy mais seguro.
- Facilidade para portfolio e producao.

Prioridade:

- Media.

### 3. Melhorar dados seed

Problema:

- Produtos atuais sao genericos e parecem vir de exemplo.
- O projeto chama JKCards, mas os produtos nao refletem loja de cards.

Acao:

- Criar seed com produtos de cartas/cards, acessorios, sleeves, boosters, decks e colecionaveis.
- Corrigir encoding dos textos.

Prioridade:

- Media para portfolio.

## Melhorias de dominio

### 1. Adicionar custo do produto

Necessario para:

- Calcular resultado liquido.

Campo sugerido:

```java
private Double costPrice;
```

Com isso:

- Receita bruta = soma dos precos vendidos.
- Receita liquida = soma dos precos vendidos - soma dos custos.

Prioridade:

- Alta se dashboard financeiro for obrigatorio.

### 2. Adicionar estoque

Necessario para:

- Evitar venda de produto indisponivel.

Campos sugeridos:

- `stockQuantity`
- `active`

Regras:

- Reduzir estoque ao criar pedido.
- Bloquear checkout se quantidade exceder estoque.
- Admin pode atualizar estoque.

Prioridade:

- Media.

### 3. Adicionar status de produto

Sugestao:

- Produto ativo/inativo.

Beneficio:

- Admin pode esconder produto sem deletar historico.

Prioridade:

- Media.

### 4. Evitar delete fisico para entidades importantes

Sugestao:

- Usar soft delete ou campo `active`.

Aplicar em:

- Produtos.
- Usuarios.
- Categorias.

Beneficio:

- Preserva historico de pedidos.
- Evita erros de integridade.

Prioridade:

- Media.

## Melhorias de seguranca

### 1. Revisar password grant

Contexto:

- O projeto usa OAuth2 password grant customizado.
- Para portfolio e aplicacao propria, pode funcionar, mas esse grant nao e o fluxo mais moderno para SPAs.

Alternativas:

- Manter por simplicidade.
- Ou migrar para login proprio com endpoint `/auth/login`.
- Ou usar Authorization Code Flow com PKCE se quiser seguir um padrao mais robusto.

Prioridade:

- Baixa/media, dependendo do objetivo.

### 2. Nao expor campo password em DTO de usuario

Problema:

- `UserDto` possui getter de `password`, mesmo que o construtor nao preencha.

Impacto:

- Pode aparecer `password: null` nas respostas.
- A existencia do campo e desnecessaria para o frontend.

Acao:

- Remover `password` do `UserDto`.
- Criar DTO separado para criacao/alteracao de senha.

Prioridade:

- Media.

### 3. Melhorar regras globais de seguranca

Problema:

- A regra global esta como `anyRequest().permitAll()`.
- A seguranca real depende dos `@PreAuthorize`.

Acao:

- Manter publicas apenas rotas realmente publicas.
- Exigir autenticacao nas demais.

Exemplo:

```java
authorize
  .requestMatchers(HttpMethod.GET, "/products/**", "/categories/**").permitAll()
  .requestMatchers("/oauth2/**", "/.well-known/**", "/h2-console/**").permitAll()
  .anyRequest().authenticated()
```

Prioridade:

- Media.

## Melhorias de qualidade de codigo

### 1. Padronizar nomes de pacotes

Problema:

- Pacotes estao como `Controllers`, `Services`, `Dtos`, `Repositories`.
- Em Java, convencao comum e usar minusculo: `controllers`, `services`, `dtos`, `repositories`.

Prioridade:

- Baixa, mas bom para portfolio.

### 2. Remover imports nao usados

Exemplos:

- `CategoryController` importa classes de produto que nao usa.
- `Role` tem import de `Autowired` e anotacao em getter que nao parece necessaria.

Prioridade:

- Baixa.

### 3. Melhorar tratamento de update de produto

Problema:

- `repository.getReferenceById(id)` pode gerar excecao JPA se o id nao existir.

Acao:

- Usar `findById` com `ResourceNotFoundException`.

Prioridade:

- Media.

### 4. Criar DTOs especificos por operacao

Sugestao:

- `ProductCreateDto`
- `ProductUpdateDto`
- `ProductResponseDto`
- `UserCreateDto`
- `UserUpdateDto`
- `OrderCreateDto`
- `OrderResponseDto`

Beneficio:

- Evita campos desnecessarios no request.
- Facilita validacao.
- Melhora documentacao da API.

Prioridade:

- Media.

## Melhorias de testes

### 1. Testes de services

Criar testes para:

- Criar pedido.
- Validar usuario dono do pedido.
- Criar produto.
- Atualizar produto.
- Deletar produto com integridade referencial.

Prioridade:

- Media.

### 2. Testes de controllers

Criar testes para:

- `GET /products`.
- `POST /products` com admin.
- `POST /products` sem admin.
- `POST /orders` autenticado.
- `GET /orders/{id}` tentando acessar pedido de outro usuario.

Prioridade:

- Media.

### 3. Testes de seguranca

Validar:

- Admin acessa rotas admin.
- Usuario comum nao acessa rotas admin.
- Usuario comum so acessa proprio pedido.

Prioridade:

- Alta.

## Melhorias para portfolio

### 1. README principal mais forte

Incluir:

- Descricao do projeto.
- Stack.
- Como rodar.
- Como autenticar.
- Endpoints principais.
- Prints do frontend quando existir.
- Usuario admin de teste.
- Link do deploy.

### 2. Swagger/OpenAPI

Adicionar:

- `springdoc-openapi`.

Beneficio:

- Documentacao navegavel.
- Facilita demonstracao para recrutadores/clientes.
- Facilita desenvolvimento do frontend.

### 3. Deploy

Sugestao:

- Backend: Render, Railway, Fly.io ou VPS.
- Banco: PostgreSQL gerenciado.
- Frontend: Vercel ou Netlify.

### 4. Nicho visual e comercial

Como o nome e JKCards, deixar o projeto com identidade de loja de cards:

- Produtos reais/ficticios coerentes com cards.
- Categorias como `Boosters`, `Decks`, `Sleeves`, `Acessorios`, `Singles`.
- Imagens consistentes.
- Dashboard com linguagem comercial.

## Roadmap sugerido

### Sprint 1 - Destravar frontend

- Corrigir IDs dos DTOs de produto.
- Corrigir validacao de preco.
- Validar JWT/roles.
- Criar cadastro de usuario.
- Criar `GET /orders/my`.

### Sprint 2 - Loja funcional

- Implementar frontend publico.
- Implementar login.
- Implementar carrinho.
- Implementar checkout.
- Implementar detalhe de pedido.

### Sprint 3 - Admin essencial

- CRUD de produtos.
- CRUD de categorias.
- Listagem de pedidos.
- Atualizacao de status.

### Sprint 4 - Portfolio e gestao

- Dashboard.
- PostgreSQL.
- Migrations.
- Swagger.
- Deploy.
- README e prints.

