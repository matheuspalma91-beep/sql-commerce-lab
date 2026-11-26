# Contribuindo

## Fluxo recomendado

1. Abra uma issue com a pergunta analítica ou o problema reproduzível.
2. Crie uma branch curta a partir de `main`.
3. Mantenha schema, consulta e teste na mesma mudança quando forem relacionados.
4. Execute `npm run check` e, se os resultados mudarem, `npm run report`.
5. Abra uma PR explicando a pergunta, a regra SQL e como ela foi validada.

## Regras do dataset

- não adicione dados de clientes, empregadores ou organizações reais;
- exemplos devem continuar inteiramente fictícios;
- alterações no gerador exigem `npm run data` e revisão do relatório;
- valores monetários persistidos devem permanecer em centavos;
- novas consultas devem ser numeradas e cobertas por teste.

Use Conventional Commits. Problemas de segurança seguem [SECURITY.md](SECURITY.md).

