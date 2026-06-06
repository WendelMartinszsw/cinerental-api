const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado!');
    console.log('URI usada:', process.env.MONGODB_URI);
  })
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
  console.log('GET /filmes lendo do banco:', mongoose.connection.db.databaseName);
  const filmes = await Filme.find();
  console.log('Quantidade no banco:', filmes.length);
  res.json(filmes);
});

app.post('/filmes', async (req, res) => {
  console.log('POST /filmes recebeu:', req.body);
  console.log('Salvando no banco:', mongoose.connection.db.databaseName);

  const filme = await Filme.create(req.body);

  console.log('Filme salvo com ID:', filme._id);

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
    description: 'CRUD de Filmes, Clientes e Locações'
  },
  paths: {
    '/filmes': {
      get: {
        summary: 'Listar filmes',
        responses: {
          200: { description: 'Lista de filmes' }
        }
      },
      post: {
        summary: 'Cadastrar filme',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string', example: 'TESTE FILME' },
                  genero: { type: 'string', example: 'Ação' },
                  diretor: { type: 'string', example: 'Wendel' },
                  ano: { type: 'number', example: 2026 },
                  estoque: { type: 'number', example: 10 },
                  disponivel: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Filme cadastrado' }
        }
      }
    },

    '/filmes/{id}': {
      put: {
        summary: 'Atualizar filme',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'COLE_O_ID_DO_FILME_AQUI'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string', example: 'Filme Atualizado' },
                  genero: { type: 'string', example: 'Drama' },
                  diretor: { type: 'string', example: 'Diretor Atualizado' },
                  ano: { type: 'number', example: 2026 },
                  estoque: { type: 'number', example: 5 },
                  disponivel: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Filme atualizado' }
        }
      },
      delete: {
        summary: 'Excluir filme',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'COLE_O_ID_DO_FILME_AQUI'
          }
        ],
        responses: {
          200: { description: 'Filme excluído' }
        }
      }
    },

    '/clientes': {
      get: {
        summary: 'Listar clientes',
        responses: {
          200: { description: 'Lista de clientes' }
        }
      },
      post: {
        summary: 'Cadastrar cliente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Cliente Teste' },
                  email: { type: 'string', example: 'cliente@teste.com' },
                  telefone: { type: 'string', example: '(73) 99999-9999' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Cliente cadastrado' }
        }
      }
    },

    '/clientes/{id}': {
      put: {
        summary: 'Atualizar cliente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'COLE_O_ID_DO_CLIENTE_AQUI'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Cliente Atualizado' },
                  email: { type: 'string', example: 'atualizado@teste.com' },
                  telefone: { type: 'string', example: '(73) 98888-8888' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Cliente atualizado' }
        }
      },
      delete: {
        summary: 'Excluir cliente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'COLE_O_ID_DO_CLIENTE_AQUI'
          }
        ],
        responses: {
          200: { description: 'Cliente excluído' }
        }
      }
    },

    '/locacoes': {
      get: {
        summary: 'Listar locações',
        responses: {
          200: { description: 'Lista de locações' }
        }
      },
      post: {
        summary: 'Cadastrar locação',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  clienteNome: { type: 'string', example: 'Cliente Teste' },
                  filmeNome: { type: 'string', example: 'TESTE FILME' },
                  dataLocacao: { type: 'string', example: '2026-06-06' },
                  dataDevolucao: { type: 'string', example: '2026-06-10' },
                  status: { type: 'string', example: 'Ativo' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Locação cadastrada' }
        }
      }
    },

    '/locacoes/{id}': {
      put: {
        summary: 'Atualizar locação',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'COLE_O_ID_DA_LOCACAO_AQUI'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  clienteNome: { type: 'string', example: 'Cliente Atualizado' },
                  filmeNome: { type: 'string', example: 'Filme Atualizado' },
                  dataLocacao: { type: 'string', example: '2026-06-06' },
                  dataDevolucao: { type: 'string', example: '2026-06-12' },
                  status: { type: 'string', example: 'Devolvido' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Locação atualizada' }
        }
      },
      delete: {
        summary: 'Excluir locação',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'COLE_O_ID_DA_LOCACAO_AQUI'
          }
        ],
        responses: {
          200: { description: 'Locação excluída' }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});