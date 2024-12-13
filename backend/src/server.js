import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import app from './routes/router.js';

//cria um servidor com express
const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));

//rota de teste
server.get('/ping',(req, res) => {
    res.json('pong');
})

server.use('/',app)

//Iniciando o servidor
server.listen(3000, () => {
    console.log("Servidor está rodando no link: http://localhost:3000/ping")
})

