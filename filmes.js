/* ============================================================
   js/filmes.js — CRUD com API (Express)
   ============================================================ */

console.log("filmes.JS carregou");

let filmes = [];

/* =========================
   CARREGAR FILMES (GET)
========================= */
async function carregarFilmes() {
  try {
    const resposta = await fetch('https://cinerental-api.onrender.com/filmes');
    filmes = await resposta.json();
    renderizarFilmes();
  } catch (erro) {
    console.error('Erro ao carregar filmes:', erro);
  }
}

/* =========================
   RENDERIZAR TABELA
========================= */
function renderizarFilmes(lista = filmes) {
  const tbody = document.getElementById('tabelaFilmes');
  const contador = document.getElementById('contadorFilmes');

  contador.textContent = lista.length;

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="table-empty">
            <div class="table-empty-icon">🎬</div>
            <div class="table-empty-text">Nenhum filme encontrado</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = lista.map((filme, idx) => `
    <tr>
      <td>${String(idx + 1).padStart(2, '0')}</td>
      <td>${filme.titulo}</td>
      <td>${filme.genero}</td>
      <td>${filme.diretor}</td>
      <td>${filme.ano}</td>
      <td>${filme.estoque} un.</td>
      <td>
        <span class="status-badge ${filme.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
          ${filme.disponivel ? 'Disponível' : 'Indisponível'}
        </span>
      </td>
      <td>
        <button onclick="editarFilme('${filme._id}')">✏️</button>
        <button onclick="excluirFilme('${filme._id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

/* =========================
   SALVAR (POST / PUT)
========================= */
function salvarFilme() {
  const form = document.getElementById('filmeForm');
  const id = form.dataset.id;

  const titulo = document.getElementById('titulo').value.trim();
  const genero = document.getElementById('genero').value;
  const diretor = document.getElementById('diretor').value.trim();
  const ano = parseInt(document.getElementById('ano').value);
  const estoque = parseInt(document.getElementById('estoque').value);
  const disponivel = document.getElementById('disponivel').value === 'true';

  if (!titulo || !genero || !diretor || isNaN(ano) || isNaN(estoque)) {
    alert('⚠️ Preencha todos os campos!');
    return;
  }

  const filme = { titulo, genero, diretor, ano, estoque, disponivel };

 if (id === "0") {
    fetch('https://cinerental-api.onrender.com/filmes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme)
    }).then(() => carregarFilmes());

  } else {
    fetch(`https://cinerental-api.onrender.com/filmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme)
    }).then(() => carregarFilmes());
  }

  limparFormulario();
}

/* =========================
   EDITAR
========================= */
function editarFilme(id) {
  const filme = filmes.find(f => f._id === id);
  if (!filme) return;

  document.getElementById('titulo').value = filme.titulo;
  document.getElementById('genero').value = filme.genero;
  document.getElementById('diretor').value = filme.diretor;
  document.getElementById('ano').value = filme.ano;
  document.getElementById('estoque').value = filme.estoque;
  document.getElementById('disponivel').value = filme.disponivel;

  document.getElementById('filmeForm').dataset.id = id;
  document.getElementById('formTitulo').textContent = '✏️ Editando Filme';
}

/* =========================
   EXCLUIR (DELETE)
========================= */
function excluirFilme(id) {
  const filme = filmes.find(f => f._id === id);
  if (!filme) return;

  if (!confirm(`Deseja excluir "${filme.titulo}"?`)) return;

  fetch(`https://cinerental-api.onrender.com/filmes/${id}`, {
    method: 'DELETE'
  }).then(() => carregarFilmes());
}

/* =========================
   LIMPAR FORM
========================= */
function limparFormulario() {
  document.getElementById('titulo').value = '';
  document.getElementById('genero').value = '';
  document.getElementById('diretor').value = '';
  document.getElementById('ano').value = '';
  document.getElementById('estoque').value = '';
  document.getElementById('disponivel').value = 'true';

  document.getElementById('filmeForm').dataset.id = 0;
  document.getElementById('formTitulo').textContent = '📝 Cadastrar Filme';
}

/* =========================
   FILTRO
========================= */
function filtrarFilmes(termo) {
  const t = termo.toLowerCase();

  const filtrados = filmes.filter(f =>
    f.titulo.toLowerCase().includes(t) ||
    f.genero.toLowerCase().includes(t) ||
    f.diretor.toLowerCase().includes(t)
  );

  renderizarFilmes(filtrados);
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  carregarFilmes();
});