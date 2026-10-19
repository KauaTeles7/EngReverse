# 3. Mapa da API

Base local: `http://localhost:3000`. As respostas de erro normalmente usam JSON no formato `{ "erro": "mensagem" }`. As rotas protegidas retornam HTTP 401 quando não existe sessão.

| Método | Rota | Login | Entrada principal | Saída/efeito |
|---|---|---:|---|---|
| GET | `/` | Não | — | Redireciona para `/login.html` |
| POST | `/api/login` | Não | `{login, senha}` | `200 {ok:true}` ou erro 400/401; cria sessão |
| POST | `/api/logout` | Não | — | Destrói sessão e retorna `{ok:true}` |
| GET | `/api/me` | Sim | Cookie de sessão | `{id, nome}` do usuário |
| GET | `/api/clientes` | Sim | Query opcional `busca` | Array de clientes; CPF descriptografado |
| POST | `/api/clientes` | Sim | `{nome, cpf, telefone, email}` | `201 {ok:true}` |
| PUT | `/api/clientes/:id` | Sim | Campos de cliente | `200 {ok:true}` ou 400/404 |
| GET | `/api/veiculos` | Sim | — | Array de veículos com `cliente_nome` |
| POST | `/api/veiculos` | Sim | `{placa, modelo, tipo, marca, cliente_id}` | `201 {ok:true}` ou 400 |
| GET | `/api/agendamentos` | Sim | — | Array com dados de agendamento, veículo e cliente |
| POST | `/api/agendamentos` | Sim | `{veiculo_id, data_agendamento, servico}` | `201 {ok:true}` ou 400 |
| PUT | `/api/agendamentos/:id` | Sim | `{data_agendamento}` | `200 {ok:true}` ou 400/404 |

## Validações e respostas relevantes
- `POST /api/login`: falta de login/senha → 400; credenciais incorretas → 401.
- `POST /api/clientes` e `PUT /api/clientes/:id`: nome, CPF de 11 dígitos, formato simples de e-mail e CPF não duplicado.
- `POST /api/veiculos`: formato da placa, modelo, tipo, cliente existente e placa única.
- `POST /api/agendamentos`: veículo existente, data válida e serviço preenchido.
- `PUT /api/agendamentos/:id`: agendamento existente e data válida.
- `GET /api/me`, `GET /api/clientes`, `POST /api/clientes`, `PUT /api/clientes/:id`, `GET /api/veiculos`, `POST /api/veiculos`, `GET /api/agendamentos`, `POST /api/agendamentos` e `PUT /api/agendamentos/:id` passam pelo middleware `exigirLogin`.

## Observações técnicas
- A API usa consultas SQL parametrizadas nos pontos de entrada observados.
- A busca de clientes é feita em memória depois de consultar todos os clientes, pois o CPF está criptografado. Isso pode ficar lento com muitos registros.
- `POST /api/logout` não exige login; isso permite chamar logout mesmo sem sessão ativa.
- O servidor não define middleware de tratamento global de erros nem validação de esquema centralizada.
