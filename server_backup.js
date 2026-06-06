const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro MongoDB:', err));

app.use(express.json());
app.use(cors());

let filmes = [
  {
    id: 1,
    titulo: 'Matrix',
    genero: 'Ficção Científica',
    diretor: 'Wachowski',
    ano: 1999,
    estoque: 5,
    disponivel: true
  }
];

app.get('/filmes', (req, res) => {
  res.json(filmes);
});

app.post('/filmes', (req, res) => {
  filmes.push(req.body);

  res.json({
    mensagem: 'Filme cadastrado',
    filme: req.body
  });
});

app.put('/filmes/:id', (req, res) => {
  const id = Number(req.params.id);

  const filme = filmes.find(f => f.id === id);

  if (!filme) {
    return res.status(404).json({
      erro: 'Filme não encontrado'
    });
  }

  Object.assign(filme, req.body);

  res.json(filme);
});

app.delete('/filmes/:id', (req, res) => {

  const id = Number(req.params.id);

  filmes = filmes.filter(f => f.id !== id);

  res.json({
    mensagem: 'Filme removido'
  });
});

app.get('/', (req, res) => {
  res.send('API da Locadora funcionando!');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});