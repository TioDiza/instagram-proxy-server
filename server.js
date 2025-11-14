// server.js (Versão Final com Proxy de Imagem)

// 1. Importar as bibliotecas necessárias
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Chave de API das variáveis de ambiente
const APIFY_TOKEN = process.env.APIFY_TOKEN;

// 2. Habilitar o CORS para todas as rotas
app.use(cors());

// =====================================================================
// ROTA PRINCIPAL: BUSCAR DADOS DO PERFIL DO INSTAGRAM
// =====================================================================
app.get("/perfil/:usuario", async (req, res) => {
  // ... (código da rota de perfil, sem alterações)
  const usuario = req.params.usuario;

  if (!APIFY_TOKEN) {
    console.error("ERRO GRAVE: A variável de ambiente APIFY_TOKEN não foi definida!");
    return res.status(500).json({ erro: "Configuração do servidor incompleta." });
  }

  const apifyApiUrl = `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

  try {
    console.log(`🚀 Iniciando busca para o usuário: ${usuario}`);

    const response = await axios.post(apifyApiUrl, {
        "usernames": [usuario]
    });

    console.log("✅ Busca na Apify concluída com sucesso.");

    if (response.data && response.data.length > 0) {
      res.json(response.data[0]);
    } else {
      res.status(404).json({ erro: `Perfil "${usuario}" não encontrado ou a API não retornou dados.` });
    }

  } catch (error) {
    console.error("❌ Erro ao chamar a API da Apify:", error.response ? error.response.data : error.message);
    res.status(500).json({ erro: "Ocorreu um erro no servidor ao tentar buscar os dados." });
  }
});

// =====================================================================
// NOVA ROTA: PROXY PARA IMAGENS DO INSTAGRAM
// Esta rota precisa estar presente no seu servidor!
// =====================================================================
app.get('/image-proxy', async (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).send('A URL da imagem é obrigatória.');
    }

    console.log(`🖼️  Recebendo requisição de proxy para a imagem: ${imageUrl}`);

    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);

  } catch (error) {
    console.error(`❌ Erro ao fazer proxy da imagem: ${error.message}`);
    res.status(500).send('Ocorreu um erro ao processar a imagem.');
  }
});

// Roda o servidor
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT} com proxy de imagem ativado.`));
