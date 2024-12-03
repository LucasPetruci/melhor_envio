import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Carregar variáveis do arquivo .env
dotenv.config();

const app = express();
const port = 3000;

// Verificar se as variáveis do .env foram carregadas
console.log("API_TOKEN:", process.env.API_TOKEN);
console.log("EMAIL:", process.env.EMAIL);

app.use(cors());
app.use(express.json());

app.post("/api/proxy", async (req, res) => {
  const { from, to, package: packageDetails } = req.body;
  console.log("Request Body Recebido no Proxy:", req.body);
  const apiUrl =
    "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate";

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.API_TOKEN}`,
    "User-Agent": `Aplicação ${process.env.EMAIL}`,
  };

  if (!from?.postal_code || !to?.postal_code || !packageDetails) {
    return res.status(400).json({
      error: "O JSON enviado está incompleto ou inválido.",
    });
  }

  console.log("Request Body Validado:", req.body);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("API Response:", data);
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Erro no proxy:", error);
    res.status(500).json({ error: "Erro ao processar a requisição" });
  }
});

app.listen(port, () => {
  console.log(`Proxy local rodando em http://localhost:${port}`);
});
