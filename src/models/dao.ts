import { Client } from "pg";
import Ticket from "./ticket";
import { MongoClient } from 'mongodb';
import mariadb from 'mariadb';

interface UserDAO {
  insertTicket(ticket: Ticket): any;
}

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
    // Executing a query
    const insertQuery =
      "INSERT INTO tickets(tipos, description) VALUES ($1, $2)";
    client
      .query(insertQuery, [data.type, data.description])
      .then((result) => {
        console.log("Data inserted successfully");
      })
      .catch((error) => {
        console.error("Error executing query", error);
      })
      .finally(() => {
        console.log("connection closed");
        client.end();
      });
  }
}

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
      console.log("Database successfully connected.");
  
      const insertQuery =
        "INSERT INTO tickets(type, description) VALUES (?, ?)";
  
      try {
        const result = await connection.query(insertQuery, [data.type, data.description]);
        console.log("Data inserted successfully", result);
      } catch (error) {
        console.error("Error executing query", error);
      } finally {
        console.log("Connection closed");
        await connection.end();
      }
    }
  }

class UserDAOMongo implements UserDAO {
  dbConfig = {
    url: "mongodb://localhost:27017",
    databaseName: "uml",
  };

  async insertTicket(ticket: Ticket) {
    const client = new MongoClient(this.dbConfig.url);
    let data = { type: ticket.getType(), description: ticket.getDescription() };

    try {
      await client.connect();
      console.log("Database successfully connected.");

      const db = client.db(this.dbConfig.databaseName);
      const collection = db.collection("tickets");

      const result = await collection.insertOne(data);
      console.log("Data inserted successfully", result);
    } catch (error) {
      console.error("Error executing query", error);
    } finally {
      console.log("Connection closed");
      await client.close();
    }
  }
}
export { UserDAO, UserDAOPG, UserDAOMongo, UserDAOMdb };
