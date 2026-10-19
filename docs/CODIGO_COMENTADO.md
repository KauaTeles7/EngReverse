# 8. Código comentado — decisões principais

Os comentários explicativos também foram adicionados nos trechos principais de `server.js` e `db/conexao.js`. Esta página explica por que esses trechos existem.

## `server.js`
- `express.json()`: interpreta corpos JSON enviados pelos formulários.
- `express-session`: mantém a sessão entre requisições para que o servidor reconheça o usuário autenticado.
- `exigirLogin(req, res, next)`: middleware reutilizado nas rotas privadas; evita repetir a mesma verificação em cada endpoint.
- `validarCliente(corpo, idAtual)`: centraliza as regras do cliente para que cadastro e edição validem os campos de maneira consistente. `idAtual` permite que um cliente mantenha seu próprio CPF durante a edição.
- `PLACA_VALIDA`: expressão regular para validar a placa após normalização. A expressão aceita o padrão antigo e o Mercosul, mas não verifica a existência da placa em cadastro oficial.
- `dataValida(texto)`: verifica o padrão ISO e também compara a data convertida com a entrada, para rejeitar datas impossíveis como 30 de fevereiro.
- Consultas com `?`: separam valores da instrução SQL e ajudam a evitar que conteúdo recebido do usuário seja interpretado como SQL.

## `seguranca.js`
1. `crypto.scryptSync(...)` deriva uma chave de 32 bytes.
2. `randomBytes(12)` gera um IV diferente para cada criptografia.
3. `createCipheriv('aes-256-gcm', ...)` cifra o CPF e gera uma tag de autenticação.
4. A função armazena IV, tag e dados cifrados em Base64 separados por `:`.
5. `descriptografar()` reconstrói os buffers e verifica a tag antes de devolver o texto original.

**Limitação importante:** a chave e o salt estão fixos no código. Isso facilita a demonstração, mas não é apropriado para produção. Não trocar a chave sem planejar a migração dos dados já criptografados.

## `db/conexao.js`
- `DatabaseSync` fornece acesso ao SQLite usando a API nativa de Node.js.
- `PRAGMA foreign_keys = ON` ativa a verificação das relações.
- O SQL inicial só é executado quando o arquivo de banco não existia antes.
- A variável de ambiente `DB_PATH` foi adicionada para permitir que os testes usem um banco separado; sem ela, o caminho original `db/oficina_db.sqlite` continua sendo usado.

## `public/js/comum.js`
- `api()` concentra as chamadas HTTP e a interpretação de erros.
- O redirecionamento ao receber 401 leva o usuário de volta ao login quando a sessão expira.
- `esc()` escapa caracteres especiais antes de inserir valores textuais nas tabelas montadas com HTML.
- As funções de data e CPF tratam apenas a apresentação; as validações importantes precisam existir no servidor, porque o navegador pode ser contornado.

## Exemplo de caminho de uma requisição
O formulário coleta os campos → o JavaScript chama `api()` → Express recebe JSON → `exigirLogin` verifica a sessão → a rota valida os dados → SQLite grava os valores → o servidor responde com status HTTP e JSON → o navegador atualiza a listagem ou mostra erro.
