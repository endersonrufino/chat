const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app); //definindo http
const io = require('socket.io')(server); //definindo hss

app.use(express.static(path.join(__dirname, 'public'))); //arquivos publicos para a aplicação acessar
app.set('views', path.join(__dirname, 'public'));

//informando ao node que será usado arquivos html ao inves do padrão
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

//socket.emit enviar mensagem
//socket.on ouvir uma mensagem
//socket.broadcast.emit envia mensagem para todos os sockets

io.on('connect', socket => { //sempre que houver uma conexão
    console.log(`conectou: ${socket.id}`);

    socket.emit('previousMessage', messages);

    socket.on('sendMessage', data => { //recendo a mensagem que vem do front
        messages.push(data);

        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000); //porta onde esta rodando a aplicação