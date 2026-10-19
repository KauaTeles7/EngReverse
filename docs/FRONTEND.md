# 4. Mapa do front-end

## Páginas e scripts

| Página | Finalidade | Script principal | APIs chamadas |
|---|---|---|---|
| `public/login.html` | Formulário de login | `public/js/login.js` + `comum.js` | `POST /api/login` |
| `public/principal.html` | Página inicial após login | Verificar HTML e navegação | `GET /api/me` por `iniciarPagina()` |
| `public/clientes.html` | Pesquisa, cadastro e edição de clientes | `public/js/clientes.js` | `GET /api/clientes`, `POST /api/clientes`, `PUT /api/clientes/:id` |
| `public/veiculos.html` | Listagem e cadastro de veículos | `public/js/veiculos.js` | `GET /api/veiculos`, `GET /api/clientes`, `POST /api/veiculos` |
| `public/agendamentos.html` | Listagem, criação e alteração de data | `public/js/agendamentos.js` | `GET /api/agendamentos`, `GET /api/veiculos`, `POST /api/agendamentos`, `PUT /api/agendamentos/:id` |

`public/css/style.css` centraliza o estilo visual. `public/js/comum.js` contém funções compartilhadas.

## Funções compartilhadas em `comum.js`
- `api(url, opcoes)`: executa `fetch`, serializa o corpo JSON, interpreta respostas e redireciona para o login em caso de 401.
- `esc(texto)`: escapa caracteres HTML básicos para reduzir risco de XSS refletido/armazenado nas células montadas com template strings.
- `formatarCpf`, `formatarData`, `nomeMes`: formatam dados para exibição.
- `avisar`: exibe mensagens temporárias.
- `abrirModal` / `fecharModal`: mostram e escondem modais.
- `iniciarPagina`: busca o usuário da sessão e liga o botão de sair.

## Fluxo geral
1. O navegador abre `/` e recebe redirecionamento para `/login.html`.
2. O usuário envia login e senha para `/api/login`.
3. Com credenciais válidas, o servidor guarda `{id, nome}` na sessão e o navegador vai para `principal.html`.
4. Páginas internas chamam `/api/me`; as rotas de dados verificam sessão.
5. Os scripts consultam a API e atualizam as tabelas HTML.
6. Formulários enviam JSON para rotas POST/PUT; erros são apresentados ao usuário.

## Pontos de atenção observados
- `iniciarPagina()` é assíncrona e é chamada sem `await` nos scripts; falhas de rede além de 401 podem gerar rejeição não tratada.
- A função `api()` envia `Content-Type: application/json` também em GET, algo geralmente desnecessário.
- As tabelas são construídas com template strings; os campos textuais passam por `esc()` nas páginas de clientes, veículos e agendamentos.
