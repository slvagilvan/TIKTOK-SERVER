const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let queue = [];

// Recebe requisições do TikFinity e do teste no navegador
app.all('/spawn', (req, res) => {
    const username = req.query.username || req.body.username || (req.body && req.body.data ? req.body.data.username : null);
    
    if (username) {
        queue.push({ username: username, timestamp: Date.now() });
        console.log(`[Railway] Novo evento recebido de: ${username}`);
    } else {
        console.log("[Railway] Requisição recebida em /spawn, mas sem o parâmetro username.");
    }
    
    res.status(200).send("OK");
});

// Rota consultada pelo Roblox Studio a cada 2 segundos
app.get('/get-events', (req, res) => {
    res.json(queue);
    queue = [];
});

app.get('/', (req, res) => {
    res.send("Servidor TikTok-Roblox On-line!");
});

// Porta dinâmica para escutar conexões externas no Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
