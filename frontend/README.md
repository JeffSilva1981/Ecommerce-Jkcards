# JKCards Frontend

Frontend do ecommerce JKCards, feito com React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, Zustand, React Hook Form, Zod, Axios e Lucide React.

Este guia foi escrito para conseguir rodar e testar o front mesmo sem o backend ligado.

## Requisitos

Instale antes:

- Node.js 22 ou superior
- npm 10 ou superior

Para conferir:

```bash
node --version
npm --version
```

## Como instalar

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependencias:

```bash
npm install
```

## Configurar ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

No Windows PowerShell, se preferir:

```powershell
Copy-Item .env.example .env
```

Por padrao, o projeto vem com mocks ligados:

```env
VITE_ENABLE_MOCKS=true
```

Com isso, da para testar catalogo, login, carrinho, pedidos e admin sem rodar o backend.

## Como rodar

```bash
npm run dev
```

Depois abra:

```text
http://127.0.0.1:5173
```

## Login para testar

Admin mock:

```text
Email: admin@jkcards.com
Senha: admin123
```

Cliente mock:

```text
Email: cliente@jkcards.com
Senha: cliente123
```

Qualquer senha com 3 ou mais caracteres funciona no modo mock, desde que o email exista nos dados mockados.

## Telas principais

Loja:

- `/`
- `/produtos`
- `/produtos/:id`
- `/carrinho`
- `/checkout`
- `/pedidos`
- `/pedidos/:id`

Autenticacao:

- `/login`
- `/cadastro`

Admin:

- `/admin`
- `/admin/produtos`
- `/admin/produtos/novo`
- `/admin/produtos/:id`
- `/admin/categorias`
- `/admin/pedidos`
- `/admin/usuarios`

## Como rodar os testes

```bash
npm test
```

O projeto tem testes para:

- carrinho;
- validacoes de login/cadastro;
- card de produto;
- badge de status do pedido.

## Como gerar build

```bash
npm run build
```

O build final fica na pasta:

```text
frontend/dist
```

## Como ligar com o backend real

Abra o arquivo `.env` e configure:

```env
VITE_API_URL=http://localhost:8080
VITE_CLIENT_ID=myclientid
VITE_CLIENT_SECRET=myclientsecret
VITE_ENABLE_MOCKS=false
```

Depois rode o frontend:

```bash
npm run dev
```

Com `VITE_ENABLE_MOCKS=false`, o front passa a chamar a API Spring Boot.

## Observacoes importantes

Antes de usar 100% com backend real, o backend precisa corrigir/implementar alguns pontos:

- retornar `id` em `ProductDto` e `ProductMinDto`;
- corrigir validacao do campo `price`;
- criar endpoint de cadastro de usuario;
- criar listagem de pedidos do usuario;
- criar endpoints admin de usuarios, categorias, pedidos e dashboard.

Enquanto isso, o modo mock permite testar toda a experiencia visual e os fluxos principais do front.

## Comandos uteis

```bash
npm install
npm run dev
npm test
npm run build
```

