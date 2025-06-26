const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload local temporário
const upload = multer({ dest: 'uploads/' });

// Instância do Azure Blob
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
const containerName = 'documentos'; // deve já existir no Azure

// Função para fazer upload para o Blob
async function uploadParaBlob(pathLocal, nomeArquivo) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(nomeArquivo);

  const uploadBlobResponse = await blockBlobClient.uploadFile(pathLocal);
  console.log(`Arquivo enviado. Request ID: ${uploadBlobResponse.requestId}`);
}

// Rota de matrícula
app.post('/matricula', upload.single('documento'), async (req, res) => {
  try {
    const { nome, email, curso } = req.body;
    const documento = req.file;

    if (!documento) {
      return res.status(400).json({ erro: 'Nenhum documento enviado.' });
    }

    // Envia para o Blob Storage
    await uploadParaBlob(documento.path, documento.originalname);

    // Remove o arquivo local
    fs.unlinkSync(documento.path);

    // Resposta simulando sistema
    res.json({
      mensagem: `Olá, ${nome}. Seu documento foi recebido e sua matrícula está em processamento.`,
      status: 'processando'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao processar matrícula.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
