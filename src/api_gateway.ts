const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
import Log from "./models/log";

var cors = require('cors');
const app = express();

const port = 5000;

const insertLog = Log.getInstance();

/* Basic service endpoints: */
const persistence_service_endpoint: string = 'http://localhost:5002/persistOur';
const list_service_endpoint: string = 'http://localhost:5002/listTickets';
/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 


// Define a proxy middleware for '/capitalization' 
// and persistence requests
  
const persistence_target = persistence_service_endpoint;
const list_target = list_service_endpoint;

const persistence_proxy = createProxyMiddleware({
    target: persistence_target,
    changeOrigin: true, // Required for virtual hosted sites
    pathRewrite: { '^/persistence': '' }
  });

  const list_proxy = createProxyMiddleware({
    target: list_target,
    changeOrigin: true, // Required for virtual hosted sites
    pathRewrite: { '^/list': '' }
  });


app.use('/persistence', persistence_proxy); 
app.use('/list', list_proxy);
/* Server execution */
app.listen(port, listenHandler);

function listenHandler(){
    console.log(`Listening port ${port}!`);
    insertLog.info(`Api Gateway started.`)
}