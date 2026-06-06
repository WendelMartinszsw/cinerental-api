/* ============================================================
   js/clientes.js — Gerenciamento de Clientes
   Responsabilidade: CRUD completo de clientes na interface.
   Futura integração: substituir operações no array "clientes"
   por chamadas à API REST do MongoDB Atlas.
   ============================================================ */

/**
 * Array em memória de clientes.
 * Inicializado com os dados fictícios de dados.js.
 * MongoDB: coleção "clientes".
 */
let clientes = [...clientesMock];

/* ============================================================
   RENDERIZAÇÃO DA TABELA
   ============================================================ */

/**
 * Renderiza a tabela de clientes.
 * @param {Array} lista — array de clientes a exibir (padrão: todos)
 */
function renderizarClientes(lista = clientes) {
  const tbody    = document.getElementById('tabelaClientes');
  const contador = document.getElementById('contadorClientes');

  contador.textContent = lista.length;

  // Mensagem quando não há registros
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

      <!-- Exibe avatar inicial do nome + nome completo -->
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

      <!-- E-mail com link mailto: -->
      <td>
        <a href="mailto:${cliente.email}"
           style="color: var(--text-secondary); text-decoration: none;"
           onmouseover="this.style.color='var(--gold)'"
           onmouseout="this.style.color='var(--text-secondary)'">
          ${cliente.email}
        </a>
      </td>

      <td style="color: var(--text-secondary);">${cliente.telefone}</td>

      <!-- Botões de ação -->
      <td>
        <div class="td-actions">
          <button class="btn btn-secondary btn-sm" onclick="editarCliente(${cliente.id})">
            ✏️ Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="excluirCliente(${cliente.id})">
            🗑️ Excluir
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ============================================================
   OPERAÇÕES CRUD
   ============================================================ */

/**
 * Salva um cliente (criação ou atualização).
 * Valida e-mail com regex básico antes de persistir.
 *
 * [MongoDB] Substituir por:
 *   POST /api/clientes     → cria novo documento
 *   PUT  /api/clientes/:id → atualiza documento existente
 */
function salvarCliente() {
  const form = document.getElementById('clienteForm');
  const id   = parseInt(form.dataset.id);

  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  // Validação básica de campos obrigatórios
  if (!nome || !email || !telefone) {
    alert('⚠️ Preencha todos os campos obrigatórios!');
    return;
  }

  // Validação simples de formato de e-mail
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    alert('⚠️ Informe um e-mail válido!');
    return;
  }

  if (id === 0) {
    /* ---- CRIAR novo cliente ---- */
    clientes.push({
      id: gerarId(clientes),
      nome,
      email,
      telefone
    });
  } else {
    /* ---- ATUALIZAR cliente existente ---- */
    const idx = clientes.findIndex(c => c.id === id);
    if (idx !== -1) {
      clientes[idx] = { id, nome, email, telefone };
    }
  }

  renderizarClientes();
  limparFormulario();
}

/**
 * Carrega os dados de um cliente no formulário para edição.
 * @param {number} id — ID do cliente
 *
 * [MongoDB] Substituir por:
 *   GET /api/clientes/:id
 */
function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  document.getElementById('nome').value     = cliente.nome;
  document.getElementById('email').value    = cliente.email;
  document.getElementById('telefone').value = cliente.telefone;

  document.getElementById('clienteForm').dataset.id = id;
  document.getElementById('formTitulo').textContent  = '✏️ Editando Cliente';

  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Exclui um cliente após confirmação.
 * @param {number} id — ID do cliente
 *
 * [MongoDB] Substituir por:
 *   DELETE /api/clientes/:id
 */
function excluirCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  if (!confirm(`Deseja excluir o cliente "${cliente.nome}"?`)) return;

  clientes = clientes.filter(c => c.id !== id);
  renderizarClientes();
}

/**
 * Reseta o formulário para o modo de criação.
 */
function limparFormulario() {
  document.getElementById('nome').value     = '';
  document.getElementById('email').value    = '';
  document.getElementById('telefone').value = '';

  document.getElementById('clienteForm').dataset.id = 0;
  document.getElementById('formTitulo').textContent  = '📝 Cadastrar Cliente';
}

/* ============================================================
   MÁSCARA DE TELEFONE
   ============================================================ */

/**
 * Aplica máscara de telefone brasileiro ao campo de input.
 * Formato: (99) 99999-9999 ou (99) 9999-9999
 * @param {HTMLInputElement} input — campo de telefone
 */
function mascaraTelefone(input) {
  // Remove tudo que não for dígito
  let v = input.value.replace(/\D/g, '');

  // Aplica a máscara progressivamente
  if (v.length <= 10) {
    // Telefone fixo: (99) 9999-9999
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    // Celular: (99) 99999-9999
    v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  input.value = v;
}

/* ============================================================
   FILTRO DE BUSCA
   ============================================================ */

/**
 * Filtra clientes por nome, e-mail ou telefone.
 * @param {string} termo — texto digitado na busca
 */
function filtrarClientes(termo) {
  const t = termo.toLowerCase();
  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(t)  ||
    c.email.toLowerCase().includes(t) ||
    c.telefone.includes(t)
  );
  renderizarClientes(filtrados);
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderizarClientes();
});
