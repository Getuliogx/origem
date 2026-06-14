const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

function carregarLista() {
  const arquivo = path.join(__dirname, "origens.txt");

  if (!fs.existsSync(arquivo)) {
    console.error("Arquivo origens.txt não encontrado.");
    return [];
  }

  const texto = fs.readFileSync(arquivo, "utf8");

  return texto
    .split(/\r?\n/)
    .map(linha => linha.trim())
    .filter(linha => linha && !linha.startsWith("#"));
}

app.get("/", (req, res) => {
  res
    .type("text/plain")
    .send("API do comando !origem está online. Use /origem");
});

app.get("/origem", (req, res) => {
  const lista = carregarLista();

  if (!lista.length) {
    return res
      .type("text/plain")
      .send("A lista de personagens está vazia ou o arquivo origens.txt não foi encontrado.");
  }

  const linha = lista[Math.floor(Math.random() * lista.length)];

  const partes = linha.split("|");
  const nome = (partes[0] || "").trim();
  const descricao = partes.slice(1).join("|").trim();

  res.set("Cache-Control", "no-store");

  if (descricao) {
    return res
      .type("text/plain")
      .send(`Você é: ${nome} — ${descricao}`);
  }

  return res
    .type("text/plain")
    .send(`Você é: ${nome}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
