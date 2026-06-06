/* ============================================================
   js/clientes.js — CRUD de Clientes com API
   ============================================================ */

console.log("clientes.js carregou");

const API_URL = "https://cinerental-api.onrender.com";

let clientes = [];

/* =========================
   CARREGAR CLIENTES
========================= */
async function carregarClientes() {
  try {
    const resposta = await fetch(`${API_URL}/clientes`);
    clientes = await resposta.json();
    renderizarClientes();
  } catch (erro) {
    console.error("Erro ao carregar clientes:", erro);
  }
}

/* =========================
   RENDERIZAR TABELA
========================= */
function renderizarClientes(lista = clientes) {
  const tbody = document.getElementById('tabelaClientes');
  const contador = document.getElementById('contadorClientes');

  contador.textContent = lista.length;

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="table-empty">
            <div class="table-empty-icon">👥</div>
            <div class="table-empty-text">Nenhum cliente encontrado</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = lista.map((cliente, idx) => `
    <tr>
      <td style="color: var(--text-muted); font-size: .8rem;">${String(idx + 1).padStart(2, '0')}</td>

      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="
            width: 32px; height: 32px;
            background: var(--gold-dim);
            border: 1px solid var(--border-gold);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: .8rem; color: var(--gold); font-weight: 700;
          ">
            ${cliente.nome.charAt(0).toUpperCase()}
          </div>
          <span style="font-weight: 600;">${cliente.nome}</span>
        </div>
      </td>

      <td>
        <a href="mailto:${cliente.email}"
           style="color: var(--text-secondary); text-decoration: none;"
           onmouseover="this.style.color='var(--gold)'"
           onmouseout="this.style.color='var(--text-secondary)'">
          ${cliente.email}
        </a>
      </td>

      <td style="color: var(--text-secondary);">${cliente.telefone}</td>

      <td>
        <div class="td-actions">
          <button class="btn btn-secondary btn-sm" onclick="editarCliente('${cliente._id}')">
            ✏️ Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="excluirCliente('${cliente._id}')">
            🗑️ Excluir
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* =========================
   SALVAR CLIENTE
========================= */
async function salvarCliente() {
  const form = document.getElementById('clienteForm');
  const id = form.dataset.id;

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !email || !telefone) {
    alert('⚠️ Preencha todos os campos obrigatórios!');
    return;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    alert('⚠️ Informe um e-mail válido!');
    return;
  }

  const cliente = { nome, email, telefone };

  try {
    if (id === "0") {
      await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });
    } else {
      await fetch(`${API_URL}/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });
    }

    limparFormulario();
    carregarClientes();
  } catch (erro) {
    console.error("Erro ao salvar cliente:", erro);
    alert("Erro ao salvar cliente.");
  }
}

/* =========================
   EDITAR CLIENTE
========================= */
function editarCliente(id) {
  const cliente = clientes.find(c => c._id === id);
  if (!cliente) return;

  document.getElementById('nome').value = cliente.nome;
  document.getElementById('email').value = cliente.email;
  document.getElementById('telefone').value = cliente.telefone;

  document.getElementById('clienteForm').dataset.id = id;
  document.getElementById('formTitulo').textContent = '✏️ Editando Cliente';

  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

/* =========================
   EXCLUIR CLIENTE
========================= */
async function excluirCliente(id) {
  const cliente = clientes.find(c => c._id === id);
  if (!cliente) return;

  if (!confirm(`Deseja excluir o cliente "${cliente.nome}"?`)) return;

  try {
    await fetch(`${API_URL}/clientes/${id}`, {
      method: "DELETE"
    });

    carregarClientes();
  } catch (erro) {
    console.error("Erro ao excluir cliente:", erro);
    alert("Erro ao excluir cliente.");
  }
}

/* =========================
   LIMPAR FORMULÁRIO
========================= */
function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('telefone').value = '';

  document.getElementById('clienteForm').dataset.id = "0";
  document.getElementById('formTitulo').textContent = '📝 Cadastrar Cliente';
}

/* =========================
   MÁSCARA DE TELEFONE
========================= */
function mascaraTelefone(input) {
  let v = input.value.replace(/\D/g, '');

  if (v.length <= 10) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  input.value = v;
}

/* =========================
   FILTRO
========================= */
function filtrarClientes(termo) {
  const t = termo.toLowerCase();

  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(t) ||
    c.email.toLowerCase().includes(t) ||
    c.telefone.includes(t)
  );

  renderizarClientes(filtrados);
}

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener('DOMContentLoaded', () => {
  carregarClientes();
}); 