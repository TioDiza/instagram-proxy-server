import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Permitir que qualquer site acesse
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Rota principal: busca perfil do Instagram via API
app.get("/perfil/:usuario", async (req, res) => {
  const usuario = req.params.usuario;
  // URL e parâmetro de usuário ATUALIZADOS!
  const url = `https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile_hover.php?username_or_url=${usuario}`;

  try {
    const resposta = await fetch(url, {
      headers: {
        "x-rapidapi-key": "b2611f32c1mshb06ddd7d92dfacep18cd9fjsn21844707bffe",
        "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com" // HOST ATUALIZADO!
      }
    });

    const dados = await resposta.json();
    res.json(dados);
  } catch (erro) {
    console.error("Erro na rota /perfil/:usuario:", erro);
    res.status(500).json({ erro: "Erro ao buscar perfil" });
  }
});

// Roda o servidor
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));