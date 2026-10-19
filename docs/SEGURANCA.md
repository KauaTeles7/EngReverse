# 5. Análise de segurança

Esta análise é baseada na leitura estática do código recebido. Não é uma auditoria de segurança completa nem um teste de invasão.

## Controles encontrados
1. **Hash de senha:** o login usa `bcryptjs.compareSync` e o SQL de exemplo guarda hashes bcrypt.
2. **Sessão HTTP:** o pacote `express-session` mantém o estado autenticado; o cookie está configurado com `httpOnly: true` e duração de 30 minutos.
3. **Proteção de rotas:** `exigirLogin` bloqueia rotas privadas sem sessão.
4. **Criptografia de CPF:** `seguranca.js` usa AES-256-GCM com IV aleatório e tag de autenticação.
5. **SQL parametrizado:** consultas de entrada usam placeholders (`?`), reduzindo risco de SQL injection nesses trechos.
6. **Escape HTML:** `esc()` converte caracteres especiais antes de inserir textos em tabelas.

## Riscos identificados
- **Alto — segredos fixos no código:** a chave de sessão e o material usado para derivar a chave de CPF estão escritos diretamente no fonte. Se o repositório for público, qualquer pessoa pode conhecer esses segredos.
- **Alto — CPF retornado pela API:** as rotas de clientes e agendamentos devolvem CPF em texto claro para qualquer usuário autenticado; não há autorização por função/perfil.
- **Médio — cookie sem `secure` e `sameSite` explícitos:** em produção HTTPS, o cookie deve ser `secure`; configurar `sameSite` e avaliar proteção CSRF conforme a arquitetura.
- **Médio — sessão em memória padrão:** o armazenamento padrão do `express-session` não é indicado para produção, pois perde sessões ao reiniciar e não escala entre processos.
- **Médio — falta de limitação de tentativas de login:** não foi observada limitação por IP/conta, o que aumenta exposição a tentativas repetidas.
- **Médio — validação do CPF incompleta:** verifica apenas 11 dígitos e duplicidade, não os dígitos verificadores.
- **Baixo/médio — mensagens e erros:** não há middleware de erro centralizado e não foi observada política explícita de limite de tamanho do JSON.
- **Médio — dependências:** é necessário revisar e atualizar dependências regularmente; não se declara aqui que há vulnerabilidade específica sem executar auditoria atualizada.

## Três melhorias recomendadas
1. **Externalizar segredos:** usar variáveis de ambiente para `SESSION_SECRET` e para chave de criptografia. Planejar migração dos CPFs existentes antes de trocar a chave, porque dados criptografados com a chave antiga deixam de ser legíveis.
2. **Endurecer sessões em produção:** configurar `cookie.secure` em HTTPS, `sameSite`, política CSRF adequada e armazenamento de sessão persistente; adicionar rate limiting no login.
3. **Reduzir exposição de dados pessoais:** devolver apenas campos necessários para cada tela, validar CPF com dígitos verificadores e implementar autorização por perfil quando necessária.

## Limites da análise
Não foi feita varredura dinâmica, teste de penetração, auditoria automatizada de dependências nem revisão jurídica de LGPD. As conclusões acima são riscos inferidos diretamente da implementação e precisam ser confirmadas em ambiente de homologação.
