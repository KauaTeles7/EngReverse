# AutoCerta — Engenharia reversa

Documentação e suíte de testes para o sistema web de oficina mecânica recebido no arquivo original.

## Requisitos
- Node.js **22.13 ou superior** (`node -v`)
- npm
- Navegador moderno

## Executar localmente
Na pasta `sistema/`:

```bash
npm install
npm start
```

Abra <http://localhost:3000>. Os usuários de demonstração estão em `LEIA-ME.txt`. Não use essas credenciais em produção.

## Executar os testes automatizados
```bash
npm test
```

A suíte usa `node:test`, inicia o servidor em processo separado e configura `DB_PATH` para criar um banco temporário. Assim, os testes não precisam gravar nos dados locais do sistema. O banco temporário é removido ao final.

**Importante:** os testes só devem ser descritos como aprovados depois de executar `npm test` e guardar a saída real. Veja `docs/TESTES.md` para os casos e o registro honesto da execução inicial deste pacote.

## Documentação
- `docs/REQUISITOS.md` — requisitos funcionais e regras de negócio
- `docs/DER.md` — modelo relacional e diagrama ER
- `docs/API.md` — rotas, entradas, saídas e validações
- `docs/FRONTEND.md` — páginas, scripts e chamadas de API
- `docs/SEGURANCA.md` — análise de segurança e melhorias
- `docs/TESTES.md` — plano de testes e registro de execução
- `docs/FLUXO.md` — diagrama de fluxo do cadastro de cliente
- `docs/CODIGO_COMENTADO.md` — explicação das principais decisões do código

## Estrutura
```text
sistema/
├── db/                 # conexão SQLite, SQL de criação e banco local
├── docs/               # documentação da engenharia reversa
├── evidencias/          # local para anexar evidências reais
├── public/              # HTML, CSS e JavaScript do navegador
├── testes/              # testes automatizados da API
├── server.js            # rotas HTTP e regras de negócio
├── seguranca.js         # criptografia de CPF
├── package.json
└── README.md
```

## Antes de entregar
1. Execute `npm install` e `npm test` no seu computador.
2. Se algum teste falhar, investigue e registre o resultado; não marque como aprovado sem evidência.
3. Faça capturas de tela reais em `evidencias/` (login, telas principais, testes e terminal).
4. Revise a documentação após qualquer alteração no código.
5. Crie o repositório GitHub com o padrão de nome exigido pelo professor.
6. Faça pelo menos 8 commits reais em pelo menos 3 dias diferentes. Não crie commits retroativos apenas para aparentar cumprir a regra.
7. Cole o link do repositório no Classroom e clique em **Entregar**.

## Observação sobre dados
O banco `db/oficina_db.sqlite` fornecido contém dados de demonstração. Faça uma cópia antes de testar manualmente. Não publique dados pessoais reais nem segredos no GitHub.
