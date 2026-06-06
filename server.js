const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro MongoDB:', err));

const filmeSchema = new mongoose.Schema({
  titulo: String,
  genero: String,
  diretor: String,
  ano: Number,
  estoque: Number,
  disponivel: Boolean
});

const clienteSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String
});

const locacaoSchema = new mongoose.Schema({
  clienteNome: String,
  filmeNome: String,
  dataLocacao: String,
  dataDevolucao: String,
  status: String
});

const Filme = mongoose.model('Filme', filmeSchema);
const Cliente = mongoose.model('Cliente', clienteSchema);
const Locacao = mongoose.model('Locacao', locacaoSchema);

// FILMES
app.get('/filmes', async (req, res) => {
  res.json(await Filme.find());
});

app.post('/filmes', async (req, res) => {
  const filme = await Filme.create(req.body);
  res.json({ mensagem: 'Filme cadastrado', filme });
});

app.put('/filmes/:id', async (req, res) => {
  const filme = await Filme.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!filme) return res.status(404).json({ erro: 'Filme não encontrado' });
  res.json(filme);
});

app.delete('/filmes/:id', async (req, res) => {
  const filme = await Filme.findByIdAndDelete(req.params.id);
  if (!filme) return res.status(404).json({ erro: 'Filme não encontrado' });
  res.json({ mensagem: 'Filme removido' });
});

// CLIENTES
app.get('/clientes', async (req, res) => {
  res.json(await Cliente.find());
});

app.post('/clientes', async (req, res) => {
  const cliente = await Cliente.create(req.body);
  res.json({ mensagem: 'Cliente cadastrado', cliente });
});

app.put('/clientes/:id', async (req, res) => {
  const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
  res.json(cliente);
});

app.delete('/clientes/:id', async (req, res) => {
  const cliente = await Cliente.findByIdAndDelete(req.params.id);
  if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
  res.json({ mensagem: 'Cliente removido' });
});

// LOCAÇÕES
app.get('/locacoes', async (req, res) => {
  res.json(await Locacao.find());
});

app.post('/locacoes', async (req, res) => {
  const locacao = await Locacao.create(req.body);
  res.json({ mensagem: 'Locação cadastrada', locacao });
});

app.put('/locacoes/:id', async (req, res) => {
  const locacao = await Locacao.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!locacao) return res.status(404).json({ erro: 'Locação não encontrada' });
  res.json(locacao);
});

app.delete('/locacoes/:id', async (req, res) => {
  const locacao = await Locacao.findByIdAndDelete(req.params.id);
  if (!locacao) return res.status(404).json({ erro: 'Locação não encontrada' });
  res.json({ mensagem: 'Locação removida' });
});

app.get('/', (req, res) => {
  res.send('API CineRental funcionando com MongoDB Atlas!');
});

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API CineRental',
    version: '1.0.0',
    description: 'CRUD de Filmes, Clientes e Locacoes'
  },
  paths: {
    '/filmes': {
      get: {
        summary: 'Listar filmes'
      },
      post: {
        summary: 'Cadastrar filme'
      }
    },
    '/filmes/{id}': {
      put: {
        summary: 'Atualizar filme'
      },
      delete: {
        summary: 'Excluir filme'
      }
    },
    '/clientes': {
      get: {
        summary: 'Listar clientes'
      },
      post: {
        summary: 'Cadastrar cliente'
      }
    },
    '/clientes/{id}': {
      put: {
        summary: 'Atualizar cliente'
      },
      delete: {
        summary: 'Excluir cliente'
      }
    },
    '/locacoes': {
      get: {
        summary: 'Listar locações'
      },
      post: {
        summary: 'Cadastrar locação'
      }
    },
    '/locacoes/{id}': {
      put: {
        summary: 'Atualizar locação'
      },
      delete: {
        summary: 'Excluir locação'
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});