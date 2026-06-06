console.log("locacoes.js carregou");

const API_URL = "https://cinerental-api.onrender.com";

let locacoes = [];
let clientes = [];
let filmes = [];

async function carregarDados() {
  try {
    const [resLocacoes, resClientes, resFilmes] = await Promise.all([
      fetch(`${API_URL}/locacoes`),
      fetch(`${API_URL}/clientes`),
      fetch(`${API_URL}/filmes`)
    ]);

    locacoes = await resLocacoes.json();
    clientes = await resClientes.json();
    filmes = await resFilmes.json();

    popularSelects();
    renderizarLocacoes();
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

function popularSelects() {
  const selCliente = document.getElementById('clienteSelect');
  const selFilme = document.getElementById('filmeSelect');

  if (!selCliente || !selFilme) return;

  selCliente.innerHTML = '<option value="">Selecione um cliente...</option>' +
    clientes.map(c => `<option value="${c._id}">${c.nome}</option>`).join('');

  selFilme.innerHTML = '<option value="">Selecione um filme...</option>' +
    filmes.map(f => `<option value="${f._id}">${f.titulo}</option>`).join('');
}

function atualizarResumo() {
  document.getElementById('totalGeral').textContent = locacoes.length;
  document.getElementById('totalAtivo').textContent = locacoes.filter(l => l.status === 'Ativo').length;
  document.getElementById('totalAtrasado').textContent = locacoes.filter(l => l.status === 'Atrasado').length;
  document.getElementById('totalDevolvido').textContent = locacoes.filter(l => l.status === 'Devolvido').length;
}

function renderizarLocacoes(lista = locacoes) {
  const tbody = document.getElementById('tabelaLocacoes');
  const contador = document.getElementById('contadorLocacoes');

  contador.textContent = lista.length;

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="table-empty">
            <div class="table-empty-icon">📋</div>
            <div class="table-empty-text">Nenhuma locação encontrada</div>
          </div>
        </td>
      </tr>
    `;
    atualizarResumo();
    return;
  }

  tbody.innerHTML = lista.map((loc, idx) => {
    const hoje = new Date().toISOString().split('T')[0];
    const atrasado = loc.dataDevolucao < hoje && loc.status !== 'Devolvido';

    return `
      <tr>
        <td>${String(idx + 1).padStart(2, '0')}</td>
        <td>${loc.clienteNome}</td>
        <td>${loc.filmeNome}</td>
        <td>${formatarData(loc.dataLocacao)}</td>
        <td>${formatarData(loc.dataDevolucao)} ${atrasado ? '⚠️' : ''}</td>
        <td><span class="status-badge ${classeStatus(loc.status)}">${loc.status}</span></td>
        <td>
          <div class="td-actions">
            <button class="btn btn-secondary btn-sm" onclick="editarLocacao('${loc._id}')">✏️ Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirLocacao('${loc._id}')">🗑️ Excluir</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  atualizarResumo();
}

async function salvarLocacao() {
  const form = document.getElementById('locacaoForm');
  const id = form.dataset.id;

  const clienteId = document.getElementById('clienteSelect').value;
  const filmeId = document.getElementById('filmeSelect').value;
  const dataLocacao = document.getElementById('dataLocacao').value;
  const dataDevolucao = document.getElementById('dataDevolucao').value;
  const status = document.getElementById('statusLocacao').value;

  if (!clienteId || !filmeId || !dataLocacao || !dataDevolucao) {
    alert('⚠️ Preencha todos os campos obrigatórios!');
    return;
  }

  if (dataDevolucao <= dataLocacao) {
    alert('⚠️ A data de devolução deve ser posterior à data de locação!');
    return;
  }

  const cliente = clientes.find(c => c._id === clienteId);
  const filme = filmes.find(f => f._id === filmeId);

  if (!cliente || !filme) {
    alert('⚠️ Cliente ou filme não encontrado!');
    return;
  }

  const locacao = {
    clienteNome: cliente.nome,
    filmeNome: filme.titulo,
    dataLocacao,
    dataDevolucao,
    status
  };

  try {
    if (id === "0") {
      await fetch(`${API_URL}/locacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locacao)
      });
    } else {
      await fetch(`${API_URL}/locacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locacao)
      });
    }

    limparFormulario();
    carregarDados();
  } catch (erro) {
    console.error("Erro ao salvar locação:", erro);
    alert("Erro ao salvar locação.");
  }
}

function editarLocacao(id) {
  const loc = locacoes.find(l => l._id === id);
  if (!loc) return;

  const cliente = clientes.find(c => c.nome === loc.clienteNome);
  const filme = filmes.find(f => f.titulo === loc.filmeNome);

  document.getElementById('clienteSelect').value = cliente ? cliente._id : '';
  document.getElementById('filmeSelect').value = filme ? filme._id : '';
  document.getElementById('dataLocacao').value = loc.dataLocacao;
  document.getElementById('dataDevolucao').value = loc.dataDevolucao;
  document.getElementById('statusLocacao').value = loc.status;

  document.getElementById('locacaoForm').dataset.id = id;
  document.getElementById('formTitulo').textContent = '✏️ Editando Locação';

  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

async function excluirLocacao(id) {
  const loc = locacoes.find(l => l._id === id);
  if (!loc) return;

  if (!confirm(`Deseja excluir a locação de "${loc.filmeNome}" para "${loc.clienteNome}"?`)) return;

  try {
    await fetch(`${API_URL}/locacoes/${id}`, {
      method: "DELETE"
    });

    carregarDados();
  } catch (erro) {
    console.error("Erro ao excluir locação:", erro);
    alert("Erro ao excluir locação.");
  }
}

function limparFormulario() {
  document.getElementById('clienteSelect').value = '';
  document.getElementById('filmeSelect').value = '';
  document.getElementById('dataLocacao').value = '';
  document.getElementById('dataDevolucao').value = '';
  document.getElementById('statusLocacao').value = 'Ativo';

  document.getElementById('locacaoForm').dataset.id = "0";
  document.getElementById('formTitulo').textContent = '📝 Registrar Locação';
}

let termoBusca = '';
let filtroStatus = '';

function aplicarFiltros() {
  let resultado = [...locacoes];

  if (filtroStatus) {
    resultado = resultado.filter(l => l.status === filtroStatus);
  }

  if (termoBusca) {
    const t = termoBusca.toLowerCase();
    resultado = resultado.filter(l =>
      l.clienteNome.toLowerCase().includes(t) ||
      l.filmeNome.toLowerCase().includes(t)
    );
  }

  renderizarLocacoes(resultado);
}

function filtrarLocacoes(termo) {
  termoBusca = termo;
  aplicarFiltros();
}

function filtrarPorStatus(status) {
  filtroStatus = status;
  aplicarFiltros();
}

document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
});