// server.js (Versão API-Only)

// 1. Importar as bibliotecas necessárias
import express from 'express';
import axios from 'axios';
import cors from 'cors'; // 👈 IMPORTAR O PACOTE CORS

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ PASSO CRÍTICO: Pegar sua chave de API das variáveis de ambiente
const APIFY_TOKEN = process.env.APIFY_TOKEN;

// 2. Habilitar o CORS para todas as rotas
// Isso dirá ao navegador "É seguro permitir que outros sites acessem esta API"
app.use(cors()); // 👈 USAR O MIDDLEWARE CORS

// =====================================================================
// DICA DE PRODUÇÃO: Para mais segurança, você pode permitir apenas o domínio 
// do seu frontend em vez de todo mundo ('*'). Fica assim:
//
// const corsOptions = {
//   origin: 'https://seu-site-frontend.com' // Coloque a URL do seu frontend aqui
// };
// app.use(cors(corsOptions));
// =====================================================================


// 3. Rota da API que seu frontend vai chamar
app.get("/perfil/:usuario", async (req, res) => {
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

// Roda o servidor
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));