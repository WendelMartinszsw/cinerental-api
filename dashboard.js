/* ============================================================
   js/dashboard.js — Lógica do Painel Principal (index.html)
   Responsabilidade: Exibir estatísticas e atividades recentes
   ============================================================ */

/**
 * Exibe a data atual formatada no cabeçalho do dashboard.
 */
function exibirDataAtual() {
  const el = document.getElementById('currentDate');
  if (!el) return;
  const agora = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // Capitaliza a primeira letra
  const dataStr = agora.toLocaleDateString('pt-BR', opts);
  el.textContent = dataStr.charAt(0).toUpperCase() + dataStr.slice(1);
}

/**
 * Preenche os cards de estatísticas com os totais dos dados fictícios.
 * Quando integrado ao MongoDB, estes valores virão de chamadas à API.
 */
function carregarEstatisticas() {
  // Total de filmes cadastrados
  document.getElementById('totalFilmes').textContent = filmesMock.length;

  // Total de clientes
  document.getElementById('totalClientes').textContent = clientesMock.length;

  // Total de locações
  document.getElementById('totalLocacoes').textContent = locacoesMock.length;

  // Locações ainda em aberto (status "Ativo" ou "Atrasado")
  const emAberto = locacoesMock.filter(l => l.status !== 'Devolvido').length;
  document.getElementById('locacoesAtivas').textContent = emAberto;
}

/**
 * Renderiza a lista dos últimos filmes cadastrados no painel.
 * Exibe os 4 filmes mais recentes (últimos do array).
 */
function renderizarFilmesRecentes() {
  const container = document.getElementById('filmesRecentes');
  if (!container) return;

  // Pega os últimos 4 filmes e inverte para o mais novo primeiro
  const recentes = [...filmesMock].slice(-4).reverse();

  container.innerHTML = recentes.map(filme => `
    <li class="activity-item">
      <div class="activity-avatar">🎬</div>
      <div class="activity-info">
        <div class="activity-name">${filme.titulo}</div>
        <div class="activity-meta">${filme.genero} · ${filme.ano} · Dir. ${filme.diretor}</div>
      </div>
      <span class="status-badge ${filme.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
        ${filme.disponivel ? 'Disponível' : 'Indisponível'}
      </span>
    </li>
  `).join('');
}

/**
 * Renderiza a lista das últimas locações realizadas no painel.
 * Exibe as 4 locações mais recentes.
 */
function renderizarLocacoesRecentes() {
  const container = document.getElementById('locacoesRecentes');
  if (!container) return;

  const recentes = [...locacoesMock].slice(-4).reverse();

  container.innerHTML = recentes.map(loc => `
    <li class="activity-item">
      <div class="activity-avatar">👤</div>
      <div class="activity-info">
        <div class="activity-name">${loc.clienteNome}</div>
        <div class="activity-meta">${loc.filmeNome} · Dev: ${formatarData(loc.dataDevolucao)}</div>
      </div>
      <span class="status-badge ${classeStatus(loc.status)}">${loc.status}</span>
    </li>
  `).join('');
}

/* ============================================================
   Inicialização — executada quando o DOM estiver pronto
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  exibirDataAtual();
  carregarEstatisticas();
  renderizarFilmesRecentes();
  renderizarLocacoesRecentes();
});
