import { Client } from "pg";
import Ticket from "./ticket";
import { MongoClient } from "mongodb";
import mariadb from "mariadb";
import Log from "./log";

const insertLog = Log.getInstance();

interface UserDAO {
  insertTicket(ticket: Ticket): any;
}

//Postgre
class UserDAOPG implements UserDAO {
  dbConfig: Object = {
    user: "postgres",
    host: "localhost",
    database: "uml",
    password: "123",
    port: 5432,
  };

  async insertTicket(ticket: Ticket) {
    const client = new Client(this.dbConfig);
    let data = { type: ticket.getType(), description: ticket.getDescription() };
    await client.connect();
    console.log("Database successfully connected.");
    insertLog.info("Postgre Database successfully connected.");
    // Executing a query
    const insertQuery =
      "INSERT INTO tickets(types, description) VALUES ($1, $2)"; //alt tipos to types, need to rename in postgreSQL database
    if (data.description === "" || data.type === "") {
      console.log("Error: Description cannot be empty");
      insertLog.error("Error: Description cannot be empty");
    } else {
      client
        .query(insertQuery, [data.type, data.description])
        .then((result) => {
          console.log("Data inserted successfully");
          insertLog.info("Data inserted successfully");
        })
        .catch((error) => {
          console.error("Error executing query", error);
          insertLog.error(error);
        })
        .finally(() => {
          console.log("connection closed");
          client.end();
        });
    }
  }
}

//Mongo
class UserDAOMongo implements UserDAO {
  dbConfig = {
    url: "mongodb://127.0.0.1:27017",
    databaseName: "uml",
  };

  async insertTicket(ticket: Ticket) {
    const client = new MongoClient(this.dbConfig.url);
    let data = { type: ticket.getType(), description: ticket.getDescription() };

    try {
      if (data.description === "" || data.type === "") {
        console.log("Error: Description cannot be empty");
        insertLog.error("Error: Description cannot be empty.");
      } else {
        await client.connect();
        console.log("Database successfully connected.");
        insertLog.info("MongoDB Database successfully connected.");

        const db = client.db(this.dbConfig.databaseName);
        const collection = db.collection("tickets");

        const result = await collection.insertOne(data);
        console.log("Data inserted successfully.", result);
        insertLog.info("Data inserted successfully.");
      }
    } catch (error) {
      console.error("Error executing query", error);
      insertLog.error(error);
    } finally {
      console.log("Connection closed");
      insertLog.info("Connection closed");
      await client.close();
    }
  }
}

//Maria
class UserDAOMdb implements UserDAO {
  dbConfig: Object = {
    user: "root",
    host: "localhost",
    database: "uml",
    password: "123",
    port: 3306,
  };

  async insertTicket(ticket: Ticket) {
    const connection = await mariadb.createConnection(this.dbConfig);
    let data = { type: ticket.getType(), description: ticket.getDescription() };
    const insertQuery = "INSERT INTO tickets(type, description) VALUES (?, ?)";
    
    try {
      if (data.description === "" || data.type === "") {
        console.log("Error: Description cannot be empty");
        insertLog.error("Error: Description cannot be empty.");
      } else {
        const result = await connection.query(insertQuery, [
          data.type,
          data.description,
        ]);
        console.log("Database successfully connected.");
        insertLog.info("MariaDB Database successfully connected.");
        console.log("Data inserted successfully", result);
        insertLog.info("Data inserted succesfully");
      }
    } catch (error) {
      console.error("Error executing query", error);
      insertLog.error(error);
    } finally {
      await connection.end();
      console.log("Connection closed");
      insertLog.info("Connection closed");
    }
  }
}
export { UserDAO, UserDAOPG, UserDAOMongo, UserDAOMdb };
