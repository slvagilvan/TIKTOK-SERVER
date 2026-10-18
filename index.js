const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let queue = [];

// Aceita GET e POST no /spawn (resolve o TikFinity e a porta)
app.all('/spawn', (req, res) => {
    const username = req.query.username || req.body.username || (req.body && req.body.data ? req.body.data.username : null);
    
    if (username) {
        queue.push({ username: username, timestamp: Date.now() });
        console.log(`Novo evento de: ${username}`);
    } else {
        console.log("Recebido /spawn mas sem campo username valido.");
    }
    
    res.status(200).send("OK");
});

// O Roblox consulta esta rota a cada 1 segundo
app.get('/get-events', (req, res) => {
    res.json(queue);
    queue = [];
});

app.get('/', (req, res) => {
    res.send("Servidor TikTok-Roblox Ativo!");
});

// Ajusta a porta para a Railway automaticamente
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
