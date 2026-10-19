# 1. Requisitos funcionais e regras de negócio

## Visão geral
O AutoCerta é um sistema web para uma oficina mecânica. O servidor Node.js/Express entrega páginas estáticas e uma API JSON. Os dados ficam em SQLite. O login usa sessão HTTP e as senhas iniciais estão armazenadas como hashes bcrypt no banco.

## Requisitos funcionais observados no código

| ID | Requisito | Evidência no projeto |
|---|---|---|
| RF01 | Redirecionar a raiz para a página de login | `server.js`, rota `GET /` |
| RF02 | Autenticar usuário com login e senha | `POST /api/login` |
| RF03 | Consultar usuário da sessão atual | `GET /api/me` |
| RF04 | Encerrar a sessão | `POST /api/logout` |
| RF05 | Listar clientes e pesquisar por nome, e-mail, telefone ou CPF | `GET /api/clientes` |
| RF06 | Cadastrar cliente | `POST /api/clientes` |
| RF07 | Editar cliente existente | `PUT /api/clientes/:id` |
| RF08 | Listar veículos com nome do cliente associado | `GET /api/veiculos` |
| RF09 | Cadastrar veículo associado a cliente | `POST /api/veiculos` |
| RF10 | Listar agendamentos com dados relacionados de veículo e cliente | `GET /api/agendamentos` |
| RF11 | Criar agendamento de serviço | `POST /api/agendamentos` |
| RF12 | Alterar a data de um agendamento | `PUT /api/agendamentos/:id` |
| RF13 | Exibir mensagens de erro e sucesso nas páginas | scripts em `public/js/` |

## Regras de negócio observadas
1. As rotas de consulta e alteração de dados exigem sessão autenticada.
2. Login e senha são obrigatórios; credenciais inválidas retornam HTTP 401.
3. Nome do cliente não pode ficar vazio.
4. O CPF precisa conter 11 dígitos após remover pontuação. O código verifica quantidade e duplicidade, mas **não valida os dígitos verificadores do CPF**.
5. E-mail, quando informado, deve corresponder a uma validação simples de formato.
6. O CPF é criptografado antes de ser gravado e descriptografado ao retornar pela API.
7. A placa é normalizada para maiúsculas e sem espaços/hífens e deve corresponder ao padrão antigo ou Mercosul aceito pela expressão regular.
8. A placa precisa ser única.
9. Veículo deve ter modelo, tipo e cliente existente.
10. Agendamento deve apontar para veículo existente, conter serviço e uma data real no formato `AAAA-MM-DD`.
11. Ao editar um agendamento, somente a data é alterada.
12. A sessão tem duração configurada de 30 minutos.
13. O banco ativa `PRAGMA foreign_keys = ON`; relações inválidas são bloqueadas pelo SQLite.

## Requisitos não funcionais
- RNF01: interface acessível por navegador.
- RNF02: API usa JSON para requisições e respostas de dados.
- RNF03: persistência local em SQLite.
- RNF04: senhas armazenadas com hash bcrypt.
- RNF05: conteúdo de texto vindo do banco é escapado antes de compor HTML nas telas analisadas.
- RNF06: execução exige Node.js 22.13 ou superior por usar `node:sqlite`.

## Fora do escopo observado
Não foi encontrada função de exclusão de clientes, veículos ou agendamentos; também não foi observada gestão de permissões por perfil, recuperação de senha, envio de e-mail ou API pública. Não presumir que esses recursos existam.
