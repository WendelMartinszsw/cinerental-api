/* ============================================================
   js/dados.js — Dados Fictícios Compartilhados
   Propósito: Simular um banco de dados em memória para
   demonstração da interface antes da integração com MongoDB.
   ============================================================ */

/**
 * Catálogo de filmes fictícios.
 * Cada objeto representa um documento que será armazenado
 * no MongoDB Atlas com esta mesma estrutura.
 */
const filmesMock = [
  {
    id: 1,
    titulo: "Oppenheimer",
    genero: "Drama/Histórico",
    diretor: "Christopher Nolan",
    ano: 2023,
    estoque: 5,
    disponivel: true
  },
  {
    id: 2,
    titulo: "Duna: Parte 2",
    genero: "Ficção Científica",
    diretor: "Denis Villeneuve",
    ano: 2024,
    estoque: 3,
    disponivel: true
  },
  {
    id: 3,
    titulo: "Pobres Criaturas",
    genero: "Comédia/Drama",
    diretor: "Yorgos Lanthimos",
    ano: 2023,
    estoque: 2,
    disponivel: false
  },
  {
    id: 4,
    titulo: "Zona de Interesse",
    genero: "Drama/Guerra",
    diretor: "Jonathan Glazer",
    ano: 2023,
    estoque: 4,
    disponivel: true
  },
  {
    id: 5,
    titulo: "Alien: Romulus",
    genero: "Terror/Ficção Científica",
    diretor: "Fede Álvarez",
    ano: 2024,
    estoque: 6,
    disponivel: true
  },
  {
    id: 6,
    titulo: "Furiosa",
    genero: "Ação/Aventura",
    diretor: "George Miller",
    ano: 2024,
    estoque: 0,
    disponivel: false
  }
];

/**
 * Lista de clientes fictícios.
 * Representa a coleção "clientes" no MongoDB Atlas.
 */
const clientesMock = [
  {
    id: 1,
    nome: "Ana Beatriz Silva",
    email: "ana.beatriz@email.com",
    telefone: "(11) 99456-7890"
  },
  {
    id: 2,
    nome: "Carlos Eduardo Mendes",
    email: "carlosmendes@email.com",
    telefone: "(21) 98234-5678"
  },
  {
    id: 3,
    nome: "Fernanda Rocha Lima",
    email: "fernanda.lima@email.com",
    telefone: "(31) 97654-3210"
  },
  {
    id: 4,
    nome: "João Pedro Alves",
    email: "joaopedro.alves@email.com",
    telefone: "(41) 96543-2109"
  },
  {
    id: 5,
    nome: "Mariana Oliveira Costa",
    email: "mariana.costa@email.com",
    telefone: "(51) 95432-1098"
  }
];

/**
 * Registro de locações fictícias.
 * Representa a coleção "locacoes" no MongoDB Atlas.
 * Referencia clientes e filmes pelos seus IDs (como ObjectId no Mongo).
 */
const locacoesMock = [
  {
    id: 1,
    clienteId: 1,
    clienteNome: "Ana Beatriz Silva",
    filmeId: 1,
    filmeNome: "Oppenheimer",
    dataLocacao: "2025-06-01",
    dataDevolucao: "2025-06-05",
    status: "Devolvido"
  },
  {
    id: 2,
    clienteId: 2,
    clienteNome: "Carlos Eduardo Mendes",
    filmeId: 2,
    filmeNome: "Duna: Parte 2",
    dataLocacao: "2025-06-03",
    dataDevolucao: "2025-06-07",
    status: "Ativo"
  },
  {
    id: 3,
    clienteId: 3,
    clienteNome: "Fernanda Rocha Lima",
    filmeId: 3,
    filmeNome: "Pobres Criaturas",
    dataLocacao: "2025-05-28",
    dataDevolucao: "2025-06-02",
    status: "Atrasado"
  },
  {
    id: 4,
    clienteId: 4,
    clienteNome: "João Pedro Alves",
    filmeId: 5,
    filmeNome: "Alien: Romulus",
    dataLocacao: "2025-06-04",
    dataDevolucao: "2025-06-08",
    status: "Ativo"
  },
  {
    id: 5,
    clienteId: 5,
    clienteNome: "Mariana Oliveira Costa",
    filmeId: 4,
    filmeNome: "Zona de Interesse",
    dataLocacao: "2025-06-02",
    dataDevolucao: "2025-06-06",
    status: "Devolvido"
  }
];

/* ============================================================
   Utilitários globais reutilizáveis em todas as páginas
   ============================================================ */

/**
 * Gera um novo ID incremental baseado no maior ID do array.
 * Substitui o ObjectId do MongoDB na fase de demonstração.
 * @param {Array} arr — array de objetos com propriedade "id"
 * @returns {number} — próximo ID disponível
 */
function gerarId(arr) {
  return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

/**
 * Formata uma data no padrão brasileiro (dd/mm/aaaa).
 * @param {string} dataISO — data no formato ISO (aaaa-mm-dd)
 * @returns {string} — data formatada
 */
function formatarData(dataISO) {
  if (!dataISO) return '—';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

/**
 * Retorna a classe CSS correta para cada status de locação.
 * @param {string} status — "Ativo" | "Atrasado" | "Devolvido"
 * @returns {string} — nome da classe CSS
 */
function classeStatus(status) {
  const mapa = {
    'Ativo':      'status-ativo',
    'Atrasado':   'status-atrasado',
    'Devolvido':  'status-devolvido'
  };
  return mapa[status] || 'status-devolvido';
}
