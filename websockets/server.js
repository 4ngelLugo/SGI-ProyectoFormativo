const WebSocket = require('ws');
const http = require('http');
const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        let data;
        try { data = JSON.parse(message); } catch { return; }
        if (data.rol) ws.rol = data.rol;
    });
});

// HTTP server para recibir notificaciones desde PHP
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/notify') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            let data;
            try { data = JSON.parse(body); } catch { data = null; }
            console.log('HTTP POST recibido:', data);
            if (data && data.tipo === 'reserva_nueva') {
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.rol === 'Almacenista') {
                        client.send(JSON.stringify(data));
                    }
                });
            }
            res.writeHead(200);
            res.end('OK');
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});
server.listen(8083, () => {
    console.log('Servidor HTTP escuchando en puerto 8083');
});