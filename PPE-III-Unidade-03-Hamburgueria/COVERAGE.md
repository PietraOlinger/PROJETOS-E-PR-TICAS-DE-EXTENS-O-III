# Relatório de cobertura

Os relatórios completos são gerados localmente pelos comandos abaixo:

```bash
npm run coverage:backend
npm run coverage:frontend
```

Os arquivos HTML e LCOV ficam em `backend/coverage` e `frontend/coverage`. A execução validada da entrega apresentou:

| Área | Statements | Branches | Functions | Lines |
| --- | ---: | ---: | ---: | ---: |
| Back-end | 93,18% | 89,36% | 95,23% | 94,28% |
| Front-end | 100% | 95% | 100% | 100% |

O Jest e o Vitest bloqueiam a execução quando qualquer métrica global fica abaixo de 80%. O workflow do GitHub Actions publica os diretórios de cobertura como artefato `coverage-reports`.