/* ============================================================
   js/locacoes.js — Gerenciamento de Locações
   Responsabilidade: CRUD completo de locações na interface.
   Relaciona clientes (clientesMock) e filmes (filmesMock).
   Futura integração: chamadas à API REST / MongoDB Atlas.
   ============================================================ */

/**
 * Array em memória de locações.
 * MongoDB: coleção "locacoes" com referências (ObjectId)
 * para as coleções "clientes" e "filmes".
 */
let locacoes = [...locacoesMock];

/* ============================================================
   POPULAÇÃO DOS SELECTS
   ============================================================ */

/**
 * Preenche os <select> de clientes e filmes no formulário.
 * No MongoDB, estes dados virão de um endpoint que retorna
 * listas simplificadas (id + nome) para popular os selects.
 */
function popularSelects() {
  const selCliente = document.getElementById('clienteSelect');
  const selFilme   = document.getElementById('filmeSelect');

  if (!selCliente || !selFilme) return;

  // Guarda a opção vazia padrão
  const primeiraCliente = '<option value="">Selecione um cliente...</option>';
  const primeiraFilme   = '<option value="">Selecione um filme...</option>';

  // Gera opções de clientes a partir do array global
  selCliente.innerHTML = primeiraCliente + clientesMock
    .map(c => `<option value="${c.id}">${c.nome}</option>`)
    .join('');

  // Gera opções de filmes (apenas os disponíveis para nova locação)
  selFilme.innerHTML = primeiraFilme + filmesMock
    .map(f => `<option value="${f.id}" ${!f.disponivel ? 'disabled' : ''}>${f.titulo}${!f.disponivel ? ' (indisponível)' : ''}</option>`)
    .join('');
}

/* ============================================================
   CARDS DE RESUMO
   ============================================================ */

/**
 * Atualiza os cards de contagem de locações por status.
 */
function atualizarResumo() {
  document.getElementById('totalGeral').textContent    = locacoes.length;
  document.getElementById('totalAtivo').textContent    = locacoes.filter(l => l.status === 'Ativo').length;
  document.getElementById('totalAtrasado').textContent = locacoes.filter(l => l.status === 'Atrasado').length;
  document.getElementById('totalDevolvido').textContent = locacoes.filter(l => l.status === 'Devolvido').length;
}

/* ============================================================
   RENDERIZAÇÃO DA TABELA
   ============================================================ */

/**
 * Renderiza a tabela de locações na página.
 * @param {Array} lista — array de locações a exibir
 */
function renderizarLocacoes(lista = locacoes) {
  const tbody    = document.getElementById('tabelaLocacoes');
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
    return;
  }

  tbody.innerHTML = lista.map((loc, idx) => {
    // Verifica se a devolução está atrasada (data no passado e não devolvida)
    const hoje     = new Date().toISOString().split('T')[0];
    const atrasado = loc.dataDevolucao < hoje && loc.status !== 'Devolvido';

    return `
      <tr>
        <td style="color: var(--text-muted); font-size: .8rem;">${String(idx + 1).padStart(2, '0')}</td>

        <!-- Nome do cliente com avatar de inicial -->
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="
              width: 30px; height: 30px;
              background: var(--gold-dim);
              border: 1px solid var(--border-gold);
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              font-size: .75rem; color: var(--gold); font-weight: 700;
            ">
              ${loc.clienteNome.charAt(0)}
            </div>
            <span style="font-weight: 500;">${loc.clienteNome}</span>
          </div>
        </td>

        <td style="color: var(--text-secondary);">${loc.filmeNome}</td>

        <!-- Datas formatadas no padrão brasileiro -->
        <td style="color: var(--text-secondary);">${formatarData(loc.dataLocacao)}</td>

        <!-- Data de devolução com alerta visual se atrasada -->
        <td style="color: ${atrasado ? 'var(--danger)' : 'var(--text-secondary)'}; font-weight: ${atrasado ? '600' : '400'};">
          ${formatarData(loc.dataDevolucao)}
          ${atrasado ? '<span style="font-size:.7rem; margin-left:4px;">⚠️</span>' : ''}
        </td>

        <!-- Badge de status -->
        <td>
          <span class="status-badge ${classeStatus(loc.status)}">${loc.status}</span>
        </td>

        <!-- Ações: editar e excluir -->
        <td>
          <div class="td-actions">
            <button class="btn btn-secondary btn-sm" onclick="editarLocacao(${loc.id})">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-sm" onclick="excluirLocacao(${loc.id})">
              🗑️ Excluir
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Atualiza os cards de resumo sempre que a tabela re-renderizar
  atualizarResumo();
}

/* ============================================================
   OPERAÇÕES CRUD
   ============================================================ */

/**
 * Salva uma locação (criação ou atualização).
 * Valida campos e datas antes de persistir.
 *
 * [MongoDB] Substituir por:
 *   POST /api/locacoes     → cria nova locação
 *   PUT  /api/locacoes/:id → atualiza locação existente
 */
function salvarLocacao() {
  const form = document.getElementById('locacaoForm');
  const id   = parseInt(form.dataset.id);

  // Coleta os valores selecionados
  const clienteId      = parseInt(document.getElementById('clienteSelect').value);
  const filmeId        = parseInt(document.getElementById('filmeSelect').value);
  const dataLocacao    = document.getElementById('dataLocacao').value;
  const dataDevolucao  = document.getElementById('dataDevolucao').value;
  const status         = document.getElementById('statusLocacao').value;

  // Validação dos campos obrigatórios
  if (!clienteId || !filmeId || !dataLocacao || !dataDevolucao) {
    alert('⚠️ Preencha todos os campos obrigatórios!');
    return;
  }

  // Valida que a devolução é posterior à locação
  if (dataDevolucao <= dataLocacao) {
    alert('⚠️ A data de devolução deve ser posterior à data de locação!');
    return;
  }

  // Resolve os nomes para desnormalizar (padrão para exibição rápida)
  // No MongoDB, pode-se usar $lookup (aggregate) ou armazenar o nome
  const cliente = clientesMock.find(c => c.id === clienteId);
  const filme   = filmesMock.find(f => f.id === filmeId);

  if (!cliente || !filme) {
    alert('⚠️ Cliente ou filme não encontrado!');
    return;
  }

  if (id === 0) {
    /* ---- CRIAR nova locação ---- */
    locacoes.push({
      id:            gerarId(locacoes),
      clienteId,
      clienteNome:   cliente.nome,
      filmeId,
      filmeNome:     filme.titulo,
      dataLocacao,
      dataDevolucao,
      status
    });
  } else {
    /* ---- ATUALIZAR locação existente ---- */
    const idx = locacoes.findIndex(l => l.id === id);
    if (idx !== -1) {
      locacoes[idx] = {
        id,
        clienteId,
        clienteNome: cliente.nome,
        filmeId,
        filmeNome:   filme.titulo,
        dataLocacao,
        dataDevolucao,
        status
      };
    }
  }

  renderizarLocacoes();
  limparFormulario();
}

/**
 * Preenche o formulário com os dados da locação para edição.
 * @param {number} id — ID da locação
 *
 * [MongoDB] Substituir por:
 *   GET /api/locacoes/:id
 */
function editarLocacao(id) {
  const loc = locacoes.find(l => l.id === id);
  if (!loc) return;

  document.getElementById('clienteSelect').value  = loc.clienteId;
  document.getElementById('filmeSelect').value    = loc.filmeId;
  document.getElementById('dataLocacao').value    = loc.dataLocacao;
  document.getElementById('dataDevolucao').value  = loc.dataDevolucao;
  document.getElementById('statusLocacao').value  = loc.status;

  document.getElementById('locacaoForm').dataset.id = id;
  document.getElementById('formTitulo').textContent  = '✏️ Editando Locação';

  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Exclui uma locação após confirmação.
 * @param {number} id — ID da locação
 *
 * [MongoDB] Substituir por:
 *   DELETE /api/locacoes/:id
 */
function excluirLocacao(id) {
  const loc = locacoes.find(l => l.id === id);
  if (!loc) return;

  const msg = `Deseja excluir a locação de "${loc.filmeNome}" para "${loc.clienteNome}"?`;
  if (!confirm(msg)) return;

  locacoes = locacoes.filter(l => l.id !== id);
  renderizarLocacoes();
}

/**
 * Reseta o formulário para o modo criação.
 */
function limparFormulario() {
  document.getElementById('clienteSelect').value  = '';
  document.getElementById('filmeSelect').value    = '';
  document.getElementById('dataLocacao').value    = '';
  document.getElementById('dataDevolucao').value  = '';
  document.getElementById('statusLocacao').value  = 'Ativo';

  document.getElementById('locacaoForm').dataset.id = 0;
  document.getElementById('formTitulo').textContent  = '📝 Registrar Locação';
}

/* ============================================================
   FILTROS
   ============================================================ */

/** Termo de busca atual para manter filtros combinados */
let termoBusca   = '';
let filtroStatus = '';

/**
 * Aplica filtros combinados (busca textual + status).
 * Garante que os dois filtros coexistam.
 */
function aplicarFiltros() {
  let resultado = [...locacoes];

  // Filtro de status
  if (filtroStatus) {
    resultado = resultado.filter(l => l.status === filtroStatus);
  }

  // Filtro textual (cliente ou filme)
  if (termoBusca) {
    const t = termoBusca.toLowerCase();
    resultado = resultado.filter(l =>
      l.clienteNome.toLowerCase().includes(t) ||
      l.filmeNome.toLowerCase().includes(t)
    );
  }

  renderizarLocacoes(resultado);
}

/**
 * Atualiza o termo de busca e reaplicar filtros.
 * @param {string} termo — texto de busca
 */
function filtrarLocacoes(termo) {
  termoBusca = termo;
  aplicarFiltros();
}

/**
 * Atualiza o filtro de status e reaplica filtros.
 * @param {string} status — valor do select de status
 */
function filtrarPorStatus(status) {
  filtroStatus = status;
  aplicarFiltros();
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  popularSelects();    // Popula os dropdowns de clientes e filmes
  renderizarLocacoes(); // Renderiza a tabela com dados iniciais
});
