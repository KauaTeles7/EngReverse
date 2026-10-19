# Publicação no GitHub e histórico de commits

O enunciado pede repositório no padrão `nome-sobrenome-engenharia-reversa`, pelo menos 8 commits e atividade em pelo menos 3 dias diferentes.

## Criar repositório
1. Entre em GitHub e crie um repositório vazio com o nome pedido pelo professor.
2. Abra o terminal dentro da pasta `sistema/`.
3. Execute:

```bash
git init
git add .
git commit -m "docs: adiciona documentação inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/nome-sobrenome-engenharia-reversa.git
git push -u origin main
```

Troque a URL de exemplo pela URL real do seu repositório. Não compartilhe token ou senha.

## Sugestão de divisão em 8 commits reais
Faça cada etapa em momentos diferentes, ao longo de pelo menos 3 dias de trabalho. Os comandos abaixo são exemplos de mensagens, não um histórico já criado:

1. `docs: registra requisitos funcionais`
2. `docs: adiciona DER e dicionário de dados`
3. `docs: documenta endpoints da API`
4. `docs: mapeia páginas e scripts do front-end`
5. `docs: analisa controles e riscos de segurança`
6. `test: adiciona testes automatizados da API`
7. `docs: adiciona diagrama de fluxo e comentários`
8. `docs: registra evidências e instruções de entrega`

Depois de cada etapa, revise os arquivos, execute os testes quando possível e faça um commit verdadeiro. O repositório precisa refletir seu trabalho real. Não altere datas do Git nem crie commits falsos para simular dias diferentes.

## Publicar mudanças
```bash
git add .
git commit -m "mensagem que descreve a mudança"
git push
```

Ao terminar, abra o repositório no navegador, copie a URL e cole no Classroom. Clique em **Entregar**.
