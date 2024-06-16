import { Client } from 'pg';
import Ticket from './ticket';


interface UserDAO{
    insertTicket(ticket:Ticket):any;
}



class UserDAOPG implements UserDAO{
    dbConfig:Object = {
        user: 'postgres',
        host: 'localhost',
        database: 'uml',
        password: '123',
        port: 5432
    }; 

    async insertTicket(ticket:Ticket){        

        const client = new Client(this.dbConfig);
        let data={'type': ticket.getType(), 'description':ticket.getDescription()};
         await client.connect();
         console.log('Database successfully connected.');
         // Executing a query 
         const insertQuery = 'INSERT INTO tickets(tipos, description) VALUES ($1, $2)';
          client.query(insertQuery, [data.type, data.description])
                .then(result => {
                    console.log('Data inserted successfully');                    
                })
                .catch(error => {
                    console.error('Error executing query', error);                    
                })
                .finally(() => {
                    console.log("connection closed");
                    client.end();                   
                });                            
                 
    }
}

class UserDAOMdb implements UserDAO{
    dbConfig:Object = {
        user: 'postgres',
        host: 'localhost',
        database: 'uml',
        password: '123',
        port: 5432
    }; 

    insertTicket(ticket: Ticket) {
        console.log('oiii');
    }
    
}

class UserDAOMongo implements UserDAO{
    dbConfig:Object = {
        user: 'postgres',
        host: 'localhost',
        database: 'uml',
        password: '123',
        port: 5432
    }; 
    
    insertTicket(ticket: Ticket) {
        console.log("tchau")
    }

}
export{
    UserDAO, UserDAOPG, UserDAOMongo, UserDAOMdb
}


