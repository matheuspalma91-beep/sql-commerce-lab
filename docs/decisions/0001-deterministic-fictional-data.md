# ADR 0001 — Dataset fictício e determinístico

- Status: aceito
- Data: 2026-11-26

## Contexto

O projeto precisa demonstrar modelagem, análise e comunicação de resultados sem depender de acesso a dados privados, conta em uma plataforma externa ou licença ambígua de terceiros.

## Decisão

Gerar localmente um dataset de e-commerce totalmente fictício por meio de um gerador pseudoaleatório com seed fixa. O SQL gerado é versionado, e o CI confirma que ele ainda corresponde ao gerador.

## Consequências

### Positivas

- qualquer pessoa reproduz o mesmo resultado;
- não há dados pessoais ou comerciais reais;
- casos de atraso, recorrência, desconto e cancelamento podem ser exercitados deliberadamente;
- mudanças no dataset aparecem no diff.

### Negativas

- distribuições podem ser menos realistas que as de um negócio real;
- nenhum insight deve ser apresentado como evidência de mercado;
- o arquivo SQL gerado aumenta o tamanho do repositório.

## Alternativas consideradas

- dataset público: acrescentaria dependência de download, licença e disponibilidade;
- somente fixtures pequenas: simplificaria os testes, mas empobreceria consultas de coorte e série temporal;
- banco binário versionado: dificultaria revisão de código e auditoria do conteúdo.

