const express = require('express');
const app = express();

let queue = [];

app.get('/spawn', (req, res) => {
    const username = req.query.username;
    if (username) {
        queue.push({ username: username, timestamp: Date.now() });
        console.log(`Novo evento de: ${username}`);
    }
    res.status(200).send("OK");
});

app.get('/get-events', (req, res) => {
    res.json(queue);
    queue = [];
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
