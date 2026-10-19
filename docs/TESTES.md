# 6. Plano de testes e evidências

## Como executar
Dentro da pasta `sistema/`:

```bash
npm install
npm test
```

A suíte em `testes/api.test.js` utiliza o módulo nativo `node:test`, inicia o servidor e usa um banco temporário (`DB_PATH`). Não é necessário alterar o banco SQLite de demonstração. Ela cria registros apenas no banco temporário e o remove no final.

## Casos automatizados incluídos
| Nº | Caso | Resultado esperado |
|---:|---|---|
| 1 | Abrir a raiz | Resposta HTTP de redirecionamento/servida |
| 2 | Acessar clientes sem sessão | 401 |
| 3 | Login sem campos | 400 |
| 4 | Login com `admin/admin123` | 200 |
| 5 | Consultar sessão atual | 200 e nome do usuário |
| 6 | Listar clientes | 200 e array JSON |
| 7 | Cadastrar cliente sem nome | 400 |
| 8 | Cadastrar cliente com CPF de tamanho inválido | 400 |
| 9 | Cadastrar cliente com e-mail inválido | 400 |
| 10 | Cadastrar cliente válido | 201 e CPF recuperável na resposta da listagem |
| 11 | Pesquisar cliente cadastrado | Cliente presente no resultado |
| 12 | Cadastrar veículo com placa inválida | 400 |
| 13 | Cadastrar veículo válido | 201 e veículo listado |
| 14 | Cadastrar agendamento com data impossível | 400 |
| 15 | Cadastrar e listar agendamento válido | 201 e registro presente |
| 16 | Alterar data de agendamento existente | 200 |
| 17 | Editar cliente inexistente | 404 |
| 18 | Fazer logout e consultar `/api/me` | Logout 200; consulta seguinte 401 |

A suíte contém 18 casos, ultrapassando o mínimo solicitado de 15.

## Registro de execução real nesta preparação
- Ambiente disponível: Node.js `v22.16.0`, npm `10.9.2`.
- A primeira tentativa de `npm test` **não passou**: as dependências não estavam instaladas e o servidor encerrou com `Cannot find module 'express'`.
- A tentativa de `npm ci` no ambiente de preparação terminou por timeout, então não foi possível repetir a suíte com dependências instaladas neste ambiente.
- Portanto, **nenhum dos 18 casos está declarado como aprovado neste registro**. O resultado precisa ser confirmado executando `npm install` e `npm test` no computador do aluno.
- Não existem capturas de tela de resultados anexadas porque não foi possível concluir uma execução válida.

## Evidências a capturar depois da execução
Guarde apenas evidências reais, sem editar o conteúdo para simular sucesso:
1. Terminal mostrando `node -v`.
2. Terminal mostrando a saída completa de `npm test`.
3. Tela de login.
4. Tela de clientes com registros de demonstração.
5. Tela de veículos.
6. Tela de agendamentos.
7. Requisição de login e uma requisição privada após logout, se usar DevTools/Postman.

Salve as capturas em `evidencias/` e escreva a data e o ambiente em uma legenda. Não inclua dados pessoais reais.
