const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'autocerta-test-'));
const dbPath = path.join(temp, 'teste.sqlite');
let servidor;
const base = 'http://127.0.0.1:3000';
let cookie = '';
let clienteId;
let veiculoId;
let agendamentoId;

async function esperarServidor() {
  for (let i = 0; i < 60; i++) {
    try { await fetch(base); return; } catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error('Servidor não iniciou dentro do tempo esperado.');
}
async function requisitar(url, { method = 'GET', body, autenticado = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (autenticado && cookie) headers.cookie = cookie;
  const response = await fetch(base + url, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual'
  });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie && url === '/api/login') cookie = setCookie.split(';')[0];
  const texto = await response.text();
  let dados;
  try { dados = texto ? JSON.parse(texto) : {}; } catch { dados = { texto }; }
  return { status: response.status, dados, response };
}
before(async () => {
  servidor = spawn(process.execPath, ['server.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, DB_PATH: dbPath },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  await esperarServidor();
});
after(() => {
  if (servidor && !servidor.killed) servidor.kill();
  fs.rmSync(temp, { recursive: true, force: true });
});

test('01 - página inicial responde', async () => {
  const r = await requisitar('/', { autenticado: false });
  assert.ok([200, 301, 302, 304].includes(r.status));
});
test('02 - rota privada bloqueia acesso sem sessão', async () => {
  cookie = '';
  const r = await requisitar('/api/clientes', { autenticado: false });
  assert.equal(r.status, 401);
});
test('03 - login sem campos é rejeitado', async () => {
  const r = await requisitar('/api/login', { method: 'POST', body: {}, autenticado: false });
  assert.equal(r.status, 400);
});
test('04 - login com credenciais válidas funciona', async () => {
  const r = await requisitar('/api/login', { method: 'POST', body: { login: 'admin', senha: 'admin123' }, autenticado: false });
  assert.equal(r.status, 200);
  assert.equal(r.dados.ok, true);
});
test('05 - endpoint de usuário retorna a sessão atual', async () => {
  const r = await requisitar('/api/me');
  assert.equal(r.status, 200);
  assert.equal(r.dados.nome, 'Administrador');
});
test('06 - lista de clientes retorna array', async () => {
  const r = await requisitar('/api/clientes');
  assert.equal(r.status, 200);
  assert.ok(Array.isArray(r.dados));
});
test('07 - cliente sem nome é rejeitado', async () => {
  const r = await requisitar('/api/clientes', { method: 'POST', body: { nome: '', cpf: '12345678901' } });
  assert.equal(r.status, 400);
});
test('08 - CPF com quantidade errada de dígitos é rejeitado', async () => {
  const r = await requisitar('/api/clientes', { method: 'POST', body: { nome: 'Teste', cpf: '123' } });
  assert.equal(r.status, 400);
});
test('09 - e-mail inválido é rejeitado', async () => {
  const r = await requisitar('/api/clientes', { method: 'POST', body: { nome: 'Teste', cpf: '11122233344', email: 'email-invalido' } });
  assert.equal(r.status, 400);
});
test('10 - cliente válido pode ser cadastrado e CPF é devolvido descriptografado', async () => {
  const r = await requisitar('/api/clientes', { method: 'POST', body: { nome: 'Cliente de Teste', cpf: '11122233344', telefone: '11999990000', email: 'teste@example.com' } });
  assert.equal(r.status, 201);
  const lista = await requisitar('/api/clientes?busca=Cliente%20de%20Teste');
  const item = lista.dados.find(c => c.nome === 'Cliente de Teste');
  assert.ok(item);
  assert.equal(item.cpf, '11122233344');
  clienteId = item.id;
});
test('11 - busca de clientes filtra por termo', async () => {
  const r = await requisitar('/api/clientes?busca=Cliente%20de%20Teste');
  assert.equal(r.status, 200);
  assert.ok(r.dados.some(c => c.id === clienteId));
});
test('12 - placa inválida é rejeitada', async () => {
  const r = await requisitar('/api/veiculos', { method: 'POST', body: { placa: 'INVALIDA', modelo: 'Modelo', tipo: 'Carro', cliente_id: clienteId } });
  assert.equal(r.status, 400);
});
test('13 - veículo válido pode ser cadastrado', async () => {
  const r = await requisitar('/api/veiculos', { method: 'POST', body: { placa: 'TST1A23', modelo: 'Veículo Teste', tipo: 'Carro', marca: 'Teste', cliente_id: clienteId } });
  assert.equal(r.status, 201);
  const lista = await requisitar('/api/veiculos');
  const item = lista.dados.find(v => v.placa === 'TST1A23');
  assert.ok(item);
  veiculoId = item.id;
});
test('14 - agendamento com data impossível é rejeitado', async () => {
  const r = await requisitar('/api/agendamentos', { method: 'POST', body: { veiculo_id: veiculoId, data_agendamento: '2026-02-30', servico: 'Teste' } });
  assert.equal(r.status, 400);
});
test('15 - agendamento válido pode ser cadastrado e listado', async () => {
  const r = await requisitar('/api/agendamentos', { method: 'POST', body: { veiculo_id: veiculoId, data_agendamento: '2027-01-15', servico: 'Teste de revisão' } });
  assert.equal(r.status, 201);
  const lista = await requisitar('/api/agendamentos');
  const item = lista.dados.find(a => a.servico === 'Teste de revisão' && a.placa === 'TST1A23');
  assert.ok(item);
  agendamentoId = item.id;
});
test('16 - edição de data de agendamento funciona', async () => {
  const r = await requisitar('/api/agendamentos/' + agendamentoId, { method: 'PUT', body: { data_agendamento: '2027-01-20' } });
  assert.equal(r.status, 200);
});
test('17 - edição de cliente inexistente retorna 404', async () => {
  const r = await requisitar('/api/clientes/999999', { method: 'PUT', body: { nome: 'Inexistente', cpf: '12345678901' } });
  assert.equal(r.status, 404);
});
test('18 - logout encerra sessão e bloqueia acesso privado', async () => {
  const r = await requisitar('/api/logout', { method: 'POST' });
  assert.equal(r.status, 200);
  cookie = '';
  const depois = await requisitar('/api/me', { autenticado: false });
  assert.equal(depois.status, 401);
});
