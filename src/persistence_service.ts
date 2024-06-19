import { Request, Response } from "express";
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();


/* Each application must be executed in different ports if they are
at the same machine. */
const port = 5002;

/* Persistence class models */
import {UserDAO, UserDAOPG, UserDAOMdb, UserDAOMongo} from "./models/dao";
import ticketController from "./controller/ticketController";
import ticket from "./models/ticket";

/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: true}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 

/* Service route creation . */
app.get('/persistOur', persistence_handler);
/* Server execution */
app.listen(port, listenHandler);


/* Request handlers: */
/* Persistence Service Handler */
  async function persistence_handler(req:any, res:any){ 
    let controller = ticketController;
    let data = controller.insertTicket([req.query.type, req.query.description]);
    let user_dao: UserDAO = req.query.sgdb == 'PG' ? new UserDAOPG(): req.query.sgdb == 'MG' ? new UserDAOMongo() : new UserDAOMdb();
    await user_dao.insertTicket(data);
    res.end('Data inserted.')
}

function listenHandler(){
    console.log(`Listening port ${port}!`);
}