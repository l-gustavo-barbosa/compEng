/*
Basic client app example.
Author: Fabrício G. M. de Carvalho, DSc.
*/

/* express web framework */
const express = require("express");

/* component to read body requests from forms */
const bodyParser = require("body-parser");

/* module to generate requests to service gateway */
var axios = require("axios");
import { AxiosResponse, AxiosError } from "axios";
import Log from "./models/log";

const app = express();
const port = 5003;

/* Template engine configuration */
app.set("view engine", "ejs");
app.set("views", "./src/views");

/* Configuration to read post request parameters */
app.use(bodyParser.urlencoded({ extended: false }));

/* Static files directory configuration .*/
app.use(express.static("src/public"));

const insertLog = Log.getInstance();

//app.get('/addForm', addProjectHandlerForm);
app.get("/", root_client_handler);
app.post("/persist", persis_ticket_handler);
app.get("/persist_form", persist_client_handler);
app.listen(port, listenHandler);

/* Function to return text persistence interface */
function persist_client_handler(req: any, res: any) {
  res.render("database_insertion.ejs");
}

function root_client_handler(req: any, res: any) {
  res.render("form_tickets.ejs");
}

async function persis_ticket_handler(req: any, res: any) {
  let dbselected:string = req.body.sgdb == 'PG'? 'PostgreeSQL': req.body.sgdb == 'MG'? 'MongoDB': 'MariaDB';
  insertLog.info(`${dbselected} selected`)
  let type = req.body.type;
  let description = req.body.description;
  let sgdb = req.body.sgdb;
  let url =
    "http://localhost:5000/persistence?type=" +
    type +
    "&description=" +
    description +
    "&sgdb=" +
    sgdb;
  await axios
    .get(url)
    .then((response: AxiosResponse) => {
      if (description === "") {
        response.data = "Description cannot be empty";
      }
      res.render("response.ejs", { service_response: response.data });
      // Handle successful response
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      console.log(type);
      console.log(description);
      console.log(sgdb);      
    })
    .catch((error: AxiosError) => {
      // Handle error
      if (error.response) {
        // Server responded with some error status code
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // no response was sent
        console.error("Request:", error.request);
      } else {
        // Some processing error
        console.error("Error:", error.message);
      }
    });
}

/* Tratador para inicializar a aplicação (escutar as requisições)*/
function listenHandler() {
  console.log(`Escutando na porta ${port}!`);
  insertLog.info("Client App Started");
}

export {};
