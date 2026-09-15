# PPE III - Unidade 3 - Hamburgueria

Aplicacao web com API Express, MongoDB/Mongoose, autenticacao JWT e interface React/Vite. O projeto inclui cadastro, login, CRUD protegido de tarefas, testes unitarios, testes de integracao, mocks, fixtures, cobertura e CI com GitHub Actions.

## Tecnologias

- Back-end: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Jest, Supertest e MongoDB Memory Server.
- Front-end: React, Vite, Vitest, React Testing Library, Jest DOM e User Event.
- CI: GitHub Actions.

## Instalação

Na pasta principal:

```bash
npm run install:all
```

Configure `backend/.env` com uma conexão MongoDB válida para executar a API normalmente. Os testes de integração usam um MongoDB temporário em memória.

## Execução

```bash
npm run dev:backend
npm run dev:frontend
```

A API usa a porta `3000` e o frontend usa a porta `5173`.

## Testes, cobertura e build

```bash
npm test
npm run coverage
npm run build
```

A cobertura mínima configurada é de 80% para branches, functions, lines e statements. O workflow em `.github/workflows/ci.yml` executa testes, cobertura e build em pushes e pull requests para `main`.

O relatório resumido está em [COVERAGE.md](COVERAGE.md). Os relatórios HTML e LCOV são gerados nas pastas `backend/coverage` e `frontend/coverage`.
