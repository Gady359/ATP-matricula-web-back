const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura upload de arquivos (temporário)
const upload = multer({ dest: 'uploads/' });

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Matrícula Online ativa!');
});

// Rota de matrícula
app.post('/matricula', upload.single('documento'), (req, res) => {
  const { nome, email, curso } = req.body;
  const documento = req.file;

  // Simula validações e gravação no "banco"
  console.log('Recebido:', { nome, email, curso, documento });

  // Simula resposta do sistema
  res.json({
    mensagem: `Olá ${nome}, seus dados estão sendo processados. Você receberá um e-mail em breve.`,
    status: 'processando'
  });
});

// Rota final (simula boas-vindas)
app.get('/boas-vindas', (req, res) => {
  res.json({
    mensagem: 'Sua matrícula foi concluída com sucesso! Bem-vindo(a) à PUCPR!',
    status: 'confirmado'
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});